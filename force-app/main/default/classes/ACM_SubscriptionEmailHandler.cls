public class ACM_SubscriptionEmailHandler {
	
	@InvocableMethod(label='Send Email to Subscriber' description='It will not return anything corresponding to the specified acm Subscription Ids.' category='ACM_Subscription__c')
	public static void sendEmailToSubscriber(List<Id> acmSubscriptionIds){
		
		If(!acmSubscriptionIds.isEmpty()){
			
			List<ACM_Subscription__c> subscriptionList = [SELECT Id, Name, ACM_Subscriber__c FROM ACM_Subscription__c 
														  where Id IN :acmSubscriptionIds];		
			
			if(!subscriptionList.isEmpty()){				
				Set<Id> SubscriberIds = new Set<Id>();				
				for(ACM_Subscription__c subscript : subscriptionList){					
					if(subscript.ACM_Subscriber__c !=null ){						
						SubscriberIds.add(subscript.ACM_Subscriber__c);						
					}					
				}
				
				if(!SubscriberIds.isEmpty()){
                    Map<Id, Id> contactIdUserIdMap = new Map<Id, Id>();
					List<User> contactRelatedUserList = [select id,contactId from user where contactId In : SubscriberIds];
                    if(!contactRelatedUserList.isEmpty()){
                        for(User u : contactRelatedUserList){
                            contactIdUserIdMap.put(u.contactId, u.Id);
                        }                        
                    }
					List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();					
					EmailTemplate templateId = [SELECT Id, Name, DeveloperName FROM EmailTemplate where DeveloperName ='Subscription_Acknowledgement' limit 1];
					if(templateId !=null && !contactIdUserIdMap.isEmpty()){					
						for(ACM_Subscription__c subscription : subscriptionList){
                            if(contactIdUserIdMap.containsKey(subscription.ACM_Subscriber__c)){
                                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                                email.setTemplateId(templateId.Id);
                                email.setSaveAsActivity(false);
                                // Customer User Id
                                email.setTargetObjectId(contactIdUserIdMap.get(subscription.ACM_Subscriber__c));
                                // ACM Subscription Record Id
                                email.setWhatId(subscription.Id);
                                emails.add(email);
                            }
						}
						
                        for (Messaging.SendEmailResult result: Messaging.sendEmail(emails,false)){
                            if (!result.isSuccess()){
                                System.debug('The email failed to send: ' + result.errors[0].message);
                            }else{
                                System.debug('The email was sent successfully.');
                            }
                        }
					}
				}
			}
		}
	}
}