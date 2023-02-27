/*************************************************************************\
    @ Author        :     Shaveen Bageloo
    @ Date          :     13 Apr 2011
    @ Test File     :     OpportunityClassAndTriggerTests
    @ Description   :     General Trigger for Opportunties.
                          Following coding principals set out by 
                          CRM IT Developer team on 13 April 2011
                          All trigger code will be updated here going forward
                          More information will be on the Classes specified
    @ Last Modified By  :   Shaveen Bageloo
    @ Last Modified On  :   09 Jun 2011
    @ Last Modified Reason  :   Functionality change.  I have split the INSERT
                                and UPDATE to call 2 different functions in the
                                class and I have now used Trigger.newMap instead
                                of Trigger.New     
    @ Last Modified By  :   Caro Reinecke
    @ Last Modified On  :   10 Jun 2011
    @ Last Modified Reason  :   Regression - Globalise User Profiles: Moved validation rules and workflow code to trigger
                                Added the SA Global Markets Commodoties, Corporates and Buy-Side 
                                deals that are closed must be flagged for inclusion in the CRT Feed 
                                for opportunities that where created after March 2011.
    @ Last Modified By  :   Anurag Jain
    @ Last Modified On  :   15 Jun 2011
    @ Last Modified Reason  :   CASE1258 - Code updated to handle the setting of Actual Close Date.
                                This is to replace the workflow [SA Opps Closed] on Opportunity.
    @ Last Modified By  :   Anurag Jain
    @ Last Modified On  :   21 Jun 2011
    @ Last Modified Reason  :   CASE-01690 - Update start date on Opportunity creation if it is Blank. No code update has been done, the same code as for CASE1258 
                                mentioned above shall take care of this case as well.  
    @ Last Modified By  :   Charles Mutsu
    @ Last Modified On  :   31 Jan 2013
    @ Last Modified Reason  :   EN-0021 - Combine all the triggers on Opportunity into one trigger.
                                Updated the version from 21 to 27  
                                
    
    @ Last Modified By  : Manoj Gupta
    @ Last Modified on  :  Aug 2016
    @ Last Modified Reason  : US 1499 (DEF-002078): Moved the GameChanger logic from Opportunitytriggerutility to OpportunityTriggerHelper class                                                                                       
    
    
                                           
****************************************************************************/


trigger OpportunityTrigger on Opportunity (before insert, before update, before delete, after insert, after update, after delete) {

    System.Debug('## >>> Start of TRIGGER <<< ');
       
    if (Trigger.isBefore) {
        
        // Updates the Opportunity Owner Lookup to Opportunity OwnerId before insert and before update
        if(!Trigger.isDelete){ 
            for (Integer i=0;i<trigger.new.size();i++) {
                trigger.new[i].Opportunity_Owner_Lookup__c=trigger.new[i].OwnerId;
            }
        }
        // Before insert
        if (Trigger.isInsert) {
            
            //CASE740 - Update Opportunity fields with Opportunity Owner''s User Details
            List<Opportunity> listOpportunityUpdate = new OptyClosedOwnerDetailUpdate().copyOppOwnerDetails(Trigger.new);
            
            //1. Regression Check if CRT Flag (SA_Won__c) must be set for closed opportunities
            //2. CASE1258 - Update Actual Close Date
            //3. CASE1690 - Update Start Date
            OpportunityTriggerUtility.handleOpportunityBeforeInsertTrigger(Trigger.new);
        }
        // Before update
        else if (Trigger.isUpdate) {
            
            // Before Update, call the logic to add Opp Team Member
            OpportunityTriggerUtility.addOwnerAsTeamMember(Trigger.newMap, Trigger.oldMap,false);
            //CASE740 - Update Opportunity fields with Opportunity Owner''s User Details
            List<Opportunity> listOpportunityUpdate = new OptyClosedOwnerDetailUpdate().copyOppOwnerDetails(Trigger.new, Trigger.oldMap);   
    
            //1. Regression Check if CRT Flag (SA_Won__c) must be set for closed opportunities
            //2. CASE1258 - Update Actual Close Date
            OpportunityTriggerUtility.handleOpportunityBeforeUpdateTrigger(Trigger.oldMap, Trigger.newMap);
        // Before delete
        }else { 
            // Delete all the ClientTeamOpportunity_Products__c on before delete
            List<ClientTeamOpportunity_Products__c> ctop_to_del=[select Id,Opportunity__c,Product__c,Custom_Client_Team__c from ClientTeamOpportunity_Products__c where Opportunity__c in :Trigger.oldMap.keySet()];   
            if(ctop_to_del.size()>0){
                 delete ctop_to_del;
             }  
        }
    }
    
    //System.Debug('## >>> END of TRIGGER <<< ');   
    
    else{
        // After Insert or Update Add Owner as Team Member
        if(Trigger.isInsert || Trigger.isUpdate) {
            OpportunityTriggerUtility.addOwnerAsTeamMember(Trigger.newMap, Trigger.oldMap, true);
            SHR_Opportunity.manageSharing(Trigger.new, Trigger.oldMap);
            //DMN_Opportunity.createTasks((Opportunity[])Trigger.new);
        }

            
        // After update syncing the CTO-Products
        if(Trigger.isUpdate){
            Map<Id, Opportunity> oppToUpdate = new Map<Id, Opportunity>();
            for (Opportunity opp : (Opportunity[])Trigger.new) {
                Opportunity oldRecord = (Opportunity)Trigger.oldMap.get(opp.Id);
                if (opp.Price_Sensitive__c != oldRecord.Price_Sensitive__c) {
                    oppToUpdate.put(opp.Id, opp);
                }
            }
            if(!oppToUpdate.isEmpty()) {
                DMN_Opportunity.populateValuesOnOppAssessment(oppToUpdate);
            }
            OpportunityTriggerUtility.syncClientTeamOpportunityProducts(Trigger.new, Trigger.old);
            OpportunityTriggerUtility.SendEmailforPrivateOpp(Trigger.newMap,Trigger.oldMap);
            OpportunityTriggerUtility.SendEmailforOwnerChanged(Trigger.newMap,Trigger.oldMap);
            OpportunityTriggerHelper.calculateRevenueGameChanger(Trigger.new, Trigger.old);
            OpportunityTriggerHelper.calculateClientsOpptyIdentifiedRevenue(Trigger.new, Trigger.old);
            OpportunityTriggerUtility.handleOpportunityAfterUpdateTrigger(Trigger.oldMap, Trigger.newMap);
        }
        if(Trigger.isDelete){
            OpportunityTriggerHelper.calculateRevenueGameChanger(Trigger.new, Trigger.old);
            OpportunityTriggerHelper.calculateClientsOpptyIdentifiedRevenue(Trigger.new, Trigger.old);

        }
    }

    TriggerManager.instance.execute();

}