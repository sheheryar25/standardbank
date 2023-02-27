({
    handleClose : function(component, event, helper) {
        helper.handleClose(component,event);
    },
    
    handleAccept : function(component,event, helper){
        helper.handleClose(component,event);
    }, 

    handleAcceptSign : function(component,event, helper){
        helper.handleSign(component,event);
    }
})