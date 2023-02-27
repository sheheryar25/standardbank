({
    
    doInit: function(component, event, helper) {
        // call the fetchPickListVal(component, field_API_Name, aura_attribute_name_for_store_options) -
        // method for get picklist values dynamic   
        //helper.fetchPickListVal(component, 'Rating', 'ratingPicklistOpts');
    },
    
    inlineEditDate : function(component,event,helper){   
        // show the date edit field popup 
        component.set("v.dateEditMode", true); 
        // after the 100 millisecond set focus to input field   
        setTimeout(function(){ 
            component.find("inputDate").focus();
        }, 100);
    },
    
    onDateChange : function(component,event,helper){ 
        // if edit field value changed and field not equal to blank,
        // then show save and cancel button by set attribute to true
        if(event.getSource().get("v.value").trim() != ''){ 
            component.set("v.showSaveCancelBtn",true);
        }
        component.set("v.dateEditMode", false); 
    },
    
    closeDateBox : function (component, event, helper) {
        // on focus out, close the input section by setting the 'dateEditMode' att. as false   
        component.set("v.dateEditMode", false); //This is causing the field to not be editable.
        // check if change/update Date field is blank, then add error class to column -
        // by setting the 'showErrorClass' att. as True , else remove error class by setting it False   
        if(event.getSource().get("v.value").trim() == ''){
            component.set("v.showErrorClass",true);
        }else{
            component.set("v.showErrorClass",false);
        }
    },    
    
    inlineEditFee: function(component,event,helper){   
        // show the fee edit field popup 
        component.set("v.feeEditMode", true); 
        // after the 100 millisecond set focus to input field   
        setTimeout(function(){ 
            component.find("inputFee").focus();
        }, 100);
    },
    
    onFeeChange : function(component,event,helper){ 
        // if edit field value changed and field not equal to blank,
        // then show save and cancel button by set attribute to true
        if(event.getSource().get("v.value").trim() != ''){ 
            component.set("v.showSaveCancelBtn",true);
        }
        //component.set("v.feeEditMode", false); 
    },
    
    closeFeeBox : function (component, event, helper) {
        // on focus out, close the input section by setting the 'dateEditMode' att. as false   
        component.set("v.feeEditMode", false); //This is causing the field to not be editable.
        // check if change/update Fee field is blank, then add error class to column -
        // by setting the 'showErrorClass' att. as True , else remove error class by setting it False   
        if(event.getSource().get("v.value") == ''){
            component.set("v.showErrorClass",true);
        }else{
            component.set("v.showErrorClass",false);
        }
    },   
})