({
    init : function(component, event, helper) {
        component.set("v.EmailPattern","^[a-zA-Z0-9._|\\\\%#~`=?&/$^*!}{+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$");
        component.set("v.disclaimer","By deactivating a team member profile, this means the team member won't be able to sign in "+
                      "<br>and access OneHub as well as any solution they have signed up for through OneHub."+
                      "<br>"+
                      "<br>If you require any changes or updates to your team details, please email us at"+
                      "<br><p class=emailFormatting>onehub@standardbank.co.za.</p>");
        var action = component.get("c.getTeamContacts");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var responseList = [];
                var inviteSentList =  [];
                var pendingApp = [];
                var approvedUsers = [];
                responseList =  response.getReturnValue().teamInvitesSent;
                responseList.forEach(function (item, index) {
                    if(item.OSB_Community_Access_Status__c === 'Invite Sent') {
                        inviteSentList.push(item); 
                    } else if(item.OSB_Community_Access_Status__c === 'Pending Approval') {
                        pendingApp.push(item); 
                    } else if(item.OSB_Community_Access_Status__c === 'Approved') {
                        let designation = item.OSB_Community_Access_Role__c.toLowerCase();
                        if(designation === 'designated person' || designation === 'nominated person') {
                            approvedUsers.push(item);
                        }
                        item.OSB_Community_Access_Role__c = designation.charAt(0).toUpperCase() + designation.slice(1);
                    }
                });
                let primaryContact = response.getReturnValue().primaryContact;
                component.set("v.Designation", primaryContact.OSB_Community_Access_Role__c.toLowerCase());
                if(primaryContact.OSB_Community_Access_Role__c === 'Authorised Person') {
                    component.set("v.accessLevel",true);
                }
                if(!primaryContact.OSB_Team_Profile_Onboarding_Tour_Date__c) {
                    component.set("v.contactId", primaryContact.Id);
                    helper.displayOnboarding(component, window, document);
                }
                component.set("v.pendingApprovals",pendingApp);
                component.set("v.sentInvite",inviteSentList);
                component.set("v.teamDetails",approvedUsers);
            }
        })
        
        $A.enqueueAction(action);
        
        var urlSearchString = window.location.search;
        if(urlSearchString != null && urlSearchString != ''){
            var pushStateUrl = String(window.location.pathname).split('?');
            var urlParams = String(urlSearchString).split('?');
            var activeTab = String(urlParams[1]).split('=');
            if(String(activeTab[0]) === 'activeTab'){
                if(String(activeTab[1]) === 'TeamDetails' || String(activeTab[1]) === 'Team_Details'){
                    component.set("v.section", 'Team_Details');
                }
                else if(String(activeTab[1]) === 'Approvals'){
                    component.set("v.section", String(activeTab[1]));
                }
                    else {
                        component.set("v.section", "Invite_Members");
                    }
                window.history.pushState({}, document.title, pushStateUrl[0]);
            }
        }
    },
    
    AddAnother : function(component){
        var numOfInvites = component.get("v.NumberOFInvites");
        var num = numOfInvites[numOfInvites.length - 1];
        var integer = parseInt(num, 10);
        numOfInvites.push(integer + 1);
        component.set("v.NumberOFInvites",numOfInvites);
    },
    
    sendInvite : function(component, event, helper) {
        const validateEmail = email => /^[^@ ]+@[^@ ]+\.[^@ \.]+$/.test(email);
        const isValidEmail = value => validateEmail(value);
        var contactArray = component.get("v.contactsList");
        var newContact = component.get("v.newContact");
        let numOfActualInvites = 0;
        let DataArray = [];
        var numOfInvites = component.get("v.NumberOFInvites");
        var emailNameArray = Array.from(component.find("Email"));
        var FirstNameArray = Array.from(component.find("FirstName"));
        var LastNameArray = Array.from(component.find("LastName"));
        var access = component.get("v.accessLevel");
        if(access){
           var toggleArray = Array.from(component.find("toggle")); 
        } 
        for(var i = 0; i < numOfInvites.length; i++) {
            let persona;
            let emailValueBefore = emailNameArray[i].get("v.value").trim();
            let FirstNameArrayBefore = FirstNameArray[i].get("v.value").trim();
            let LastNameArrayBefore = LastNameArray[i].get("v.value").trim();   
            if(emailValueBefore || FirstNameArrayBefore || LastNameArrayBefore){
                if(access){
                    let inviteOthers = toggleArray[i].get("v.checked");  
                    if(inviteOthers) {
                        persona = 'Designated person';
                    } else {
                        persona = 'Nominated person';
                    }
                }else{
                    persona = 'Nominated person';
                }
                let dataLine = {
                    ArrayLine:i,
                    EmailValue:emailNameArray[i],
                    FirstName:FirstNameArray[i],
                    LastName:LastNameArray[i],
                    role:persona,
                };
                DataArray.push(dataLine);
            }
        }
        DataArray.forEach((element, index) => {
            if(element.EmailValue.get("v.value").trim() === '') {
                element.EmailValue.setCustomValidity("Enter email address"); 
                element.EmailValue.reportValidity(); 
            } else if(!isValidEmail(element.EmailValue.get("v.value").trim())) {
            	element.EmailValue.setCustomValidity(" "); 
                element.EmailValue.reportValidity();
                helper.showToast(component,"It seems an entered email address is not valid.Please review and try again.","unsuccessful");
            } else {
            	element.EmailValue.setCustomValidity(""); 
                element.EmailValue.reportValidity();
        	}
            if(element.FirstName.get("v.value").trim() === '') {
                element.FirstName.setCustomValidity("Enter first name"); 
                element.FirstName.reportValidity(); 
            } else {
                element.FirstName.setCustomValidity(""); 
                element.FirstName.reportValidity();
            }
            if(element.LastName.get("v.value").trim() === '') {
                element.LastName.setCustomValidity("Enter last name"); 
                element.LastName.reportValidity(); 
            } else {
                element.LastName.setCustomValidity(""); 
                element.LastName.reportValidity(); 
            }
        });
        if(DataArray.length > 0) {
            let isValid = false;
            DataArray.forEach((element, index) => {
                let firstNameValue = element.FirstName.get("v.value").trim();
                let lastNameValue = element.LastName.get("v.value").trim();
                let emailValue = element.EmailValue.get("v.value").trim();
                let roleValue = element.role;
                if(firstNameValue && lastNameValue && emailValue && roleValue){
                	isValid = true;
            	}
            	contactArray.push({'sobjectType':'Contact','FirstName':firstNameValue,'LastName':lastNameValue,'Email':emailValue,'OSB_Community_Access_Role__c':roleValue});
            });
            if(isValid) {
                component.set("v.showLoading",true);
            	helper.createLightContact(component, contactArray); 
                contactArray = [];
            } else {
                helper.showToast(component,"Please correct any errors before submitting invites","unsuccessful");
            }
        } else {
            helper.showToast(component,"You will need to enter at least one entry below in order to send an invite.","unsuccessful");
        }
    }, 
    
    cancel : function(component) {
        component.set("v.reasonForPopup","Cancel Invite");
        component.set("v.titleForPopup","Cancel request?");
        component.set("v.contentForPopup","By doing so you will clear the form to it’s original state."); 
        component.set("v.showMarketgramPopup",true);
    },
    
    getToggleButtonValue : function(component) {
        var array = Array.from(component.find("toggle"));
    }, 
    
    handleNavItemChange : function(component, event, helper) {
        component.set("v.section", event.currentTarget.dataset.tabName);
        helper.notifyAnalytics(event.currentTarget.dataset.tabName);
    },
    
    handleSectionChange : function(component, event, helper) {
        var elements = document.getElementsByClassName("marketplace__navigation-item__selected");
        $A.util.removeClass(elements[0], 'marketplace__navigation-item__selected');
        let currentElement;
        if(component.find(component.get("v.section")) != undefined){
            currentElement = component.find(component.get("v.section")).getElement();
        }
        $A.util.addClass(currentElement, 'marketplace__navigation-item__selected');
    },
    
    declineOneSpaceAccess : function(component, event) {
        component.set("v.reasonForPopup","declineOneSpaceAccess");
        component.set("v.titleForPopup","Decline access?");
        component.set("v.contentForPopup","You are about to decline someone's access. Do you want to continue?");
        component.set("v.clickedButton",event.target.id);
        component.set("v.showMarketgramPopup",true);
    },
    
    approveOneSpaceAccess : function(component, event) {
        component.set("v.reasonForPopup","approveOneSpaceAccess");
        component.set("v.titleForPopup","Approve access");
        component.set("v.contentForPopup","You are about to approve someone's access. This will then move them to team details. Would you like to do so?");
        component.set("v.clickedButton",event.target.id);
        component.set("v.showMarketgramPopup",true);
    },
    
    resendOneSpaceInvite : function(component, event) {
        component.set("v.reasonForPopup","resendOneSpaceInvite");
        component.set("v.titleForPopup","Resend invite");
        component.set("v.contentForPopup","You are about to resend and invite. Would still like to do so?");
        component.set("v.clickedButton",event.target.id);
        component.set("v.showMarketgramPopup",true);
    }, 
    
    deactivateUserOneHubAccess : function(component, event) {
        component.set("v.reasonForPopup","deactivateUserOneHubAccess");
        component.set("v.titleForPopup","Deactivate profile?");
        component.set("v.contentForPopup","You are about to deactivate someone's profile. Do you want to continue?");
        component.set("v.clickedButton",event.target.id);
        component.set("v.showMarketgramPopup",true);
    },
    
    handlePopupClose : function(component, event, helper) {
        if(event.getParam("pageNumber") != undefined) {
            helper.closeOnboarding(component, window, document);
        } else {
            var optionSelected = event.getParam("optionSelected");
            if(optionSelected=="Yes"){
                var reasonForPopup = component.get("v.reasonForPopup");
                var clickedButton = component.get("v.clickedButton");
                if(reasonForPopup == "resendOneSpaceInvite"){
                    var buttonIndex = String(clickedButton).slice(String(clickedButton).length - 1);
                    var contactId = String(document.getElementById("inviteContactId" + buttonIndex).value);
                    helper.resendOneSpaceInvite(component,contactId);
                }
                else if(reasonForPopup == "approveOneSpaceAccess"){
                    var buttonIndex = String(clickedButton).slice(String(clickedButton).length - 1);
                    var contactId = String(document.getElementById("contactId" + buttonIndex).value);
                    helper.approveOneSpaceAccess(component,contactId);
                }
                    else if(reasonForPopup == "declineOneSpaceAccess"){
                        var buttonIndex = String(clickedButton).slice(String(clickedButton).length - 1);
                        var contactId = String(document.getElementById("contactId" + buttonIndex).value);
                        helper.declineOneSpaceAccess(component, contactId);
                    }
                        else if(reasonForPopup == "deactivateUserOneHubAccess"){
                            var buttonIndex = String(clickedButton).slice(String(clickedButton).length - 1);
                            var contactId = String(document.getElementById("contact" + buttonIndex).value);
                            helper.deactivateUserOneHubAccess(component, contactId);
                        }
                            else if(reasonForPopup == "Cancel Invite"){
                                document.querySelector(".newCase__form").reset();
                            }
                component.set("v.showMarketgramPopup",false);
            }
            else{
                component.set("v.showMarketgramPopup",false);
            }
        }
    },
    
    handlePopupPageChange : function(component, event, helper) {
        helper.changePopUpScreen(component, event, document, window);
    },
    
    handleOptionChanged : function(component, event, helper) {
        let tabName = event.getParam("marketplaceTab");
        component.set("v.section", tabName);
    }
    
})