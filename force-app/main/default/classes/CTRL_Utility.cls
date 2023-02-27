/**
* @description CTRL_Utility class for checking user permissions and other helper methods
* @className CTRL_Utility
* @author purna.unnagiri@staradbank.co.za
* @lastModified 07/19/2022
*/

public with sharing class CTRL_Utility {
    
    /**
    * This method is used check if the object and fields are creatable or not.
    * @param String objName
    * @param List<String> fieldList
    * @return Boolean true/false
    */
    
    public static boolean isObjectCreatable(String objName, List<String> fieldList){
        Boolean isObjectCreatable=true;
        Schema.DescribeSObjectResult res = Schema.getGlobalDescribe().get(objName).getDescribe();
        
        if(res.isCreateable()){
            sObject record = res.getSObjectType().newSObject();
            Map<String, Schema.SObjectField> fieldMap = record.getSObjectType().getDescribe().fields.getMap();
            
            for(String field : fieldList){
                if(fieldMap.get(field) != null && !fieldMap.get(field).getDescribe().isCreateable()) {
                    isObjectCreatable = false;
                    break;
                }
            }

        }else {
            isObjectCreatable = false;
        }
        
        return isObjectCreatable;
    }
    
    /**
    * This method is used check if the object and fields are updatable or not.
    * @param String objName
    * @param List<String> fieldList
    * @return Boolean true/false
    */
    
    public static boolean isObjectUpdatable(String objName, List<String> fieldList){
        Boolean isObjectUpdatable=true;
        Schema.DescribeSObjectResult res = Schema.getGlobalDescribe().get(objName).getDescribe();
        if(res.isUpdateable()){
            sObject record = res.getSObjectType().newSObject();
            Map<String, Schema.SObjectField> fieldMap = record.getSObjectType().getDescribe().fields.getMap();
            for(String field : fieldList){
                if(fieldMap.get(field) != null && !fieldMap.get(field).getDescribe().isUpdateable()) {
                    isObjectUpdatable = false;
                    break;
                }
            }
        }else {
            isObjectUpdatable = false;
        }
        return isObjectUpdatable;
    }
    
    /**
    * This method is used check if the object and fields are accessible or not.
    * @param String objName
    * @param List<String> fieldList
    * @return Boolean true/false
    */
    
    public static boolean isObjectAccessible(String objName, List<String> fieldList){
        Boolean isObjectAccessible = true;
        Schema.DescribeSObjectResult res = Schema.getGlobalDescribe().get(objName).getDescribe();
        if(res.isAccessible()){
            sObject record = res.getSObjectType().newSObject();
            Map<String, Schema.SObjectField> fieldMap = record.getSObjectType().getDescribe().fields.getMap();
            for(String field : fieldList){
                if(fieldMap.get(field) != null && !fieldMap.get(field).getDescribe().isAccessible()) {
                    isObjectAccessible = false;
                    break;
                }
            }
        }
        else {
            isObjectAccessible = false;
        }
        return isObjectAccessible;
    }

    /**
    * This method is used check if the object is deletable by the user.
    * @param String objName
    * @return Boolean true/false
    */
    
    public static Boolean isObjectDeletable(String objName){
        Schema.DescribeSObjectResult res = Schema.getGlobalDescribe().get(objName).getDescribe();
        return res.isDeletable();
    }

    /**
    * This method is used check if the object is deletable by the user.
    * @param List of String objName
    * @return Boolean true/false
    */
    
    public static Boolean isMultipleObjectDeletable(List<String> objNameList){
        for(String objApiName : objNameList){
            Schema.DescribeSObjectResult res = Schema.getGlobalDescribe().get(objApiName).getDescribe();
            if(!res.isDeletable()){
                return false;
            }
        }
        return true;
    }
    
    /**
    * This method is used get object label.
    * @param String objName
    * @param List<String> fieldList
    * @return Boolean true/false
    */
    
    public static String getObjectLabel(String objectApiName){
        String objLabel;
        if(!String.isBlank(objectApiName)){
            Map<String, Schema.SObjectType> sObjectMap = Schema.getGlobalDescribe(); 
            objLabel = sObjectMap.get(objectApiName).getDescribe().getLabel();
        }
        return objLabel; 
    }
    
    /**
    * This method is used get message.
    * @param String objName
    * @return String message
    */
    
    public static String getMissingPermissionMsgForSingleObj(String objectApiName){
        String message;
        if(!String.isBlank(objectApiName)){
            String objLabel = getObjectLabel(objectApiName);
            message = System.Label.ObjectPermissionMissing;
            message = message.replace('{ObjectName}',objLabel);
        }
        return message; 
    }
    
    /**
    * This method is used get message.
    * @param List of String of object API Name
    * @return String message
    */
    
    public static String getMissingPermissionMsgForMultipleObj(List<String> objectApiName){
        String message;
        if(objectApiName.size()>0){
            String obj = String.join(objectApiName, '/');
            message = System.Label.ObjectPermissionMissing;
            message = message.replace('{ObjectName}',obj);
        }
        return message; 
    }
}