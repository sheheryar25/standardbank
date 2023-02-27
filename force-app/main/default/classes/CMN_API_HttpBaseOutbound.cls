/**
 * @description The Base class for all API Web Service Calls (outbound, either SOAP or REST)
 *
 * @author Accenture
 *
 * @date 2019
 */
public virtual inherited sharing class CMN_API_HttpBaseOutbound extends CMN_API_HttpBase
{
	private static final Integer DEFAULT_TIMEOUT = 120000;//120 seconds
	private static final String DEBUG_REQUEST_BODY = 'Request: {0}.';
	private static final String DEBUG_REQUEST_TIME = 'Request took: {0} milliseconds.';
	private static final String DEBUG_RESPONSE_BODY = 'Response: {0}.';
	private static final String DEBUG_ENDPOINT = 'Endpoint: {0}';
	private static final String NAMED_CREDENTIAL_URL_FORMAT = 'callout:{0}{1}';
	private static final String ERROR_NO_TRIGGERING_OBJECT = 'A Triggering Object Id is Required.';

	@TestVisible
	protected transient HttpRequest request; // HTTP Request object used by Service Class
	@TestVisible
	protected transient HttpResponse response; // HTTP Response object used by Service Class
	protected transient Http httpObject;

	// Object stores settings for each webservice, like base endpoint, backoff period, max number of calls allowed etc.
	protected CMN_WebserviceSetting__mdt settings;

	/**
	 * @description Ensure you override this on descendant classes if you need to initialise global variables
	 */
	protected override virtual void initialise()
	{
		super.initialise();

		request = new HttpRequest();
		response = new HttpResponse();
		httpObject = new Http();

		setServiceSettings();
	}

	/**
	 * @description Method is use to get the base URL of a webservice, resolves named credential based URL's
	 *
	 * @return A URL without named credential details for query params etc.
	 */
	public String getBaseUrl()
	{
		String endPoint;

		if(settings != null && String.isNotBlank(settings.CMN_NamedCredential__c))
		{
			NamedCredential credential = CMN_DAL_NamedCredential.findByName(getServiceName());
			endPoint = credential == null ? endPoint : credential.Endpoint;
		}

		return endPoint;
	}

	/**
	 * @description Method is use to return the endpoint URL using in HTTP response.
	 *
	 * @return endpoint
	 */
	@TestVisible
	protected virtual String getWebServiceEndPoint()
	{
		String endPoint;

		if(settings != null && String.isNotBlank(settings.CMN_NamedCredential__c))
		{
			endPoint = String.format(NAMED_CREDENTIAL_URL_FORMAT, new String[] {settings.CMN_NamedCredential__c, String.isNotBlank(settings.CMN_Path__c) ? settings.CMN_Path__c : CMN_UTIL_String.EMPTY});
		}

		return endPoint;
	}

	protected virtual String getQueryParameters()
	{
		return null;
	}

	/**
	 * @description HTTP Character encoding, override if you want to define custom content encoding for service
	 *
	 * @return result
	 */
	public override virtual String getEncoding()
	{
		return HTTP_ENCODING_JSON;
	}

	/**
	 * @description The HTTP Service Timeout, override if you want to set a longer or short timeout
	 *
	 * @return result
	 */
	protected virtual Integer getTimeout()
	{
		return DEFAULT_TIMEOUT;
	}

	/**
	 * @description This method will be called if request is successful, ensure you override
	 * This method on descendant classes to consume response.
	 */
	protected virtual void parseResponse()
	{

	}

	/**
	 * @description Retrieves current Service username
	 *
	 * @return result
	 */
	protected String getUserName()
	{
		return settings != null ? settings.CMN_Username__c : null;
	}

	/**
	 * @description Retrieves current Service password
	 *
	 * @return result
	 */
	protected String getPassword()
	{
		return settings != null ? settings.CMN_Password__c : null;
	}

	/**
	 * @description The HTTP Verb that the service will use when making a request, override this if you want to change this for
	 * Descendant class
	 *
	 * @return result
	 */
	protected override virtual String getVerb()
	{
		String verb = super.getVerb();

		return String.isNotBlank(verb) ? verb : HTTP_VERB_POST;
	}

	protected virtual String getSettingsServiceName()
	{
		return getServiceName();
	}
	/**
	 * @description Method will return relevant webservice custom setting for the current Service  Name
	 * Ensure you have override getServiceName on descendant classes for this to retrieve custom setting
	 * If NO Custom Metadata found then a empty one will be created
	 */
	protected void setServiceSettings()
	{
		settings = CMN_DAL_WebserviceSetting.getMetadata(getSettingsServiceName());
	}

	/**
	 * @description Will read web service settings to determine if stack track should be added to exceptions
	 *
	 * @return A boolean; true will add stack track to exceptions
	 */
	protected override Boolean addStackTraceToExceptions()
	{
		Boolean addTrace = super.addStackTraceToExceptions();
		return settings != null ? settings.CMN_AddStackTraceToExceptions__c : addTrace;
	}

	/**
	 * @description Sets relevant HTTP headers, override if you need to add service specific headers
	 */
	protected virtual void setHeaders()
	{
		request.setMethod(getVerb());
		if(!HTTP_VERB_GET.equalsIgnoreCase(request.getMethod()))
		{
			request.setHeader(HTTP_CONTENT_TYPE, getEncoding());
		}
		request.setTimeout(getTimeout());
	}

	/**
	 * @description Method will set headers, body and endpoint, override this method on descendant
	 * if you need to change how this is done. Rarely necessary.
	 *
	 * @param body as input
	 *
	 * @return request
	 */
	protected virtual HttpRequest createRequest(String body)
	{
		setHeaders();

		if(String.isNotBlank(body) && !HTTP_VERB_GET.equalsIgnoreCase(request.getMethod()))
		{
			request.setBody(body);
		}

		String endPoint = getWebServiceEndPoint();
		String queryParams = getQueryParameters();

		endPoint = String.isNotBlank(queryParams) ? endPoint + '?' + queryParams : endPoint;

		callResult.Url = endPoint;

		request.setEndpoint(endPoint);

		callResult.requestBody = request.getBody();

		return request;
	}

	/**
	 * @description To get the endpoint from mock request
	 *
	 * @return CMN_API_HttpBaseOutboundMock
	 */
	protected virtual CMN_API_RestBaseOutboundMock getEndpointMock()
	{
		return new CMN_API_RestBaseOutboundMock();
	}

	/**
	 * @description This method is used to check the Object in the trigger
	 *
	 * @return result
	 */
	protected virtual Boolean triggeringObjectRequired()
	{
		return true;
	}

	/**
	 * @description Method checks to see if the web service should be allowed to run
	 *
	 * @return If true then the web service will be processed else aborted
	 */
	protected override Boolean canProcessRequest()
	{
		Boolean processRequest = super.canProcessRequest();

		if(processRequest && triggeringObjectRequired() && queueItem.CMN_TriggeringObjectId__c == null)
		{
			callResult.errors.add(ERROR_NO_TRIGGERING_OBJECT);
			processRequest = false;
		}

		return processRequest;
	}

	/**
	 * @description Method will send via HTTP relevant request, if the request fails or response is not valid not Status code 2xx
	 * Then Exception will be raise
	 *
	 * @param request result
	 *
	 * @return response
	 */
	private HttpResponse sendRequest(HttpRequest request)
	{
		if(Test.isRunningTest())
		{
			Test.setMock(HttpCalloutMock.class, getEndpointMock());
		}

		response = httpObject.send(request);

		final String methodName = getServiceName() + '/sendRequest';

		CMN_UTIL_Logger.info(String.format(DEBUG_ENDPOINT, new String[] {request.getEndpoint()}), methodName);
		CMN_UTIL_Logger.info(String.format(DEBUG_REQUEST_BODY, new String[] {request.getBody()}), methodName);
		CMN_UTIL_Logger.info(String.format(DEBUG_REQUEST_TIME, new String[] {String.valueOf(stopWatch.getTime())}), methodName);
		CMN_UTIL_Logger.info(String.format(DEBUG_RESPONSE_BODY, new String[] {response.getBody()}), methodName);

		callResult.statusCode = String.valueOf(response.getStatusCode());
		callResult.responseBody = response.getBody();
        system.debug('response.getBody()'+response.getBody());
		if(HTTP_VALID_CODES.contains(response.getStatusCode()))
		{
			callResult.completed = true;
		}
		else
		{
			callResult.failed = true;
		}

		return response;
	}

	/**
	 * @description Once a call is completed this method is called to persist call results back to Queue Item
	 * Override this on descendant classes if you want to update other data in the system
	 * This method will also initiate retry if necessary
	 */
	public override virtual void setQueueItemDetails()
	{
		super.setQueueItemDetails();

		// if callResult was successful, determine do we need to make another call in chain
		// else retry current call

		if(callResult.failed)
		{
			retry();
		}
	}

	/**
	 * @description This method will also initiate retry if necessary
	 */
	private void retry()
	{
		Decimal maxRetryCount = settings != null && settings.CMN_MaxRetriesNo__c != null ? settings.CMN_MaxRetriesNo__c : 0;

		if(queueItem.CMN_Retries__c < maxRetryCount)
		{
			Decimal backoffSecs = settings != null && settings.CMN_BackoffPeriod__c != null ? settings.CMN_BackoffPeriod__c : 0;
			backoffSecs = queueItem.CMN_Retries__c <= 0 ? backoffSecs : backoffSecs * queueItem.CMN_Retries__c;
			Datetime nextRetry = backoffSecs > 0 ? Datetime.now().addSeconds(backoffSecs.intValue()) : null;

			if(nextRetry != null)
			{
				CMN_DAL_WebserviceCallQueue.updateNextRetryInfo(queueItem, nextRetry);
			}
		}
	}

	/**
	 * @description Main process loop which controls the processing of outbound request and ensure result of call is logged
	 *
	 * @param queueItem The queueItem which will ultimately saved to record activity of webservice object
	 */
	public override void process(CMN_WebserviceCallQueue__c queueItem)
	{
		super.process(queueItem);

		if(canProcessRequest())
		{
			//Make the service call
			sendRequest(createRequest(getBody()));

			//Save the results of the service call

			if(callResult.completed)
			{
				parseResponse();
				registerDatabaseChanges();
			}
		}
		else
		{
			callResult.aborted = true;
		}

		// Update the QueueItem
		setQueueItemDetails();

		commitWork();
	}
}