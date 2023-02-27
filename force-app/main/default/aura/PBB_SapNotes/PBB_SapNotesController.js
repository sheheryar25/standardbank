/**
 * Created by milipinski on 20.06.2018.
 */
({
    doInit: function (component, event, helper) {
        var pageRef = component.get('v.pageReference');
        if (pageRef && pageRef.state) {
            component.set('v.showAll', pageRef.state.c__showAll);
            component.set('v.recordId', pageRef.state.c__recordId);
            component.set('v.sObjectName', pageRef.state.c__sObjectName);
        }
        helper.buildTable(component);
        helper.getNotes(component);
        helper.getAllCustomerNotepadCategories(component, event);
    },
    handleSapNotesEvent: function (component, event, helper) {
        var actionsFired = event.getParam("actionsFired");
        if(actionsFired.includes("closeModal")){
            helper.closeOpenedModal(component, event);
        }
        if(actionsFired.includes("getNotes")){
            helper.getNotes(component);
        }
    },
    showFullList: function (component, event, helper) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getEnclosingTabId().then(function (enclosingTabId) {
            console.info('enclosingTabId', enclosingTabId);
            workspaceAPI.openSubtab({
                parentTabId: enclosingTabId,
                pageReference: {
                    "type": "standard__component",
                    "attributes": {
                        "componentName": "c__PBB_SapNotes"
                    },
                    "state": {
                        "uid": "1",
                        "c__recordId": component.get("v.recordId"),
                        "c__sObjectName": component.get('v.sObjectName'),
                        "c__showAll": true
                    }
                }
            }).then(function (subtabId) {
                console.info('subtabId', subtabId);

                workspaceAPI.setTabIcon({
                    tabId: subtabId,
                    icon: 'standard:note',
                    iconAlt: 'Notes'
                });
                workspaceAPI.setTabLabel({
                    tabId: subtabId,
                    label: 'History Notes'
                });
                workspaceAPI.focusTab({
                    tabId: enclosingTabId
                });
                workspaceAPI.focusTab({
                    tabId: subtabId
                });
            }).then(function (subtabId) {
                console.log("The new subtab ID is:" + subtabId);
            }).catch(function (error) {
                console.log("error");
            });
        });
    },
    handleToggleFilters :  function (component, event, helper) {
        helper.handleToggleFilters(component, event);
    },
    handleFilterChange :  function (component, event, helper) {
        let selectedValues = event.getParam('value');
        let allNotes = component.get("v.notes");
        //If everything is selected and user unchecks any option but All - deselect All option as well
        if(selectedValues.length == component.get("v.options").length - 1 && selectedValues.includes("All") && component.get("v.isAllOptionSelected")){
                selectedValues = selectedValues.filter(function(value){return value != "All"});
                component.set("v.filteredBy", selectedValues);
                component.set("v.isAllOptionSelected", false);
        }
        //Select and filter by every option if All is selected
        if(selectedValues.includes("All")){
            selectedValues = component.get("v.options").map(option => option.label);
            component.set("v.filteredBy", component.get("v.options").map(option => option.label));
            component.set("v.isAllOptionSelected", true);
        }
        else{
            //Deselect everything if All option was unchecked
            if(component.get("v.isAllOptionSelected")){
                component.set("v.filteredBy", []);
                component.set("v.isAllOptionSelected", false);
            }
        }
        //If no filter selected show all notes
        if(selectedValues.length == 0){
            //component.set("v.filteredNotes", allNotes);
        }
        else{
            let filteredNotes = allNotes.filter(function(note){
                return selectedValues.includes(note.category);
            });
            //component.set("v.filteredNotes", filteredNotes);
        }
    },
    applyFilters :  function (component, event, helper) {
        helper.applyFilters(component, event);
    },
    changePageSize :  function (component, event, helper) {
        component.set("v.pageSize", parseInt(component.find('pageSizeSelect').get('v.value')));
        let selectedCategories = component.get('v.selectedCategories');
        component.set('v.currentPageNumber', 1);
        helper.getNotes(component);
    },
    goToPage :  function (component, event, helper) {
        let pageSize = component.get('v.pageSize');
        let currentPageNumber = component.get('v.currentPageNumber');
 
        let chevronId = event.getSource().getLocalId();
        if(component.get('v.isThereNextPage') && chevronId == "chevronrightId"){
            currentPageNumber += pageSize;
            component.set('v.currentPageNumber', currentPageNumber);
            helper.getNotes(component);
        }
        if(currentPageNumber != 1 && chevronId == "chevronleftId"){
            currentPageNumber -= pageSize;
            component.set('v.currentPageNumber', currentPageNumber);
            helper.getNotes(component);
        }
    },
    openCreationModal: function (component, event, helper) {
          var isInViewMode;
          if(event.getSource().getLocalId() == 'newNoteAction'){
              isInViewMode = false;
          }
          else {
              isInViewMode = true;
          }
        helper.openCreationViewModal(component, event, isInViewMode);
    }
})