/***
  	@ Func Area     	:  IB
  	@ Author        	:  Wayne Solomon
  	@ Modified Date    	:  19 Feb 2020
  	@ User Story    	:  US-4504 -- DM NBAC: SPV PDF copy at Supported and Submitted milestone - Read Only
  	@ Description 	    :  As a NBAC user I want to select Generate and Attach PDF.  In order to attach a copy of the
  	                       SPV NBAC PDF to the record. In this code I added new field for the constructor to grab and
  	                       removed commented code.  Amended the attachPDF to change the filename based on the milestone
  	                       of the business assessment
***/
public class attachNBACPdf {

    static final String CIBNBACSPVNOCIF = 'CibNbacSpvNoCif';
    static final String CIBNBACSPVCIF = 'CibNbacSpvCif';
    private final Business_Assessment__c b; //Business assessment object 
    
    //Constructor
    public attachNBACPdf(ApexPages.StandardController standardPageController) {
        List<String> fields = new List<String> {'Account__r.Name','RecordType.DeveloperName','Milestone__c'};
        if(!Test.isRunningTest()) standardPageController.addFields(fields);
        b = (Business_Assessment__c)standardPageController.getRecord();
    }
  
    //method called from the Visualforce's action attribute
    //generate and attach the PDF document
    public PageReference attachPDF() {
        String fileName;
        String rtName = b.RecordType.DeveloperName;
        if(b.Milestone__c=='Supported' &&
                rtName.contains(DMN_BusinessAssessment.RT_NBAC_JOINT_VENTURE) &&
                (FeatureManagement.checkPermission(CIBNBACSPVNOCIF) ||
                        FeatureManagement.checkPermission(CIBNBACSPVCIF)))
            fileName =  'NBAC Support Approved Form - ' + b.Account__r.Name + ' - '+ date.today().format() +'.pdf';
        else fileName =  'NBAC Form - ' + b.Account__r.Name + ' - '+ date.today().format() +'.pdf';

        PageReference pdfPage = new  PageReference('/apex/NBAC_PDF?id=' + b.Id); //create a page that references the NBAC PDF
        Blob pdfBlob; 
        if(!Test.isRunningTest()) pdfBlob = pdfPage.getContent();
        else pdfBlob = Blob.valueOf('Test.isRunningTest');

        ContentVersion contentVersion = new ContentVersion(Title = fileName, PathOnClient = fileName, VersionData = pdfBlob);
        insert contentVersion;

        Id contentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :contentVersion.Id].ContentDocumentId;

        ContentDocumentLink contentDocumentLink = new ContentDocumentLink(LinkedEntityId = b.Id, ContentDocumentId = contentDocumentId,
                ShareType = 'I');
        Database.SaveResult s = Database.insert(contentDocumentLink, false);

        pdfPage.setRedirect(false);

        return pdfPage;
    }
}