/**
 * Created by Mykhailo Reznyk on 21.02.2020.
 */
({
    createNewNote: function (component, event) {
        var helper = this;
        var action = component.get('c.createNewNote');
        if(component.find("newNoteBody").get("v.value") == '' || component.find("newNoteCategory").get("v.value") == ''){
            console.log("Values are not set");
            console.log("body: ", component.find("newNoteBody").get("v.value"));
            console.log("category: ", component.find("newNoteCategory").get("v.value"));
        }
        else {
            console.log("Values are set and fine"); 
            component.set('v.isLoading', true);
            action.setParams({
                recordId: component.get("v.recordId"),
                body: component.find("newNoteBody").get("v.value"),
                category: component.find("newNoteCategory").get("v.value").toUpperCase()
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS") {

                    var createNoteStatusCode = response.getReturnValue();

                    if(createNoteStatusCode == 201){
                        helper.closeOpenedModal(component, event, true);
                        helper.showToast("New Note was successfully created", "success");
                    }
                    else{
                        helper.showToast("Note was not created. Error code: " + createNoteStatusCode, "error");
                    }


                } else if (state === "INCOMPLETE") {
                    // do something
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            helper.showToast("Error message: " +
                                errors[0].message, 'error');
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
                component.set('v.isLoading', false);
            });
            $A.enqueueAction(action);
        }
    },
    showToast: function (message, type) {
        var toastEvent = $A.get("e.force:showToast");
        if (!toastEvent) {
            return;
        }
        toastEvent.setParams({
            type: type ? type : 'other',
            message: message
        });
        toastEvent.fire();
    },
    closeOpenedModal: function (component, event, onSave) {
       let actions = ["closeModal"];
       if(onSave){
          actions.push("getNotes");
       }
       this.fireEvent(component, event, actions);
    },
    fireEvent: function (component, event, actions) {
       var sapNotesEvent = $A.get("e.c:PBB_SapNotes_Event");
       sapNotesEvent.setParams({
           "actionsFired" : actions
       });
       sapNotesEvent.fire();
    }
})