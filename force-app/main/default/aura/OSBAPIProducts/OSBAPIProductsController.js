({
	doInit : function(component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id")
        var action = component.get("c.getApiProducts");
        action.setParams({
            "userId": userId
        }); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if(component.get("v.tile")===true) {
                    var allProducts = response.getReturnValue();
                    component.set("v.ourApiProducts", allProducts);
                } else {
                    var availableProducts = [];
                    var comingSoonProducts = [];
                    for(let index in response.getReturnValue()) {
                        let product = response.getReturnValue()[index];
                        if(product.Is_coming_soon__c) {
                            comingSoonProducts.push(product);
                        } else {
                            availableProducts.push(product);
                        }
                    }
                    component.set("v.comingSoonProducts", comingSoonProducts);
                    component.set("v.ourApiProducts", availableProducts);
                }
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
    goToAPIProducts: function() {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "API_Products_OPTL__c"
            }
        };
        
        navService.navigate(pageReference);
    },
    openProduct: function(component, event, helper) {
        helper.openProduct(component, event, helper);
    },
    createModalWindow : function(component, event, helper){
        var evt = $A.get("e.force:navigateToComponent");
        var modalDetails = String(event.target.id).split("|");
        
        document.body.style.overflow = "hidden";
        component.set("v.isOpen", true);
        component.set("v.modalIsComingSoon", modalDetails[0] === "true");
        component.set("v.modalIsSolution", false);
        component.set("v.modalTitle", modalDetails[1]);
        component.set("v.modalContent", modalDetails[2]);
        component.set("v.modalDocumentURL", modalDetails[3]);
        component.set("v.modalSignUpURL", modalDetails[4]);
        if(String(modalDetails[5]) != ''){
            component.set("v.apiDocAvailable", true);
        }
	},
    searchAPIProducts: function(component, event, helper) {
        let keyword = component.get("v.searchKeyword");
        component.set("v.isSearched",true);
        if(!keyword){
            let action = component.get('c.doInit');
            $A.enqueueAction(action);
        }
        else{
            helper.searchAPIProducts(component, event, helper);
        }
    },
   
    reloadAPIProducts: function(component, event, helper) {
        let keyword = component.get("v.searchKeyword");
        component.set("v.isSearched",false);
        component.set("v.noSearchResults",false);
        if(!keyword){
            let action = component.get('c.doInit');
            $A.enqueueAction(action);
        }
    },
    onCallKeyUp : function(component, event, helper) {  
        if ( event.keyCode === 13 ) {
            event.preventDefault();
            let keyword = component.get("v.searchKeyword");
            component.set("v.isSearched",false);
            if(!keyword){
                let action = component.get('c.doInit');
                $A.enqueueAction(action);
            }
            else{
                component.set("v.isSearched",true);
                helper.searchAPIProducts(component, event, helper);
            }
        } 
    },
})