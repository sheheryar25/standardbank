global class BCH_ClientRecordCompletenessBatch  implements Database.Batchable<sObject>{
    
    //JN: Start Method
    global Database.QueryLocator start(Database.BatchableContext bc){
        
        String query = 'Select RecordType.Name ';
        for(Schema.SObjectField fld: Schema.getGlobalDescribe().get('Account').getDescribe().fields.getMap().values()){
            query = query + ', ' + fld.getDescribe().getName() + ' ';
        }
        query = query + 'from Account where RecordType.Name = \'' + DMN_Account.COMMERCIAL_AFRICA_TYPE + '\' OR RecordType.Name = \'' + DMN_Account.ENTERPRISE_AFRICA_TYPE + '\'';  
        return Database.getQueryLocator(query);
    }
    
    //JN: Check for Record Completeness
    global void execute(Database.BatchableContext bc, List<Account>scope){
        DMN_Account.calculateRecordCompleteness(scope, new Map<Id, Account> (scope));
    }
    
    global void finish(Database.BatchableContext bc){
    }
}