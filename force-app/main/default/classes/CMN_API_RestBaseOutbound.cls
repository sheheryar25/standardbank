/**
 * @description This is Base call for all Outbound REST API calls
 *
 * @author Accenture
 *
 * @date 2019
 */
public virtual class CMN_API_RestBaseOutbound extends CMN_API_HttpBaseOutbound
{
	public CMN_DTO_RestBaseRequest baseRequestDTO;
	public CMN_DTO_RestBaseResponse baseResponseDTO;
	protected Type baseResponseDTOType;

	/**
	 * @description Return the string concatenation of the basic authentication type
	 *
	 * @return result
	 */
	protected virtual String getAuthenticationString()
	{
		String userName = getUserName();

		return String.isBlank(userName) ?
				CMN_UTIL_String.EMPTY :
				HTTP_HEADER_AUTH_BASIC + EncodingUtil.base64Encode(Blob.valueOf(userName + ':' + getPassword()));
	}

	/**
	 * @description Method will retrieve data from SF (if necessary) and populate Request DTO with Data
	 * If the flag "dummyData" is set, fill the DTO with mock information and don't do query
	 * We are doing this to support unit tests
	 */
	protected virtual void populateRequestDTO()
	{
		baseRequestDTO.populate(queueItem.CMN_TriggeringObjectId__c);
	}

	/**
	 * @description Will serialize requestDTO after its been populated.
	 *
	 * @return result
	 */
	protected virtual override String getBody()
	{
		super.getBody();

		populateRequestDTO();

		return queueItem.CMN_Request__c != null ? queueItem.CMN_Request__c : baseRequestDTO.serialize();
	}

	protected virtual override void setHeaders()
	{
		super.setHeaders();

		request.setHeader(HTTP_HEADER_ACCEPT, HTTP_ACCEPT_WITH_CHARSET);

		String authString = getAuthenticationString();

		if(String.isNotEmpty(authString))
		{
			request.setHeader(HTTP_HEADER_AUTHORIZATION, authString);
		}
	}

	protected virtual override void initialise()
	{
		super.initialise();

		baseResponseDTO = new CMN_DTO_RestBaseResponse();
		baseRequestDTO = new CMN_DTO_RestBaseRequest();
		baseResponseDTOType = CMN_DTO_RestBaseResponse.class;
	}

	protected String getResponseBody()
	{
		return response.getBody();
	}

	protected virtual override void parseResponse()
	{
		super.parseResponse();

		String responseBody = getResponseBody();

		if(CMN_UTIL_String.isNotBlank(responseBody))
		{
			baseResponseDTO = (CMN_DTO_RestBaseResponse)JSON.deserialize(responseBody, baseResponseDTOType);
		}
	}
}