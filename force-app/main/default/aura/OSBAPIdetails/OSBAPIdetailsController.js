({    
    doInit: function(component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        if (userId==undefined){
            component.set("v.isGuestUser",true);
        }
        var param = 'apiId'; 
        var result=decodeURIComponent
        ((new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').
          exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
        var action = component.get("c.getKnowledgeDetails");
        action.setParams({
            apiId: result
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                const value = response.getReturnValue();
                if(value && value.length > 0) {
                    var product = value[0];
                    component.set("v.apiProduct", product);
                    helper.getApis(component,product).then($A.getCallback(function(record) {
                        let children = component.get("v.childApis");
                        var action = component.get("c.getApiDetails");
                        if(!product.URL__c) {
                            return;
                        }
                        action.setParams({
                            apiId: children[0] ? children[0].URL__c : product.URL__c
                        });
                        action.setCallback(this, function(response) {
                            var state = response.getState();
                            if (state === "SUCCESS") {
                                helper.handleSuccess(component, response, helper);
                            }
                        });
                        $A.enqueueAction(action);
                    }));
                }               
            }
        });
        $A.enqueueAction(action);
    },
    
    handleNavigation : function(component, event, helper) {
        let elementId = event.target.id.toString();
        let className = ('.apidetails__method__selected').toString();
        let previousSelected = document.querySelectorAll(className);
        for(let x = 0;x < previousSelected.length;x++){
            previousSelected[x].classList.remove('apidetails__method__selected');
        }
        document.getElementById(elementId) ? document.getElementById(elementId).classList.add('apidetails__method__selected') : '';      
        let offset = document.getElementById(event.target.dataset.href).offsetTop;
        let finalOffset = offset - 150 > 0 ? offset - 150 : 0
        window.scrollTo({top: finalOffset, behavior: "smooth"});
    },
    
    handleAPINavigation: function(component, event, helper) {
        component.set("v.isLoading", true);
        let navEle = document.querySelectorAll('.apidetails__navigation');
        navEle[0].classList.add('hidden-class');
        let clickedButton = event.target.id;
        let buttonIndex = String(clickedButton).slice(String(clickedButton).length - 1);
        let product = component.get("v.childApis")[buttonIndex];
        component.set("v.apiProduct", product);
        product.Title = product.Title__c;
        let action = component.get("c.getApiDetails");
        if(!product.URL__c) {
            return;
        }
        action.setParams({
            apiId: product.URL__c
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                helper.handleSuccess(component, response, helper);
            }
        });
        let elementId = clickedButton.toString();
        let className = ('.apidetails__child__selected').toString();
        let previousSelected = document.querySelectorAll(className);
        for(let x = 0;x < previousSelected.length;x++){
            previousSelected[x].classList.remove('apidetails__child__selected');
        }       
        document.getElementById(elementId).classList.add('apidetails__child__selected');
        $A.enqueueAction(action);
    },
    
    openAppNameModal: function(component,event,helper){
        component.set("v.isOpen", true);
    }
})