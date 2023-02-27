/**
 * EmailMessages Selector Layer class.
 *
 * @author Kyle Cockcroft (kcockcroft@deloitte.co.za)
 * @date 2019-04-24
 */
public with sharing class SEL_EmailMessages extends fflib_SObjectSelector {
 
   public Schema.SObjectType getSObjectType(){
      return EmailMessage.sObjectType;
   }
 
   public List<Schema.SObjectField> getSObjectFieldList(){
      return new List<Schema.SObjectField> {
         EmailMessage.Id,
         EmailMessage.ParentId,
         EmailMessage.Status
    
      };
   }
    
   public List<EmailMessage> selectById(Set<ID> idSet) {

        return (List<EmailMessage>) selectSObjectsById(idSet);
    } 
    
    public List<EmailMessage> selectByParentId(Set<ID> allCasesIds){
        fflib_QueryFactory query = newQueryFactory();
        query.setCondition('ParentId IN :allCasesIds');
        return (List<EmailMessage>) Database.query( query.toSOQL() );
    }  
   
}