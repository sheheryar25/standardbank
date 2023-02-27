/**
 * Created by mjaznicki on 05.07.2018.
 */
({
    doInit: function(component, event, helper){
        var myPageRef = component.get('v.pageReference');
        var record = myPageRef.state.c__id;
        component.set("v.recordId", record);

        var getAccess = component.get('c.isAccessGiven');
        getAccess.setCallback(this, function(response){
                      var state = response.getState();
                      if (state === "SUCCESS") {
                          component.set('v.hasAccess', response.getReturnValue());
                      }
                });
        $A.enqueueAction(getAccess);

        var getAcc = component.get('c.getAccount');
        getAcc.setParams({accId : component.get('v.recordId')});
        getAcc.setCallback(this, function(response){
              var state = response.getState();
              if (state === "SUCCESS") {
                  component.set('v.account', response.getReturnValue());
              }
        });
         $A.enqueueAction(getAcc);
         var change = component.get('c.getEntityTypeValues');
         change.setCallback(this, function(response){
                     var state = response.getState();
                     if (state === "SUCCESS") {
                         component.set('v.entityValues', response.getReturnValue());
                     }
               });
         $A.enqueueAction(change);
         var sourceOfWealthValues = component.get('c.getSourceOfWealthValues');
         sourceOfWealthValues.setCallback(this, function(response){
                   var state = response.getState();
                   if (state === "SUCCESS") {
                       component.set('v.sowValues', response.getReturnValue());
                   }
             });
         $A.enqueueAction(sourceOfWealthValues);
    },

    onSave: function(component, event, helper){
        helper.generateDocument(component, event, false);
         },

    onSaveAndSend: function(component, event, helper){
            helper.generateDocument(component, event, true);
             },

    onCancel: function(component, event, helper){
        var record = component.get('v.recordId');
         var urlEvent = $A.get("e.force:navigateToURL");
                         urlEvent.setParams({
                           "url": "/"+record
                         });
                 urlEvent.fire();
    },

    onChangeClientType: function(component, event, helper) {
        var change = component.get('c.bussinessClassificationValues');
        var et = component.get('v.entityType');
        change.setParams({entityTypeValue : component.get('v.entityType')});
        change.setCallback(this, function(response){
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        component.set('v.bussinessValues', response.getReturnValue());
                        component.set('v.bussinessClassification', '');
                        component.set('v.entityClassification', ''); 
                    }
              });
        $A.enqueueAction(change);
    }

})