({
	getRegisteredApplications : function(component) {
        var action = component.get("c.getRegisteredApplication");

        // Create a callback that is executed after
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Set the value received in response to attribute on component
                var res = response.getReturnValue();
                component.set("v.registeredApps",res);
                if(res && res.length === 0) {
                    component.set("v.empty",true);
                    var cmpTarget = component.find('dashboard');
                    /*Need to adjust the css postion if no solution tiles*/
                    $A.util.addClass(cmpTarget, 'adjustDashboard');
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
        // $A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
    },
    
    setPopUpContent : function(component, pageNumber) {
    // when it's there in code, it's loading much faster for end users
    //$Label.c.OSB_Onboarding_Title_1;
    //$Label.c.OSB_Onboarding_Title_2;
    //$Label.c.OSB_Onboarding_Title_3;
    //$Label.c.OSB_Onboarding_Title_4;
    //$Label.c.OSB_Onboarding_Title_5;
    //$Label.c.OSB_Onboarding_Title_6;
    //$Label.c.OSB_Onboarding_Content_1;
    //$Label.c.OSB_Onboarding_Content_2;
    //$Label.c.OSB_Onboarding_Content_3;
    //$Label.c.OSB_Onboarding_Content_4;
    //$Label.c.OSB_Onboarding_Content_5;
    //$Label.c.OSB_Onboarding_Content_6;

    // it needs to be done with + between Label.c and label title, in other case it gives error that label is not found
        component.set("v.popUpTitle", $A.get('$Label.c.' + 'OSB_Onboarding_Title_' + pageNumber));
        component.set("v.popUpContent", $A.get('$Label.c.' + 'OSB_Onboarding_Content_' + pageNumber));
    },

    setPopUpPosition : function(component, pageNumber, window, document) {
        let element;
        // places the pop on a side or below/above specified element
        let positionVertical = "VERTICAL";
        let positionHorizontal = "HORIZONTAL";
        switch (pageNumber) {
            case 1:
                element = document.getElementById("breadCrumbs");
                element.position = positionVertical;
                break;
            case 2:
                element = component.find("solutionShowcase").getElement();
                element.position = positionHorizontal;
                break;
            case 3:
                element = component.find("apiProducts").getElement();
                element.position = positionHorizontal;
                break;
            case 4:
                element = component.find("insightsHub").getElement();
                element.position = positionHorizontal;
                /* that's required, because last screen should highlight chatbot button, but it's not possible to catch
                    this element, so I'm changing overlay instead */
                document.getElementById("visibleOverlay").style["z-index"] = '';
                break;
            case 5:
                /* Unfortunately, because of lightning locker, we cannot get the chat bot element here.
                    As it's position is hardcoded, I'm hardcoding the onboarding tour also :/ */
                element = {};
                element.offsetLeft = window.innerWidth - (16 + 188); //16 - offset right of the button
                element.offsetTop = window.innerHeight - (56); // 56 - offset height of the button
                element.offsetHeight = 56;
                element.offsetWidth = 188;
                element.position = positionVertical;
                document.getElementById("visibleOverlay").style["z-index"] = 44;
                break;
            default:
        }
        component.set("v.popUpElement", element);
    },

    setAdditionalOnboarding : function(component) {
        component.set("v.isAdditionalOnboardingRequired", false);
        component.set("v.displaySecondModalButton", true);
        component.set("v.modalTitle", $A.get('$Label.c.OSB_Onboarding_Title_6'));
        component.set("v.modalContent", $A.get('$Label.c.OSB_Onboarding_Content_6'));
        component.set("v.firstModalButtonLabel", $A.get('$Label.c.OSB_Lets_Go'));
        component.set("v.shouldDisplayOnboardingModal", true);
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
                    elements.push(document.getElementById("breadCrumbs"));
                    elements.push(document.getElementById("headerFixedHeight"));
                    break;
                case 2:
                    elements.push(component.find("solutionShowcase"));
                    break;
                case 3:
                    elements.push(component.find("apiProducts"));
                    break;
                case 4:
                    elements.push(component.find("insightsHub"));
                    break;
                case 5:
                    break;
                case 6:
                    break;
                default:
            }
        })

        elements.forEach(function(element) {
           $A.util.toggleClass(element, "highlighted-tile");
        });
    },

    scrollToTile : function(component, element, window) {
        let fromTop = window.scrollY;
        let windowHeight = window.innerHeight - 80;
        let scrollRequired = false;
        if( element.offsetTop > fromTop + windowHeight || element.offsetTop < fromTop) {
            window.scrollTo(0, element.offsetTop - 16);
            scrollRequired = true;
        }
        return scrollRequired;
    },

    handleFirstSignIn : function(component, document) {
        document.body.setAttribute('style', 'overflow: hidden;');
        this.showInitialScreen(component);
    },

    showInitialScreen : function(component) {
        component.set("v.shouldDisplayOnboardingModal", true);
        component.set("v.modalTitle", $A.get('$Label.c.OSB_Onboarding_Welcome_Title'));
        component.set("v.modalContent", $A.get('$Label.c.OSB_Onboarding_Welcome_Content'));
        component.set("v.firstModalButtonLabel", $A.get('$Label.c.OSB_Get_Started'));
    },

    displayPopUp : function(component, document, window) {
        component.set("v.showPopUp", true);
        component.set("v.popUpMaxPages", 5);
        let pageNumber = component.get("v.popUpCurrentPage");
        this.setPopUpContent(component, pageNumber);
        this.highlightTiles(component, pageNumber, undefined);
        let breadcrumbs = document.getElementById('breadCrumbs');
        let header = document.getElementById('headerFixedHeight');
        breadcrumbs.style["z-index"] = 1;
        header.style["z-index"] = 1;
        this.setPopUpPosition(component, pageNumber, window, document);
    },

    handleCloseRegularOnboarding : function(component, pageNumber, document) {
        this.highlightTiles(component, pageNumber, undefined);

        window.scrollTo(0, 0);
        if(component.get("v.isAdditionalOnboardingRequired")) {
            this.setAdditionalOnboarding(component);
            component.set("v.showPopUp", false);
        } else {
            component.set("v.showPopUp", false);
            document.body.setAttribute('style', 'overflow: unset;');
            let breadcrumbs = document.getElementById('breadCrumbs');
            let header = document.getElementById('headerFixedHeight');
            breadcrumbs.style["z-index"] = "";
            header.style["z-index"] = "";
        }
        var action = component.get("c.setUserContactOnboardingDate");
        action.setParams({
            contactId : component.get("v.userContactId")
        });
        $A.enqueueAction(action);
    },

    notifyAnalytics: function(tabName) {
        var appEvent = $A.get("e.c:OSBNavigationEvent");
        appEvent.setParams({
            "pageUrl" : tabName,
            "isSinglePageApp" : true
        });
        appEvent.fire();
    },
    
    toggleMobileMenu : function(component, isToggled) {
        component.set("v.mobileMenuToggled", isToggled);
    }
})