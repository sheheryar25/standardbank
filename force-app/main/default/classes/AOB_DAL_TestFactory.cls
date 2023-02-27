/**
* Used to create Data, mostly for unit tests
* 
* <p></p> 
* 
* @author Salesforce
* 
* @date Oct 17th 2021
*/
public with sharing class AOB_DAL_TestFactory {
    
    /**
* This method is use to create a community user
* @param profileName The profile that should be linked to the new user
* @param profileName The permissionsetnames that should be assigned to the new user
* @return A user that Is/not inserted
*/
    public static User createCommunityUser( ){
        UserRole userrole = [Select Id, DeveloperName From UserRole where DeveloperName='Business_Banking' Limit 1];
        
        User adminUser = [Select Id, UserRoleId From User Where id=:UserInfo.getUserId() Limit 1];
        
        if(String.isBlank(adminUser.UserRoleId)){
            adminUser.UserRoleId = userRole.Id;
            update adminUser;
        }
        User user;
        System.runAs(adminUser){
            String EXTERNAL_USER_PROFILE = 'AOB_Authenticated Customer Community';
            //get Profile
            Profile profile = [SELECT id 
                               FROM Profile 
                               WHERE name=:EXTERNAL_USER_PROFILE];
            
            //Insert User        
            String uniqueName = getUniqueName();
            
            string accountRT=Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('IndustriesBusiness').getRecordTypeId();
            Account account = new Account(Name='TestACC', RecordTypeId=accountRT);
            insert account;
            
            Contact contact = new Contact(LastName='test',
                                          Email = uniqueName + '@test.org',
                                          firstName='testFirstName',
                                          AccountId = account.Id
                                         ); 
            insert contact;
            user = new User(lastName = 'test',
                            email = uniqueName + '@test.org',
                            Username = uniqueName + '@test.org',
                            ProfileId = profile.Id,
                            EmailEncodingKey = 'ISO-8859-1',
                            Alias = uniqueName.substring(18, 23),
                            TimeZoneSidKey = 'America/Los_Angeles',
                            LocaleSidKey = 'en_US',
                            LanguageLocaleKey = 'en_US',
                            UserPermissionsKnowledgeUser =true,
                            contactId=contact.id,
                            User_Division__c ='Digital',
                            Business_Unit__c  ='Bank Sector',
                            User_CIB_Global_Area__c   ='CIBSA',
                            Country  ='ZA',
                            city  ='city',
                            state='state',
                            postalCode='state',
                            FederationIdentifier='FederationIdentifier'+uniqueName
                           );
            insert user;
        }
        return user;
    }
    
    /**
* Get the unique name to be user for Email, Username of the created user
* @return A unique Name
*/
    public static string getUniqueName(){
        String orgId = UserInfo.getOrganizationId();
        String dateString = String.valueof(Datetime.now()).replace(' ','').replace(':','').replace('-','');
        Integer randomInt = Integer.valueOf(math.rint(math.random()*1000000));
        String uniqueName = orgId + dateString + randomInt;
        
        return uniqueName;
    }
    
/**
* This method is used to create a new application (without params)
* @return AOB_Application__c
*/
    public static AOB_Application__c createApplication() {
        User communityUser = [
            SELECT id, contactId
            FROM User
            WHERE id = :UserInfo.getUserId()
        ];
        Account acc = [
            SELECT id
            FROM account
            WHERE
            id IN (
                SELECT accountId
                FROM contact
                WHERE id = :communityUser.contactId
            )
        ];
        AOB_Application__c newApplication = new AOB_Application__c();
        newApplication.AOB_Client__c  = acc.id;
        insert newApplication;
        return newApplication;
    }
    
    /**
* This method is used to create a new application (without params)
* @return AOB_Application__c
*/
    public static AOB_Application__c createApplication(User userId) {
        User communityUser = [
            SELECT id, contactId
            FROM User
            WHERE id = :userId.Id
        ];
        Account acc = [
            SELECT id
            FROM account
            WHERE
            id IN (
                SELECT accountId
                FROM contact
                WHERE id = :communityUser.contactId
            )
        ];
        AOB_Application__c newApplication = new AOB_Application__c();
        newApplication.AOB_Client__c  = acc.id;
        insert newApplication;
        return newApplication;
    }

    
    
    /**
    * This method is used to create a new product
    * @param name: Product name
    * @return Product2
    */
    public static Product2 createProduct(String name, String productCode) {
        Product2 newProduct = new Product2(Name = name);
        newProduct.ProductCode = productCode;
        newProduct.ExternalId = productCode;
        insert newProduct;
        return newProduct;
    }
    
    /**
   * This method is used to create a new AOB_RequiredDocument__c record
   * @param productId: Parent product Id
   * @param description: Record description
   * @param helpText: Current help text
   * @param order: Order of the current record
   * @return AOB_RequiredDocument__c
   */
  public static AOB_ProductAOContent__c createAOContent(
    Id productId,
    String description,
    String helpText,
    Integer order
  ) {
    AOB_ProductAOContent__c requiredDocument = new AOB_ProductAOContent__c(
      AOB_Product__c = productId,
      AOB_Description__c = description,
      AOB_HelpText__c = helpText,
      AOB_Sequence__c = order
    );
    insert requiredDocument;
    return requiredDocument;
  }
    /**
    * This method is use to get the user with profile
    * @param profileName The profile that should be linked to the new user
    * @return A user that Is/not inserted
    */
    public static User createUser (String profileName, Boolean doInsert) {
        User result = new User(
            ProfileId = [
                SELECT  Id
                FROM    Profile
                WHERE   Name = :profileName
                LIMIT 1
            ].Id,
            LastName = 'LastName',
            FirstName='FirstName',
            Email = 'aob@sb.com',
            Username = 'aob@sb.com' + System.currentTimeMillis(),
            CommunityNickname = 'aob' + System.currentTimeMillis(),
            CompanyName = 'aob',
            Title = 'Volunteer',
            Alias = 'aob',
            TimeZoneSidKey = 'America/Los_Angeles',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            isActive = true,
            User_Division__c ='Digital',
            Business_Unit__c  ='Bank Sector',
            User_CIB_Global_Area__c   ='CIBSA',
            Country  ='ZA',
            city  ='city',
            state='state',
            postalCode='state'
        );
        
        if (doInsert) {
            insert result; 
        }
        return result;
    }
    
    /**
    * This method is used to create a new product
    * @param name: Product naem
    * @return Product2
    */
    public static Product2 createProduct(String name){
        Product2 newProduct = new Product2(Name = name);
        insert newProduct;
        return newProduct;
    }
    /**
    * This method is used to create a new AOB_RequiredDocument__c record
    * @param productId: Parent product Id
    * @param description: Record description
    * @param helpText: Current help text
    * @param order: Order of the current record
    * @return AOB_RequiredDocument__c
    */
    public static AOB_ProductAOContent__c createAOProductContent(Id productId, String description, String helpText, Integer order){
        AOB_ProductAOContent__c aoContent = new AOB_ProductAOContent__c( AOB_Product__c = productId,
                                                                        AOB_Description__c = description,
                                                                        AOB_HelpText__c = helpText,
                                                                        AOB_sequence__c = order
                                                                       );
        insert aoContent;
        return aoContent;
    }
    
    /**
    * This method is used to create a new application line item
    * @param productId: Parent product Id
    * @param applicationId: Parent application Id
    * @return AOB_ApplicationLineItem__c
    */
    public static AOB_ApplicationLineItem__c createApplicationLineItem(Id productId, Id applicationId){
        AOB_ApplicationLineItem__c newApplicationLineItem = new AOB_ApplicationLineItem__c(AOB_Product__c = productId, AOB_Application__c = applicationId);
        insert newApplicationLineItem;
        return newApplicationLineItem;
    }
    
    /**
    * @desc     genericObjectCreation: Created a record of the provided Object with the provided field values  
    * @param    ObjectName: The object name ( Api name)
    * @param    values: Mapping with key the field api name and the value the field value
    * @return   True if the Record is created and Error otherwise
    */
    public static sObject genericObjectCreation(string objectName, Map<string,object> values){
        Map<String, Schema.SObjectType> m_objects = Schema.getGlobalDescribe();
        sObject n = m_objects.get(objectName).newSObject();
        for(string fieldName:values.keyset()){
            n.put(fieldName,values.get(fieldName));
        }
        return n;
    }
    
}