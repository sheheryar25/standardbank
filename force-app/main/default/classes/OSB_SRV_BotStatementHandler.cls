/**
 *
 * Service class for statement generating and sending by the OneHub chat bot
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date March 2021
 */
public with sharing class OSB_SRV_BotStatementHandler {

    private static final Http REQUEST_SENDER = new Http();
    private static final Long TEN_MINUTES = 10 * 60 * 1000;
    private static final String ACTION_TYPE = 'ActionType',
            CASE_ID = 'CaseId',
            CONTACT_ID = 'ContactId',
            ACCOUNT_NO = '{accountNo}',
            LAST_7_DAYS = 'Last 7 days',
            LAST_30_DAYS = 'Last 30 days',
            ERROR_LOG_ID = 'ErrorLogId',
            SERVICE_TYPE = 'ServiceType',
            FILENAME_TIMESTAMP = 'yyyyMMdd.HHmmss',
            FILE_NAME_PATTERN = '{0}{1}.{2}.pdf',
            EMAIL_ADDRESS = 'clientservices@standardbank.com',
            STATEMENT_TEMPLATE = 'MAU_DCS_Statement',
            FAULT_TEMPLATE = 'MAU_DCS_Statement_Fault',
            PDF_CONTENT_TYPE = 'application/pdf',
            STATEMENT_NOT_GENERATED = 'Statement was not generated due to technical error, fault email was sent to the customer',
            STATEMENT_NOT_SENT = 'Statement was not sent due to a technical error, fault email was sent to the customer',
            STATEMENT_NOT_SENT_2 = 'Statement was generated, but neither the statement nor the fault email could be sent to the customer due to technical error',
            FAULT_EMAIL_NOT_SENT = 'Statement was not generated and fault email was not sent due to a technical error',
            STATEMENT_ERROR_ACTION_TYPE = 'Statement error',
            OSB_EMAIL_BANNER = 'OSB_VA_Email_Banner_Image',
            OSB_EMAIL_FOOTER = 'OSB_Email_Footer_Image';

    /**
     * Method for invoking Create_Case_From_Chat_Bot flow
     *
     * @param input UpdateCaseInput - input params for flow
     */
    public static void updateCase(UpdateCaseInput input) {
        if (Test.isRunningTest()) {
            return;
        }
        Map<String, Object> params = new Map<String, Object>();
        params.put(ACTION_TYPE, input.actionType);
        params.put(CASE_ID, input.caseId);
        params.put(CONTACT_ID, input.contactId);
        params.put(ERROR_LOG_ID, input.errorLogId);
        params.put(SERVICE_TYPE, input.serviceType);
        Flow.Interview.Create_Case_From_Chat_Bot caseFlow = new Flow.Interview.Create_Case_From_Chat_Bot(params);
        caseFlow.start();
    }

    /**
     * Method for creating and sending request to AWS statement generator and sending email with statement or fault email to the customer
     *
     * @param serializedInput String - serialized OSB_VA_EmailStatement_CTRL.EmailStatementInput
     */
    @Future(Callout=true)
    public static void callAWSStatementGenerator(String serializedInput) {
        OSB_VA_EmailStatement_CTRL.EmailStatementInput input = (OSB_VA_EmailStatement_CTRL.EmailStatementInput) JSON.deserialize(serializedInput, OSB_VA_EmailStatement_CTRL.EmailStatementInput.class);
        UpdateCaseInput updateCaseInput = new UpdateCaseInput();

        HttpResponse response;
        AWSStatementResponse responseBody;
        Boolean statementGenerated = true;
        Boolean statementSent;
        Messaging.SendEmailResult sendStatementResult;
        try {
            DCS_API_Token__c token = authenticateOnAWSStatementGenerator();
            AWSCallResult awsCallResult = triggerStatementGeneration(input, token.Access_Token__c);
            upsert token;
            response = awsCallResult.response;
            Log__c errorLog = awsCallResult.log;
            errorLog.Message__c += 'Input: ' + serializedInput + '\n';
            errorLog.Message__c += response.toString() + '\n';
            errorLog.Message__c += 'Response body: ' + response.getBody() + '\n';
            if (response.getStatusCode() != 200) {
                statementGenerated = false;
            } else {
                responseBody = (AWSStatementResponse) JSON.deserialize(response.getBody(), AWSStatementResponse.class);
            }
            handleAWSResponse(responseBody, statementGenerated, input, errorLog);
        } catch (Exception ex) {
            Log__c errorLog = new Log__c(Area__c = 'OneHub', Type__c = 'Error', Context_User__c = UserInfo.getUserId());
            errorLog.Message__c += 'Input: ' + serializedInput + '\n';
            errorLog.Message__c += ex.getMessage() + '\n';
            errorLog.Stack_trace__c += ex.getStackTraceString();
            statementGenerated = false;
            handleAWSResponse(responseBody, statementGenerated, input, errorLog);
        }
    }

    private static void handleAWSResponse(AWSStatementResponse responseBody, Boolean isStatementGenerated, OSB_VA_EmailStatement_CTRL.EmailStatementInput input, Log__c errorLog) {
        Messaging.SendEmailResult sendStatementResult;
        Boolean statementGenerated = isStatementGenerated;
        if (responseBody != null) {
            if (responseBody.hasError == true) {
                statementGenerated = false;
            }
        }
        if (statementGenerated == false) {
            handleStatementNotGenerated(input, errorLog, sendStatementResult);
            return;
        }
        sendStatementResult = sendEmailWithStatement(input.userId, responseBody.data, createFileName(input, 'Indian/Mauritius'), input.accountNumber);
        if (sendStatementResult.isSuccess()) {
            updateCaseOnSuccess(input);
            return;
        } else {
            handleStatementGenerated(input, errorLog, sendStatementResult);
            return;
        }
    }

    private static void handleStatementGenerated(OSB_VA_EmailStatement_CTRL.EmailStatementInput input, Log__c errorLog, Messaging.SendEmailResult sendStatementResult) {
        List<Messaging.SendEmailError> sendStatementErrors = sendStatementResult.getErrors();
        Messaging.SendEmailResult sendFaultEmailResult = sendFaultEmail(input.userId, input.accountNumber);
        if (sendFaultEmailResult.isSuccess()) {
            errorLog.Message__c += STATEMENT_NOT_SENT;
            errorLog.Message__c += 'Send statement errors:\n';
            for (Messaging.SendEmailError error : sendStatementErrors) {
                errorLog.Message__c += '-----------------------------\n';
                errorLog.Message__c += error.getMessage() + '\n';
            }
        } else {
            List<Messaging.SendEmailError> sendFaultErrors = sendFaultEmailResult.getErrors();
            errorLog.Message__c += 'Send statement errors:\n';
            for (Messaging.SendEmailError error : sendStatementErrors) {
                errorLog.Message__c += '-----------------------------\n';
                errorLog.Message__c += error.getMessage() + '\n';
            }
            errorLog.Message__c += 'Send fault email errors:\n';
            for (Messaging.SendEmailError error : sendFaultErrors) {
                errorLog.Message__c += '-----------------------------\n';
                errorLog.Message__c += error.getMessage() + '\n';
            }
        }
        insert errorLog;
        updateCaseOnError(input, errorLog);
        return;
    }

    private static void handleStatementNotGenerated(OSB_VA_EmailStatement_CTRL.EmailStatementInput input, Log__c errorLog, Messaging.SendEmailResult sendStatementResult) {
        sendStatementResult = sendFaultEmail(input.userId, input.accountNumber);
        if (sendStatementResult.isSuccess()) {
            errorLog.Message__c += STATEMENT_NOT_GENERATED;
        } else {
            errorLog.Message__c += FAULT_EMAIL_NOT_SENT + '\n';
            List<Messaging.SendEmailError> errors = sendStatementResult.getErrors();
            errorLog.Message__c += 'Email send errors:\n';
            for (Messaging.SendEmailError error : errors) {
                errorLog.Message__c += '-----------------------------\n';
                errorLog.Message__c += error.getMessage() + '\n';
            }
        }
        insert errorLog;
        updateCaseOnError(input, errorLog);
        return;
    }

    private static void updateCaseOnSuccess(OSB_VA_EmailStatement_CTRL.EmailStatementInput input) {
        UpdateCaseInput updateCaseInput = new UpdateCaseInput();
        updateCaseInput.actionType = OSB_SRV_BotPaymentTrackingHandler.CLOSE_CASE_ON_SUCCESS_ACTION;
        updateCaseInput.serviceType = 'Email statement';
        updateCaseInput.caseId = input.caseId;
        updateCaseInput.contactId = input.contactId;
        updateCase(updateCaseInput);
    }

    private static void updateCaseOnError(OSB_VA_EmailStatement_CTRL.EmailStatementInput input, Log__c errorLog) {
        UpdateCaseInput updateCaseInput = new UpdateCaseInput();
        updateCaseInput.actionType = OSB_SRV_BotPaymentTrackingHandler.CREATE_CHILD_CASE_ACTION;
        updateCaseInput.serviceType = 'Email statement';
        updateCaseInput.caseId = input.caseId;
        updateCaseInput.contactId = input.contactId;
        updateCaseInput.errorLogId = errorLog.Id;
        updateCase(updateCaseInput);
    }

    private static String createFileName(OSB_VA_EmailStatement_CTRL.EmailStatementInput input, String timezone) {
        return String.format(FILE_NAME_PATTERN, new List<String>{
                input.accountNumber.substring(0, 4),
                input.accountNumber.substring(input.accountNumber.length() - 3),
                Datetime.now().format(FILENAME_TIMESTAMP, timezone)
        });
    }

    private static AWSCallResult triggerStatementGeneration(OSB_VA_EmailStatement_CTRL.EmailStatementInput input, String token) {
        AWSCallResult awsCallResult = new AWSCallResult();
        Contact contactRecord = retrieveContactRecord(input.contactId);
        String password = createPassword(contactRecord);
        if (password == null) {
            throw new StringException(String.format('Password could not have been generated for the contact record, contact Id: {0}, contact email: {1}, contact identity number: {2}, contact passport number: {3}. To generate password Email and Identity_Number__c or OSB_Passport_Number__c on contact record have to be filled', new List<String>{
                    contactRecord.Id,
                    contactRecord.Email,
                    contactRecord.Identity_Number__c,
                    contactRecord.OSB_Passport_Number__c
            }));
        }
        setDatesForStatement(input);
        Map<String, String> requestBodyMap = new Map<String, String>();
        requestBodyMap.put('accountNo', input.accountNumber);
        requestBodyMap.put('fromDate', formatDate(input.statementStart, false));
        requestBodyMap.put('toDate', formatDate(input.statementEnd, true));
        requestBodyMap.put('password', password);
        String requestBody = JSON.serialize(requestBodyMap);
        HttpRequest request = OSB_VA_HttpRequestFactory.createAWSStatementRequest(requestBody, token);
        awsCallResult.response = REQUEST_SENDER.send(request);
        Log__c errorLog = new Log__c(Area__c = 'OneHub', Type__c = 'Error', Context_User__c = UserInfo.getUserId());
        errorLog.Message__c = request.toString() + '\n';
        errorLog.Message__c += 'Request body: ' + requestBody + '\n';
        awsCallResult.log = errorLog;
        return awsCallResult;
    }

    /**
     * Method for authenticating on AWS statement generator
     *
     * @return HttpResponse
     */
    public static DCS_API_Token__c authenticateOnAWSStatementGenerator() {
        DCS_API_Token__c token = DCS_API_Token__c.getInstance('AWS_Token');
        Long now = Datetime.now().getTime();
        if (token == null) {
            token = new DCS_API_Token__c();
            token.Name = 'AWS_Token';
        }
        if (token.Created_Time__c == null || Long.valueOf(token.Created_Time__c) + TEN_MINUTES < now) {
            HttpRequest request = OSB_VA_HttpRequestFactory.createAWSStatementAuthenticationRequest();
            HttpResponse response = REQUEST_SENDER.send(request);
            AWSTokenResponse parsedResponse = (AWSTokenResponse) JSON.deserialize(response.getBody(), AWSTokenResponse.class);
            now = Datetime.now().getTime();
            token.Created_Time__c = String.valueOf(now);
            token.Access_Token__c = parsedResponse.token;
        }
        return token;
    }

    private static String formatDate(Date dateInput, Boolean endOfDay) {
        if (dateInput == Date.today()) {
            Datetime nowDatetime = Datetime.now();
            return String.format('{0}-{1}-{2}T{3}:{4}:{5}.000', new List<String>{
                    String.valueOf(dateInput.year()),
                    zeroPad(String.valueOf(dateInput.month())),
                    zeroPad(String.valueOf(dateInput.day())),
                    zeroPad(String.valueOf(nowDatetime.hourGmt())),
                    zeroPad(String.valueOf(nowDatetime.minuteGmt())),
                    zeroPad(String.valueOf(nowDatetime.secondGmt()))
            });
        }
        String template = endOfDay ? '{0}-{1}-{2}T23:59:59.000' : '{0}-{1}-{2}T00:00:00.000';
        return String.format(template, new List<String>{
                String.valueOf(dateInput.year()),
                zeroPad(String.valueOf(dateInput.month())),
                zeroPad(String.valueOf(dateInput.day()))
        });
    }

    private static Messaging.SendEmailResult sendEmailWithStatement(String recipientId, String base64StatementData, String fileName, String accountNumber) {
        Messaging.SingleEmailMessage email = createEmailMessage(recipientId, STATEMENT_TEMPLATE);
        email.setHtmlBody(email.getHtmlBody().replace(ACCOUNT_NO, hideAccountNumberBeginning(accountNumber)));
        email.setSubject(email.getSubject().replace(ACCOUNT_NO, hideAccountNumberBeginning(accountNumber)));
        email.setFileAttachments(new List<Messaging.EmailFileAttachment>{
                prepareEmailAttachment(fileName, base64StatementData)
        });

        return Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{
                email
        }).get(0);
    }

    private static String zeroPad(String monthOrDay) {
        if (monthOrDay.length() == 1) {
            return '0' + monthOrDay;
        }
        return monthOrDay;
    }

    private static String hideAccountNumberBeginning(String accountNumber) {
        return String.format('******{0}', new List<String>{
                accountNumber.substring(accountNumber.length() - 3)
        });
    }

    private static String hideAccountNumberMiddle(String accountNumber) {
        return String.format('{0}******{1}', new List<String>{
                accountNumber.substring(0, 4),
                accountNumber.substring(accountNumber.length() - 3)
        });
    }

    private static Messaging.SendEmailResult sendFaultEmail(String recipientId, String accountNumber) {
        Messaging.SingleEmailMessage email = createEmailMessage(recipientId, FAULT_TEMPLATE);
        email.setHtmlBody(email.getHtmlBody().replace(ACCOUNT_NO, hideAccountNumberMiddle(accountNumber)));
        email.setSubject(email.getSubject().replace(ACCOUNT_NO, hideAccountNumberBeginning(accountNumber)));
        return Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{
                email
        }).get(0);
    }

    /**
     * Method generates password for protecting statement; password is created from combining Contact record's field values
     *
     * @param contactRecord Contact
     *
     * @return String
     */
    private static String createPassword(Contact contactRecord) {
        String emailAddress = contactRecord.Email;
        String id = contactRecord.Identity_Number__c;
        String passportNumber = contactRecord.OSB_Passport_Number__c;
        String password = '';
        if (emailAddress != null && emailAddress.length() >= 6) {
            password += emailAddress.substring(0, 6);
            if (id != null && id.length() >= 6) {
                password += id.substring(id.length() - 6);
                return password.toLowerCase();
            }
            if (passportNumber != null && passportNumber.length() >= 6) {
                password += passportNumber.substring(passportNumber.length() - 6);
                return password.toLowerCase();
            }
        }
        return null;
    }

    private static void setDatesForStatement(OSB_VA_EmailStatement_CTRL.EmailStatementInput input) {
        if (input.timePeriod == LAST_7_DAYS) {
            input.statementStart = Date.today().addDays(-7);
            input.statementEnd = Date.today();
            return;
        }
        if (input.timePeriod == LAST_30_DAYS) {
            input.statementStart = Date.today().addDays(-30);
            input.statementEnd = Date.today();
            return;
        }
        return;
    }

    private static Messaging.SingleEmailMessage createEmailMessage(String recipientId, String templateName) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        EmailTemplate templateRecord = UTL_EmailTemplate.getTemplate(templateName);
        String emailBody = templateRecord.HtmlValue.replace(OSB_EMAIL_BANNER, SRV_Document.newInstance().getImageLink(OSB_EMAIL_BANNER));
        emailBody = emailBody.replace(OSB_EMAIL_FOOTER, SRV_Document.newInstance().getImageLink(OSB_EMAIL_FOOTER));
        email.setSaveAsActivity(false);
        email.setOrgWideEmailAddressId(UTL_OrgWideEmailAddress.getAddressId(EMAIL_ADDRESS));
        email.setTargetObjectId(recipientId);
        email.setHtmlBody(emailBody);
        email.setSubject(templateRecord.Subject);
        return email;
    }

    private static Contact retrieveContactRecord(String contactId) {
        SEL_Contacts selector = SEL_Contacts.newInstance();
        return selector.selectById(new Set<Id>{
                Id.valueOf(contactId)
        }).get(0);
    }

    private static Messaging.EmailFileAttachment prepareEmailAttachment(String fileName, String base64FileContent) {
        Messaging.EmailFileAttachment emailAttachment = new Messaging.EmailFileAttachment();
        emailAttachment.setContentType(PDF_CONTENT_TYPE);
        emailAttachment.setFileName(fileName);
        emailAttachment.setBody(EncodingUtil.base64Decode(base64FileContent));
        return emailAttachment;
    }

    /**
     * DTO class with input parameters for Create_Case_From_Chat_Bot flow
     *
     * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
     * @date March 2021
     */
    public class UpdateCaseInput {
        public String actionType;
        public String caseId;
        public String contactId;
        public String errorLogId;
        public String serviceType;
    }

    /**
     * DTO class with for response from AWS statement generator
     *
     * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
     * @date March 2021
     */
    public class AWSStatementResponse {
        public Boolean hasError;
        public String errorMessage;
        public String data;
    }

    /**
     * DTO for response from AWS statement generator authentication endpoint
     *
     * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
     * @date April 2021
     */
    public class AWSTokenResponse {
        public String token;
    }

    /**
     * Wrapper for response from statement generation endpoint
     *
     * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
     * @date March 2021
     */
    public class AWSCallResult{
        public Log__c log;
        public HttpResponse response;
    }
}