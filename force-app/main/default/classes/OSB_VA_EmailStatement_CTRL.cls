/**
 *
 * Controller class with logic invoked from the OneHub chat bot
 *
 * @author Konrad Bruszewski (konrad.bruszewski@standardbank.co.za)
 * @date March 2021
 */
public with sharing class OSB_VA_EmailStatement_CTRL {

    /**
     * DTO class with params for requesting statement generation
     */
    public class EmailStatementInput {
        @InvocableVariable
        public String timePeriod;
        @InvocableVariable
        public Date statementStart;
        @InvocableVariable
        public Date statementEnd;
        @InvocableVariable
        public String contactId;
        @InvocableVariable
        public String accountNumber;
        @InvocableVariable
        public String caseId;
        @InvocableVariable
        public String userId;
    }

    /**
     * Invocable method for requesting statement generation
     *
     * @param inputs List<EmailStatementInput>
     *
     * @return List<String>
     */
    @InvocableMethod(Label='VA email statement')
    public static List<String> emailStatement(List<EmailStatementInput> inputs) {
        List<String> result = new List<String>();
        for(EmailStatementInput input : inputs){
            OSB_SRV_BotStatementHandler.callAWSStatementGenerator(JSON.serialize(input));
            result.add(String.format(System.Label.OSB_VA_ST_StatementDetails, new List<String>{
                    input.accountNumber,
                    createPeriodString(input)
            }));
        }
        return result;
    }

    private static String createPeriodString(EmailStatementInput input){
        if(input.timePeriod == 'Last 7 days' || input.timePeriod == 'Last 30 days'){
            return 'the ' + input.timePeriod.toLowerCase();
        }
        String period = String.valueOf(input.statementStart) + ' to ' + String.valueOf(input.statementEnd);
        return period;
    }
}