/***
    @ Func Area     	:  PBB Lifestyle
    @ Author        	:  Mykhailo Reznyk
    @ Date          	:  04.11.2019
    @ User Story    	:  US-4424
    @ Description 	    :  APEX Controller class for PBB_Lifestyle_PMT_Overview_Client_Page component.
***/

public without sharing class PBB_Lifestyle_PMT_Overview_Controller {

/***
    @ param  	    :  Id 	                              clientId 	   Current Client Id
    @ return   	    :  Revenue_and_Profitability__c 	  recordData   Latest Revenue_and_Profitability__c object
    @ Description 	:  Retrieves the latest related to current Client(Account) Revenue_and_Profitability__c object. Returns null if no related Revenue_and_Profitability__c objects with such Client Id were found.
***/
    @AuraEnabled
    public static Revenue_and_Profitability__c fetchData(Id clientId){
        Revenue_and_Profitability__c[] recordsData = [SELECT Id, Net_Interest_Income__c, Non_Interest_Revenue__c, Avarage_Credit_Balance__c, Avarage_Debit_Balance__c, Impairments__c, PMT_extract_date__c, Operating_Income__c,
                                                    YTD_Avarage_Credit_Balance__c, YTD_Avarage_Debit_Balance__c, YTD_Impairments__c, YTD_Net_Interest_Income__c, YTD_Non_Interest_Revenue__c, YTD_Operating_Income__c
                                                    FROM Revenue_and_Profitability__c
                                                    WHERE Client_Name__c =: clientId
                                                    ORDER BY PMT_extract_date__c DESC NULLS LAST, CreatedDate DESC  LIMIT 1 ];
        if(recordsData.size() == 0){    
            return null;
        }

        return recordsData[0];
    }
}