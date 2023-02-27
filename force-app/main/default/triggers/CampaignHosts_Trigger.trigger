/*****************************************************************************************************\
    @ Func Area     : Campaign_Hosts__c
    @ Author        : Rudolf Niehaus
    @ Date          : 06/09/2012
    @ Test File     : Test Method CampaignHostsTrigger_Test
    @ Description   : Default Campaign_Hosts__c trigger 
    				  Uses Apex class -> CampaignHostsTriggerFunctions	
                      
    @ Func Area     : Campaigns, Members Hosts
    @ Author        : Rudolf Niehaus
    @ Date          : 06/09/2012
    @ Test File     : Test Method CampaignHostsTrigger_Test
    @ Description   : Case#6220
                      Added method recalculateHostCount(list<Campaign_Hosts__c> hostList , String DMLtype)
                      to the CampaignHostsTriggerFunctions class. The method adds and subtracts the total number
                      of hosts per campiagn and updates the field Number_of_Hosts__c on the campaign. The field
                      is used in campaign reporting                                                  
******************************************************************************************************/

trigger CampaignHosts_Trigger on Campaign_Hosts__c (after delete, after insert, before delete, before insert) {

	System.Debug('## >>> CampaignHosts_Trigger <<< run by ' + UserInfo.getName());
    System.debug('##:Trigger.size:' + Trigger.size);
    System.debug('##:getDMLRows/getLimitDMLRows: ' + Limits.getDMLRows() +'/'+ Limits.getLimitDMLRows());
	
	//get all campaign ids for these hosts
	set<Id> Ids = new set<Id>();	
	if(trigger.isAfter && trigger.isInsert){
		for(Campaign_Hosts__c ch : trigger.new){
			Ids.add(ch.Id);
		}
	}else if(trigger.isBefore && trigger.isDelete){
		for(Campaign_Hosts__c ch : trigger.old){
			Ids.add(ch.Id);
		}
	}
	
	static set<Id> campIds = new set<Id>();
	
	for(Campaign_Hosts__c h : [Select h.Campaign_Member_Host__r.Campaign__c, h.Campaign_Member_Host__c, h.Bank_Contact__c  
		From Campaign_Hosts__c h where h.Id IN :Ids]){
			
			campIds.add(h.Campaign_Member_Host__r.Campaign__c);
	}
	
	if(trigger.isAfter){
		if(trigger.isInsert){
			CampaignHostsTriggerFunctions.recalculateHostCount(campIds);
		}
	}else{
		if(trigger.isDelete){
			CampaignHostsTriggerFunctions.recalculateHostCount(campIds);
		}
	}

}