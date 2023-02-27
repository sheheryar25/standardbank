/*************************************************************************\
    @ Author        : Rambabu Tummagunta
    @ Date          : 31/08/2011
    @ Test File     : Test_PreventDuplicateAndSendEmail
    @ Description   : Adding non salesforce user as a client team and sending an email on successfull addition.
    @                 [C-00001844 - Bank Contacts against Object records]

    @ Last Modified By  :   Petr Svestka
    @ Last Modified On  :   Oct 9, 2015
    @ Last Modified Reason  : EN-772 fixed inefficiency caused by a SQOL in a for-loop
       
****************************************************************************/

trigger PreventDuplicateAndSendEmail on Non_User_Client_Team__c (before insert,before update) 
{
    Map<String,Non_User_Client_Team__c> ClientMap=new Map<String,Non_User_Client_Team__c>();
    Map<String,Non_User_Client_Team__c> ContactMap=new Map<String,Non_User_Client_Team__c>();
    for(Non_User_Client_Team__c currentObj:Trigger.new)
    {
        if((currentObj.Contact_Name__c != null)&&((Trigger.isInsert) ||(currentObj.Contact_Name__c!=Trigger.oldMap.get(currentObj.id).Contact_Name__c) ))
        {
            ContactMap.put(currentObj.Contact_Name__c,currentObj);
            ClientMap.put(currentObj.Client_Name__c,currentObj);        
        }
    }
    /*populate error message if Bank contact already mapped to the client.*/
    for(Non_User_Client_Team__c NonUser:[select Contact_Name__c from Non_User_Client_Team__c where Client_Name__c in: ClientMap.Keyset() and Contact_Name__c in : ContactMap.keyset()])
    {
        Non_User_Client_Team__c newNonUser=ContactMap.get(NonUser.Contact_Name__c);
        if(newNonUser!=null && newNonUser.Contact_Name__c!=null)
        {
            newNonUser.Contact_Name__c.addError('Please note that this Bank Contact already exists and cannot be added again.');
        }
    }
    
    /*sending email to added bank contact  */
    final string template = 'NonUserClientTeamEmailAlert';
    Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
    list<Messaging.SingleEmailMessage> listEmails = New list<Messaging.SingleEmailMessage>();
    message.setTemplateId([select id from EmailTemplate where Name = : template].id);
 /*
    for(Non_User_Client_Team__c NU:Trigger.new)
    {
        if((Trigger.isInsert) || (NU.Contact_Name__c!=Trigger.oldMap.get(NU.id).Contact_Name__c))
        {
            Contact c = [select Email from Contact where Id =: NU.Contact_Name__c];
            message.setTargetObjectId(c.Id);
            message.setWhatId(NU.Client_Name__c);
            message.setToAddresses(new string[] {c.Email});
            messaging.sendEmail(new messaging.Email[] {message});
        } 
    }*/

    Set<Id> contactIds = new Set<Id>();
    Set<Non_User_Client_Team__c> differentNUs = new Set<Non_User_Client_Team__c>();

    for (Non_User_Client_Team__c nu: Trigger.new) {
        if ((trigger.isInsert || nu.contact_name__c != trigger.oldMap.get(nu.id).contact_name__c) && nu.contact_name__c != null) {
            differentNUs.add(nu);
            contactIds.add(nu.contact_name__c);
            system.debug(logginglevel.error, 'contactIds' + contactIds);
        }
    }

    if (!contactIds.isEmpty()) {
        Map<Id, Contact> idToContactMap = new Map<Id, Contact>([SELECT id, email
                                                                  FROM Contact
                                                                 WHERE id IN :contactIds]);

        
        for (Non_User_Client_Team__c nu: differentNUs) {
            message.setTargetObjectId(idToContactMap.get(nu.contact_name__c).id);
            message.setWhatId(nu.Client_Name__c);
            message.setToAddresses(new String[] {idToContactMap.get(nu.contact_name__c).email});
            
            listEmails.add(message);
        }
       system.debug(logginglevel.error, 'listEmails' + listEmails);
       Messaging.sendEmail(listEmails);
       
    }
}