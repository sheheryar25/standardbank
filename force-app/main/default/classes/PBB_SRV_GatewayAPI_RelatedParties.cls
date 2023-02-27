public with sharing class PBB_SRV_GatewayAPI_RelatedParties implements IService {
	private static final SRV_HttpRequestSender.IService HTTP_SERVICE = SRV_HttpRequestSender.newInstance();
	private static final PBB_SRV_GatewayRequestProvider.IService REQUEST_PROVIDER = PBB_SRV_GatewayRequestProvider.newInstance();
	private static final String URL_RELATED_PARTIES = '/customer-relationship-information/customer/';
	public class ApiException extends Exception { }
	public interface IService {
		Response getRelatedParties(Id clientId);
	}
	public static IService newInstance() {
		return(IService) ORG_Application.service.newInstance(IService.class);
	}

	public Response getRelatedParties(Id clientId) {
		Account[] contextRecords = SEL_Accounts.newInstance().selectGuidById(new Set<Id> {clientId});
		if(contextRecords.isEmpty()){
			throw new ApiException('Record not found');
		}
		HttpRequest req = buildCallRequest();
		req.setEndpoint('callout:gatewaynp' + URL_RELATED_PARTIES + Uuid.formatValue(contextRecords[0].GUID__c));
		req.setMethod('GET');

		HttpResponse resp = HTTP_SERVICE.send(req, 5);
		if (resp != null && resp.getStatusCode() == 200) {
			Response responseObj = (Response) JSON.deserialize(resp.getBody(), Response.class);
			return responseObj;
		} else if (resp != null && resp.getStatusCode() != 204) {
			throw new ApiException(String.format('Error! For client {0} Got {1} with {2}, body {3}', new List<String> { clientId, String.valueOf(resp.getStatusCode()), resp.getStatus(), resp.getBody() }));
		}
		return null;
	}

	private HttpRequest buildCallRequest() {
		HttpRequest req = REQUEST_PROVIDER.getRequestWithToken();
		req.setHeader('content-type', 'application/json');
		req.setTimeout(25000);
		req.setHeader('accept', 'application/json');
		return req;
	}

	public enum RelatedCustomerClassification {INDIVIDUAL,ENTERPRISE}

	public class Response {
		@AuraEnabled
		public RelationshipInformation relationshipInformation;
	}
	public class RelationshipInformation {
		@AuraEnabled
		public Relationship[] relationship;
	}

	public class Relationship {

		@AuraEnabled
		public String relatedCustomerGuid;
		@AuraEnabled
		public String companyLegalName;
		@AuraEnabled
		public String firstName;
		@AuraEnabled
		public String lastName;
		@AuraEnabled
		public String relationshipType;
		@AuraEnabled
		public String telephone;
		@AuraEnabled
		public RelatedCustomerClassification relatedCustomerClassification;
		@AuraEnabled
		public String mobile;
		@AuraEnabled
		public String email;
		@AuraEnabled
		public CustomerIdentificationInformation customerIdentificationInformation;
	}

	public class CustomerIdentificationInformation {
		@AuraEnabled
		public String customerIdentificationDocumentType;
		@AuraEnabled
		public String customerIdentificationDocumentNumber;
	}
	/*private class Request {
		public RequestCustomerDetails customerDetails;
		public Request(String clientGuid) {
			customerDetails = new RequestCustomerDetails();
			customerDetails.customerGuid = clientGuid;
		}
	}
	private class RequestCustomerDetails {
		public String customerGuid;
	}*/
}