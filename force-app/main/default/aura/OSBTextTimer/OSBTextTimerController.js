({
    doInit : function(component, event, helper) {
        helper.doInit(component, event, helper);
    },
    resetTimer : function(component, event, helper){
        if(event.getParam("timerState") === "RST"){
            helper.startTimer(component, event);
        }
        else if(event.getParam("timerState") === "CNL"){
            component.set("v.perText", "0:00");
            clearInterval(parseInt(component.get("v.intervalId")));
        }
    }
})