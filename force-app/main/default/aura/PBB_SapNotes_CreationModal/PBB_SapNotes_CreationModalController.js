/**
 * Created by Mykhailo Reznyk on 21.02.2020.
 */
({
    saveNewNote: function (component, event, helper) {
        helper.createNewNote(component, event);
    },
    closeModal: function (component, event, helper) {
       helper.closeOpenedModal(component, event, false);
    }
})