/**
 * Created by zwalczewska on 19.02.2020.
 */
 
({
    getData: function(component, event){
            var action = component.get('c.fetchContactInfo');
                    action.setParams({ clientId : component.get("v.recordId") });
                    action.setCallback(this, function(response){
                        var state = response.getState();
                        if (state === "SUCCESS") {
                            console.log("SUCCESS", response.getReturnValue() );
                            if(!$A.util.isEmpty(response.getReturnValue())){
                                 let phones = response.getReturnValue().filter((x)=>{return x.type ==='PHONE';});
                                 let emails = response.getReturnValue().filter((x)=>{return x.type ==='EMAIL';});
                                 phones.sort(function(a,b){
                                     if(a.obsoleteInd > b.obsoleteInd) return 1 ;
                                     if(a.obsoleteInd < b.obsoleteInd) return - 1 ;
                                 });
                                 phones.sort(function(a,b){
                                     if( a.preferredInd < b.preferredInd ) return 1;
                                     if( a.preferredInd > b.preferredInd ) return - 1;
                                 });
                                 emails.sort(function(a,b){
                                      if(a.obsoleteInd > b.obsoleteInd) return 1 ;
                                      if(a.obsoleteInd < b.obsoleteInd) return - 1 ;
                                  });
                                  emails.sort(function(a,b){
                                      if( a.preferredInd < b.preferredInd ) return 1;
                                      if( a.preferredInd > b.preferredInd ) return - 1;
                                  });
                                 component.set('v.customerContactResponsePhone', phones);
                                 component.set('v.customerContactResponseEmail', emails);
                                 component.set("v.columnsPhones", phones.length);
                                 component.set("v.columnsEmails", emails.length);
                            }
                            component.set('v.isLoading', false);
                        }
                        else if (state === "ERROR") {
                            component.find('notifLib').showToast({
                                 "title": "Error!",
                                 "message": "We were unable to refresh any real-time contact details this time. Please try again. Our support team has been notified.",
                                 "variant" : "error"
                             });
                             component.set('v.isLoading', false);
                             component.set('v.isError', true);
                             var errors = response.getError();
                             if (errors) {
                                 if (errors[0] && errors[0].message) {
                                     console.log("Error message: " + errors[0].message);
                                 }
                             } else {
                                 console.log("Unknown error");
                             }
                        }
                        else {
                            console.log("State: " + state);
                        }
                    });
                    component.set('v.isLoading', true);
                    $A.enqueueAction(action);
        }
});