/*************************************************************************\
    @ Author        :     Wayne Solomon
    @ Date          :     23 Sep 2019
    @ Description   :     C-00002944 - Used a flag to temporarily disable a
                          validation rule to allow the save method to execute

    @ Author        :     Wayne Solomon
    @ Date          :     7 Oct 2019
    @ Description   :     C-00002944 - Removed code to bypass a validation rule.
                          Code moved to trigger util class
****************************************************************************/

public with sharing class OpportunityCloseRedirect_SF1_Ext {

    public Id recTypeId{get;set;}
    public Opportunity opp{get;set;}
    public string errorMsginsert{get;set;}
    public string navigateurl{get;set;}
    
 
    public OpportunityCloseRedirect_SF1_Ext (ApexPages.StandardController controller) {
       
        Opp = (Opportunity)controller.getRecord() ;
        
        recTypeId = [SELECT Id,name from RecordType where SObjectType = 'Opportunity' and Name = '3 - Closed Opportunity' LIMIT 1].id;
        
        opp.RecordTypeId = recTypeId ;
        opp.StageName = '' ;
    }

    public void save()
    {
        navigateurl = '';
        errorMsginsert = '';
        if (opp.StageName=='3 - Closed Won')
        {
        opp.Probability=100;
        }
        else if (opp.StageName=='4 - Closed Lost'){
        opp.Probability=0;
        }
        else if (opp.StageName=='Cancel'){
        opp.Probability=0;
        }
        else 
        opp.Probability=50;
        try{
            update opp;
            navigateurl = '/'+opp.id;
        }
        
        catch(DMLexception e)
        {
            system.debug('@@ e @@'+e);
            errorMsginsert = e.getDMLmessage(0);
        }
    } 
 }