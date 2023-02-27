({
    doInitFull : function(component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        var action = component.get("c.getSolutionShowcase");
		action.setParams({
            "userId": userId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var availableSolutions = [];
                var comingSoonSolutions = [];
                var solutions = response.getReturnValue();
                solutions = solutions.map(el => {
                    let link = el.Sign_Up_URL__c;
                    el.Sign_Up_URL__c = link;
                    return el;
                })
                for(let index in solutions) {
                    let solution = solutions[index];
                    if(solution.Is_coming_soon__c) {
                        comingSoonSolutions.push(solution);
                    } else {
                        availableSolutions.push(solution);
                    }
                }
                component.set("v.comingSoonSolutions", comingSoonSolutions);
                component.set("v.solutionShowcaseRows", availableSolutions);
                if(solutions && solutions.length === 0) {
                    component.set("v.empty", true);
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

    doInitTile : function(component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        var action = component.get("c.getSolutionShowcase");
        action.setParams({
            "userId": userId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var solutions = response.getReturnValue();
                solutions = solutions.map(el => {
                    let link = el.Sign_Up_URL__c;
                    el.Sign_Up_URL__c = link;
                    return el;
                })
                component.set("v.solutionShowcaseRows", solutions);
                if(solutions && solutions.length === 0) {
                    component.set("v.empty", true);
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
    
    openSolutionShowcase: function(component, event, helper) {

        let navService = component.find("navService");
            let pageReference = {
                type: "comm__namedPage",
                attributes: {
                    name: "Solutions_Showcase_OPTL__c"
                }
            };
            navService.navigate(pageReference);
    },

    navigateOnTabs : function(component, section){
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "Home",
            },
            state : {
                "section" : section
            }
        };

        navService.navigate(pageReference);
    },
    searchSolutions: function(component, event, helper) {
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        let searchKeyword = component.get("v.searchKeyword");
        let action = component.get("c.getSolutionSearchResults");
        action.setParams({
            "userId": userId,
            "searchKeyword" : searchKeyword,
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let availableSolutions = [];
                let comingSoonSolutions = [];
                let solutions = response.getReturnValue(); 
                if(solutions.length === 0) {
                    component.set("v.noSearchResults", true);
                }else{
                    component.set("v.noSearchResults", false);
                }
                solutions = solutions.map(el => {
                    let link = el.Sign_Up_URL__c;
                    el.Sign_Up_URL__c = link;
                    return el;
                })
                for(let index in solutions) {
                    let solution = solutions[index];
                    if(solution.Is_coming_soon__c) {
                        comingSoonSolutions.push(solution);
                    } else {
                        availableSolutions.push(solution);
                    }
                }
                component.set("v.comingSoonSolutions", comingSoonSolutions);
                component.set("v.solutionShowcaseRows", availableSolutions);
            }
            else if (state === "ERROR") {
                let errors = response.getError();
            }
        });
        $A.enqueueAction(action);
    }
})