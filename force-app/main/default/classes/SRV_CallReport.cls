public class SRV_CallReport { 
 
    public static void syncCallReports(Event[] events){

        if(SA_EventTriggerHelperClass.hasAlreadyCreatedEvent()){
            return;
        }

        Map<SobjectType, Set<Id>> type2Ids = buildMap(events);
        Map<Id, Sobject> id2Sobject = buildSobjectMap(type2Ids);

        processRecords(events, id2Sobject);
    }

    private static void processRecords(Event[] records, Map<Id, Sobject> id2Sobject){

        Call_Report__c[] repUpsert = new Call_Report__c[]{};

        for (Event eveObj : records){
            Call_Report__c report = DMN_CallReport.buildReport(eveObj, id2Sobject);
            repUpsert.add(report);
        }

        SA_EventTriggerHelperClass.setAlreadyCreatedEvent();

        Database.upsertResult[] results = Database.upsert(repUpsert, Call_Report__c.Fields.eventID__c, false);

        List<ID> bankContactIds = new List<ID>();
        List<ID> eventReportIds = new List<ID>();

        for(Integer i = 0; i < results.size(); i++ ){
            Database.upsertResult result = results[i];
            Call_Report__c report = repUpsert[i];
            if(result.isSuccess() && result.isCreated()){
                eventReportIds.add(result.getId());
                User usr = (User)id2Sobject.get(report.OwnerId);

                bankContactIds.add(usr.Contact_Sync_ID__c);
            }
        }

        SA_EventTriggerHelperClass.setAlreadyCreatedEvent();
        SA_EventReportAttendeeFutureUpdate.addEventReportAttendees(bankContactIds, eventReportIds);
    }



    private static Map<SobjectType, Set<Id>> buildMap(Event[] records){
        Map<SobjectType, Set<Id>> type2Ids = new Map<SobjectType, Set<Id>>{
                                                        Contact.SobjectType => new Set<Id>(), 
                                                        Lead.SobjectType => new Set<Id>(),
                                                        User.SobjectType => new Set<Id>(),
                                                        Opportunity.SobjectType => new Set<Id>(),
                                                        Account.SobjectType => new Set<Id>(),
                                                        Campaign.SobjectType => new Set<Id>(),
                                                        Case.SobjectType => new Set<Id>()   
                                            };
        Set<SObjectField> fields = new Set<Schema.sObjectField>{Event.OwnerId, Event.WhoId, Event.WhatId}; 
        for(Event eveRec : records){
            for(Schema.sObjectField field : fields){
                Id recordId = (Id)eveRec.get(field);
                SobjectType st = recordId != null ? recordId.getSobjectType() : null;
                if(st != null && type2Ids.containsKey(st)){
                    type2Ids.get(st).add(recordId);
                }   
            }
        }

        return type2Ids;
    }

    private static Map<Id, Sobject> buildSobjectMap(Map<SobjectType, Set<Id>> type2Ids){
        // This is to be replaced once TYPEOF will be enabled
        Sobject[] sObjects = new SObject[]{};

        if(!type2Ids.get(Contact.SobjectType).isEmpty()){
            for(Contact con : [ SELECT Id, Name,Inactive__c, AccountId, Account.Name
                                FROM Contact
                                WHERE Id IN : type2Ids.get(Contact.SobjectType)]){
                sObjects.add(con);
                sObjects.add(con.Account);
            }
        }

        if(!type2Ids.get(Lead.SobjectType).isEmpty()){
            sObjects.addAll((Sobject[])[SELECT Id, Name
                                        FROM Lead
                                        WHERE Id IN : type2Ids.get(Lead.SobjectType)]);
        }

        if(!type2Ids.get(User.SobjectType).isEmpty()){
            sObjects.addAll((Sobject[])[SELECT Id, Name, Contact_Sync_ID__c
                                        FROM User
                                        WHERE Id IN : type2Ids.get(User.SobjectType)]);
        }

        if(!type2Ids.get(Opportunity.SobjectType).isEmpty()){
            sObjects.addAll((Sobject[])[SELECT Id, Name, AccountId, Account.Name
                                        FROM Opportunity
                                        WHERE Id IN : type2Ids.get(Opportunity.SobjectType)]);
        }

        if(!type2Ids.get(Campaign.SobjectType).isEmpty()){
            sObjects.addAll((Sobject[])[SELECT Id, Name
                                        FROM Campaign
                                        WHERE Id IN : type2Ids.get(Campaign.SobjectType)]);
        }

        if(!type2Ids.get(Case.SobjectType).isEmpty()){
            sObjects.addAll((Sobject[])[SELECT Id, Subject
                                        FROM Case
                                        WHERE Id IN : type2Ids.get(Case.SobjectType)]);
        }

        Map<Id, Sobject> id2Sobjects =  new Map<Id, Sobject>(sObjects);

        if(!type2Ids.get(Account.SobjectType).isEmpty()
            && !id2Sobjects.keySet().containsAll(type2Ids.get(Account.SobjectType))){

            for(Account acc : [ SELECT Id, Name, Primary_Relationship_Holder__c
                                FROM Account
                                WHERE Id IN : type2Ids.get(Account.SobjectType)]){
                if(!id2Sobjects.containsKey(acc.Id)){
                    id2Sobjects.put(acc.Id, acc);
                }
            }
        }

        return id2Sobjects;
    }
}