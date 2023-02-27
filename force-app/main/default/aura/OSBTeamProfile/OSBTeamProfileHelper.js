({
    createLightContact : function (component, contactArray){ 
        var action = component.get("c.createLightContact");
        action.setParams({
            "inviteList": contactArray
        });   
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.showLoading",false);
                document.querySelector(".newCase__form").reset();
                this.showToast(component,"Invite successfully sent","success");
            }else{
                component.set("v.showLoading",false);
                this.showToast(component,"It seems we can not send your invites out right now. Please try again later.","unsuccessful")
                document.querySelector(".newCase__form").reset(); 
            }
            window.setTimeout(function(){
                let navService = component.find("navService");
                let pageReference = {
                    type: "comm__namedPage",
                    attributes: {
                        name: "team_profile__c"
                    }
                };
                navService.navigate(pageReference);
                $A.get('e.force:refreshView').fire();
            }, 4000);
        });
        $A.enqueueAction(action);
    },
    declineOneSpaceAccess : function (component, contactId){
        component.set("v.showLoading",true);
        var action = component.get("c.declineNewUserAccess");
        action.setParams({
            "contactId": contactId
        });
        action.setCallback(this, function(response){
            var state = response.getState();   
            if (state === "SUCCESS") {
                this.showToast(component,"Team member access has been declined successfully.","success");
                window.setTimeout(function(){
                    let navService = component.find("navService");
                    let pageReference = {
                        type: "comm__namedPage",
                        attributes: {
                            name: "team_profile__c"
                        },
                        state : {
                            "activeTab" : "Approvals"
                        }
                    };
                    navService.navigate(pageReference);
                    $A.get('e.force:refreshView').fire();
                }, 4000);
            } else{
                component.set("v.showLoading",false);
                this.showToast(component,"It seems there was a problem in declining an invite. Please try again later.","unsuccessful");
            }
        });
        $A.enqueueAction(action);
    }, 
    approveOneSpaceAccess : function(component, contactId){
        component.set("v.showLoading",true);
        var action = component.get("c.approveNewUserAccess");
        action.setParams({
            "contactId": contactId
        });
        action.setCallback(this, function(response){
            var state = response.getState(); 
            if (state === "SUCCESS") {
                this.showToast(component,"Team member access has been approved successfully.","success");
                window.setTimeout(function(){
                    let navService = component.find("navService");
                    let pageReference = {
                        type: "comm__namedPage",
                        attributes: {
                            name: "team_profile__c"
                        },
                        state : {
                            "activeTab" : "Approvals"
                        }
                    }; 
                    navService.navigate(pageReference);
                    $A.get('e.force:refreshView').fire();
                }, 4000);
            } else{
                component.set("v.showLoading",false);
                this.showToast(component,"It seems there was a problem in approving an invite. Please try again later.","unsuccessful");
            }
        });
        $A.enqueueAction(action);
    },
    resendOneSpaceInvite : function(component, contactId){
        component.set("v.showLoading",true);
        var action = component.get("c.resendUserInviteLink");
        action.setParams({
            "contactId": contactId
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.showLoading",false);
                this.showToast(component,"Team invite resent successfully","success");
            } else{
                component.set("v.showLoading",false);
                this.showToast(component,"It seems there was a problem in resending an invite. Please try again later.","unsuccessful");
            }
        });
        $A.enqueueAction(action);
    },
    deactivateUserOneHubAccess : function(component, contactId){
        component.set("v.showLoading",true);
        var removeAccess = component.get("c.deactivateUserOneHubAccessApex");
        removeAccess.setParams({
            "contactId": contactId
        });
        removeAccess.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") { 
                this.showToast(component,"You have successfully deactivated a team members profile.","success")
                window.setTimeout(function(){
                    let navService = component.find("navService");
                    let pageReference = {
                        type: "comm__namedPage",
                        attributes: {
                            name: "team_profile__c"
                        },
                        state : {
                            "activeTab" : "TeamDetails"
                        }
                    };
                    navService.navigate(pageReference);
                    $A.get('e.force:refreshView').fire();
                }, 4000);
            } else{
                component.set("v.showLoading",false);
                this.showToast(component,"It seems there was a problem in deactivating a team member. Please try again later.","unsuccessful");
            }
        });
        $A.enqueueAction(removeAccess);
    },
    displayOnboarding : function(component) {
        document.body.setAttribute('style', 'overflow: hidden;');
        component.set("v.showPopUp", true);
        component.set("v.popUpMaxPages", 5);
        let breadcrumbs = document.getElementById('breadCrumbs');
        let header = document.getElementById('headerFixedHeight');
        breadcrumbs.style["z-index"] = 1;
        header.style["z-index"] = 1;
        this.changePopUpScreen(component, undefined, document, window);
    },
    
    changePopUpScreen : function(component, event, document, window) {
        var pageNumber = event ? event.getParam("value") : 1;
        var isNextPage = event ? pageNumber > event.getParam("oldValue") : undefined;
        this.setPopUpContent(component, pageNumber);
        this.setPopUpPosition(component, pageNumber, window, document);
        this.highlightTiles(component, pageNumber, isNextPage);
    },
    
    showToast : function(component,Message,type){
        component.set("v.toastMessage", Message);
        component.set("v.toastType",type);
        component.set("v.showToast",true);
        window.scrollTo(0,0);
    },
    
    setPopUpContent : function(component, pageNumber) {
        // when it's there in code, it's loading much faster for end users
        //$Label.c.OSB_Team_Onboarding_Title_1;
        //$Label.c.OSB_Team_Onboarding_Title_2;
        //$Label.c.OSB_Team_Onboarding_Title_3;
        //$Label.c.OSB_Team_Onboarding_Title_4;
        //$Label.c.OSB_Team_Onboarding_Title_5;
        //$Label.c.OSB_Team_Onboarding_Content_1;
        //$Label.c.OSB_Team_Onboarding_Content_2;
        //$Label.c.OSB_Team_Onboarding_Content_2_DP;
        //$Label.c.OSB_Team_Onboarding_Content_3;
        //$Label.c.OSB_Team_Onboarding_Content_4;
        //$Label.c.OSB_Team_Onboarding_Content_5;
        
        // it needs to be done with + between Label.c and label title, in other case it gives error that label is not found
        component.set("v.popUpTitle", $A.get('$Label.c.' + 'OSB_Team_Onboarding_Title_' + pageNumber));
        if(pageNumber === 2 && component.get("v.Designation") === 'designated person') {
            component.set("v.popUpContent", $A.get('$Label.c.' + 'OSB_Team_Onboarding_Content_' + pageNumber + '_DP'));
        } else {
            component.set("v.popUpContent", $A.get('$Label.c.' + 'OSB_Team_Onboarding_Content_' + pageNumber));
        }
    },
    
    highlightTiles : function(component, pageNumber, isNext) {
        let elements = []
        let numbers;
        if(isNext != undefined) {
            let prevNumber = isNext ? pageNumber - 1 : pageNumber + 1;
            numbers = [pageNumber, prevNumber];
        } else {
            numbers = [pageNumber];
        }
        numbers.forEach(function(number) {
            switch (number) {
                case 1:
                    break;
                case 2:
                    elements.push(component.find("form").getElement());
                    elements.push(component.find("side-navigation").getElement());
                    break;
                case 3:
                    elements.push(component.find("form").getElement());
                    elements.push(component.find("side-navigation").getElement());
                    break;
                case 4:
                    elements.push(component.find("form").getElement());
                    elements.push(component.find("side-navigation").getElement());
                    break;
                case 5:
                    break;
                default:
            }
        })
        
        elements.forEach(function(element) {
            $A.util.toggleClass(element, "highlighted-tile");
        });
    },
    
    setPopUpPosition : function(component, pageNumber, window, document) {
        let element = {};
        switch (pageNumber) {
            case 1:
                element.inInitialPosition = true;
                break;
            case 2:
                component.set("v.section", "Invite_Members");
                element = this.createPositionElement(component);
                break;
            case 3:
                component.set("v.section", "Approvals");
                element = this.createPositionElement(component);
                break;
            case 4:
                component.set("v.section", "Team_Details");
                element = this.createPositionElement(component);
                break;
            case 5:
                component.set("v.section", "Invite_Members");
                element.inInitialPosition = true;
                break;
            default:
        }
        component.set("v.popUpElement", element);
    },
    
    closeOnboarding : function(component, window, document) {
        component.set("v.showPopUp", false);
        window.scrollTo(0, 0);
        document.body.setAttribute('style', 'overflow: unset;');
        let breadcrumbs = document.getElementById('breadCrumbs');
        let header = document.getElementById('headerFixedHeight');
        breadcrumbs.style["z-index"] = "";
        header.style["z-index"] = "";
        let setOnboardingAction = component.get("c.setOnboardingDate");
        setOnboardingAction.setParams({
            contactId : component.get("v.contactId")
        });
        $A.enqueueAction(setOnboardingAction);
    },
    
    notifyAnalytics : function(tabName) {
        var appEvent = $A.get("e.c:OSBNavigationEvent");
        appEvent.setParams({
            "pageUrl" : tabName,
            "isSinglePageApp" : true
        });
        appEvent.fire();
    },

    createPositionElement : function(component) {
        let originalElement = component.find("side-navigation").getElement();
        let element = {};
        // places the pop on a side or below/above specified element
        let positionVertical = "VERTICAL";
        let positionHorizontal = "HORIZONTAL";
        element.offsetHeight = originalElement.offsetHeight;
        element.offsetWidth = originalElement.offsetWidth;
        element.offsetTop = originalElement.offsetTop;
        element.offsetLeft = originalElement.offsetLeft;
        element.offsetBottom = originalElement.offsetBottom;
        element.offsetHeight = originalElement.offsetHeight + 24;
        element.position = positionVertical;
        return element;
    }
})