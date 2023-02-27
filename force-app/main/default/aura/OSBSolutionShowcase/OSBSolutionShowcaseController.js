({
	doInit : function(component, event, helper) {
	    if(component.get("v.tile") === true) {
	        helper.doInitTile(component, event, helper);
        } else {
            helper.doInitFull(component, event, helper);
        }
    },
    openSolutionShowcase: function(component, event, helper) {
        helper.openSolutionShowcase(component, event, helper);
    },
    createModalWindow : function(component, event){
        var modalDetails = String(event.target.id).split("|");
        component.set("v.isOpen", true);
        component.set("v.solutionId", modalDetails[0])
        component.set("v.modalIsComingSoon", modalDetails[1] === "true");
        component.set("v.modalIsSolution", true);
        component.set("v.modalTitle", modalDetails[2]);
        component.set("v.modalContent", modalDetails[3]);
        component.set("v.modalLogo", modalDetails[4]);
        component.set("v.modalWebsiteURL", modalDetails[5]);
        component.set("v.modalSignUpURL", modalDetails[6]);
        document.body.style.overflow = "hidden";
    },
    
    handleTabChange : function(component, event, helper) {
        component.set("v.currentTab", event.getParam("tabName"));

        let section;
        if(event.getParam("tabName")==='Dashboard'){
            section = 'Dashboard';
        }
        else{
            section = 'MarketPlace';
        }

    },
    onSearchSolutions: function(component, event, helper) {
        let keyword = component.get("v.searchKeyword");
        component.set("v.isSearched",true);
        if(!keyword){
            let action = component.get('c.doInit');
            $A.enqueueAction(action);
        }
        else{
            helper.searchSolutions(component, event, helper);
        }
    },
   
    onClearSearch: function(component, event, helper) {
        let keyword = component.get("v.searchKeyword");
        component.set("v.isSearched",false);
        component.set("v.noSearchResults",false);
        if(!keyword){
            let action = component.get('c.doInit');
            $A.enqueueAction(action);
        }
    },
    onCallKeyUp : function(component, event, helper) {  
            
        if (event.keyCode === 13 ) {
            event.preventDefault();
            let keyword = component.get("v.searchKeyword");
            component.set("v.isSearched",false);
            if(!keyword){
                let action = component.get('c.doInit');
                $A.enqueueAction(action);
            }
            else{
                component.set("v.isSearched",true);
                helper.searchSolutions(component, event, helper);
            }
        } 
    },  
})