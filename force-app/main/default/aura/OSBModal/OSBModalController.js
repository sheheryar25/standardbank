({
    doInt: function(component, event, helper){
        
    },
    
    openModel: function(component, event, helper) {
        // for Display Model,set the "isOpen" attribute to "true"
        component.set("v.isOpen", true);
    },
    
    closeModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        component.set("v.isOpen", false);
        document.body.style.overflow = "auto";
    },
    openFirstURL : function(component, event, helper) {
        var urlToOpen = component.get("v.modalFirstButtonURL");
		window.open(urlToOpen);
        component.set("v.isOpen", false);
        document.body.style.overflow = "auto";
	},
    openSecondURL : function(component, event, helper) {
        var urlToOpen = component.get("v.modalScndButtonURL");
		//window.open(urlToOpen);
        if(component.get("v.modalIsSolution")){
            window.open(urlToOpen);
        }
        else{
            var urlArray = String(urlToOpen).split('=');
            var urlStateValue = urlArray[1];

            let navService = component.find("navService");
            let pageReference = {
                type: "comm__namedPage",
                attributes: {
                    name: "API_Details__c"
                },
                state : {
                    "apiId" : urlStateValue
                }
            };
            navService.navigate(pageReference);
        }
        component.set("v.isOpen", false);
        document.body.style.overflow = "auto";
	},
    openMarketPlace : function(component, event, helper){
        if(component.get("v.modalType") == "secondLevel"){
            let navService = component.find("navService");
            let pageReference = {
                type: "comm__namedPage",
                attributes: {
                    name: "Home"
                },
                state : {
                    "activeTab" : "BeHeard"
                }
            };
            
            component.set("v.isOpen", false);
            document.body.style.overflow = "auto";
            
            navService.navigate(pageReference);
            $A.get('e.force:refreshView').fire();
        }
        else{
            component.set("v.currentTab","Market");
            component.set("v.isOpen", false);
        	document.body.style.overflow = "auto";
            var mrktPlaceElement = document.getElementById("marketplaceBreadCrumbDiv");
            mrktPlaceElement.classList.add("breadcrumbs__main-item__selected");
            var dshbrdElement = document.getElementById("dashboardBreadCrumbDiv");
            dshbrdElement.classList.remove("breadcrumbs__main-item__selected");
        }
    },
    addSolutionAsFavourite : function(component, event, helper){
        var action = component.get("c.createUserSubscribedSolution");
        var solutionId = component.get("v.recordId");
        
        action.setParams({
            "solutionId" : solutionId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if (state === "SUCCESS") {
                
                let navService = component.find("navService");
                let pageReference = {
                    type: "comm__namedPage",
                    attributes: {
                        name: "Home"
                    },
                    state : {
                        "refreshView" : "true"
                    }
                };
                
                component.set("v.isOpen", false);
                document.body.style.overflow = "auto";
                
                navService.navigate(pageReference);
                $A.get('e.force:refreshView').fire();
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },

    handleStartOnboarding : function(component) {
        let popUpEvent = component.getEvent("closePopUpEvent");
        popUpEvent.setParams({
            "message" : "startOnboarding"
        });
        popUpEvent.fire();
    },

    handleFinishOnboarding : function(component) {
        let popUpEvent = component.getEvent("closePopUpEvent");
        popUpEvent.setParams({
            "message" : "finishOnboarding"
        });
        popUpEvent.fire();
    }
})