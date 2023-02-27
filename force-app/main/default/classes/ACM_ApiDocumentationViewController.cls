public with sharing class ACM_ApiDocumentationViewController {
    
    @AuraEnabled(cacheable=true)
    public static List<acm_pkg__AnypointApiPages__x> getAnypointApiPages(String apiId, List<String> disabledApiPageNames){	
        List<String> ignoreApiPages = New list<String>{'FAQ and Support','Service Terms and Compliance','Description' ,'home' ,'Overview'};
            if(apiId !=null && apiId !=''){
                
                acm_pkg__CommunityApi__c communityApi = [SELECT acm_pkg__ApiId__c, acm_pkg__AssetVersion__c, 
                                                         acm_pkg__Name__c 
                                                         FROM acm_pkg__CommunityApi__c 
                                                         WHERE id =:apiId limit 1];				
                if(communityApi != null && communityApi.acm_pkg__ApiId__c != null 
                   && communityApi.acm_pkg__ApiId__c != '' 
                   && communityApi.acm_pkg__AssetVersion__c != null 
                   && communityApi.acm_pkg__AssetVersion__c != ''){
                       
                       String assetVersionId = communityApi.acm_pkg__ApiId__c +':'+ communityApi.acm_pkg__AssetVersion__c;
                       List<acm_pkg__AnypointApiPages__x> anypointApiPages = [select Id, acm_pkg__AssetVersionId__c,
                                                                              acm_pkg__PageName__c, 
                                                                              acm_pkg__PagePath__c 
                                                                              from acm_pkg__AnypointApiPages__x 
                                                                              where acm_pkg__AssetVersionId__c =: assetVersionId
                                                                              and acm_pkg__PageName__c not IN :disabledApiPageNames ];
                       if(anypointApiPages.size()>0){
                           return anypointApiPages;
                       }else{
                           return null;
                       }
                   }else{
                       return null;
                   }
            }else{
                return null;
            }		
    }	
    
}