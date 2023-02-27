({
    toggleSection : function (component, event, helper){
        event.currentTarget.parentNode.classList.toggle('slds-is-open');
    },
    redirectToClient : function (component, event, helper){
        event.stopPropagation();
        var navEvt = $A.get("e.force:navigateToSObject");
        if(!navEvt || !event.getSource().get("v.name")){return;}
        navEvt.setParams({
          "recordId": event.getSource().get("v.name").replace('/',''),
          "slideDevName": "detail"
        });
        navEvt.fire();

    }
})