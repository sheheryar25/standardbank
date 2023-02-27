({
    dispatchChangePopUpPageEvent : function(component, pageNumber, isNextPage) {
        let popUpEvent = component.getEvent("changePopUpPageEvent");
        popUpEvent.setParams({
            "pageNumber" : pageNumber,
            "isNextPage" : isNextPage
        }); 
        popUpEvent.fire();
    },

    dispatchClosePopUpEvent : function(component, optionSelected) {
        let popUpEvent = component.getEvent("closePopUpEvent");
        popUpEvent.setParams({
            "optionSelected" : optionSelected,
        });
        popUpEvent.fire();
    },


    handleClose : function(component,event) {
        component.set("v.displayPopUp", false);
        this.dispatchClosePopUpEvent(component, event.currentTarget.dataset.tabName);
    },
    
    handleSign : function(component,event){
        component.set("v.displayPopUp", false);
        component.set("v.loading", true);
        //Create case
        var userMap = component.get('v.userMap');
        var newCase = component.get('v.newCase');
        var subject = 'OneHub Authorised Person Sign Up Cancellation ';
        var origin = "Web";
        var status = "New";
        newCase.Origin = origin;
        newCase.Status = status;
        newCase.SuppliedEmail = userMap[0].Email;
        newCase.SuppliedName = userMap[0].FirstName + '' + userMap[0].LastName;
        newCase.SuppliedPhone = userMap[0].Phone;
        var radioButton = component.find('queryType');
        var choice = radioButton ? radioButton.get("v.value") : "Other";
        newCase.Description = choice;
		newCase.Subject = subject;
        newCase.ContactId = userMap[0].Id;
        this.createCase(component, newCase);
        this.dispatchClosePopUpEvent(component, event.currentTarget.dataset.tabName);
    },
    
    createCase: function(component,newCase) {
        var userMap = component.get('v.userMap');
        var action = component.get("c.saveCase");
        action.setParams({
            "MarketGramCase": newCase,
            "IdentityNum": userMap[0].Identity_Number__c,
            "PassNum": userMap[0].OSB_Passport_Number__c
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log('state'+state);
            if (component.isValid() && state === "SUCCESS") {
				component.set("v.loading",false);
                this.redirect(component);
            }
        });
        $A.enqueueAction(action);
    },
    
    redirect : function (component){
        let navService = component.find("navService");
           let pageReference = {
                type: "comm__namedPage",
                attributes: {
                    pageName: 'home'
                }
            };
            navService.navigate(pageReference);
    }, 
    
    handleClearForm : function(component) {
        component.set("v.displayPopUp", false);
        var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": window.location.href
            });
            urlEvent.fire();
    },

     scrollToTile : function(component, element, window) {
        let fromTop = window.scrollY;
        let windowHeight = window.innerHeight - 80;
        let scrollRequired = false;
        if( element.offsetTop > fromTop + windowHeight || element.offsetTop < fromTop || element.offsetTop + element.offsetHeight > windowHeight) {
            window.scrollTo(0, element.offsetTop - 16);
            scrollRequired = true;
        }
        return scrollRequired;
    },
})