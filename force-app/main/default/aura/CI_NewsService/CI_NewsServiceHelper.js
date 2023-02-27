({
    enqueueActionAsLongTerm : function (component, action){
        if(action){
            $A.enqueueAction(action)
        }
        var actions = component.get("v.queuedLongTermActions");
        component.set("v.queuedLongTermActions", ++actions);
    },
    finishLongTermAction : function (component){
        var actions = component.get("v.queuedLongTermActions");
        component.set("v.queuedLongTermActions", --actions);
    }
})