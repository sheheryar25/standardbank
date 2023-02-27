/**
 * Created by milipinski on 20.06.2018.
 */
({
    getNotes: function (component) {
        var helper = this;
        component.set('v.isLoading', true);
        var action = component.get('c.getNotes');
        let selectedCategories = component.get('v.selectedCategories');
        //If no filter selected show all notes
        if(selectedCategories.length == 0){
            selectedCategories = ["ALL"];
        }
        selectedCategories = selectedCategories.map(category => category.toUpperCase());
        console.log("selectedCategories", selectedCategories);
        action.setParams({
            accId: component.get('v.recordId'),
            pageNumber: component.get('v.currentPageNumber'),
            pageSize: component.get('v.pageSize'),
            selectedCategories: selectedCategories
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {

                var res = response.getReturnValue();
                if (res != null){
                    component.set('v.notesLength', res.notes.length);
                    if (!component.get('v.showAll')) {
                        res.notes.length = res.notes.length > 6 ? 6 : res.notes.length;
                    }
                    let i = 0; 
                    res.notes.forEach((item) => {
                        item.Id = i++
                        item.category = helper.capitalize(item.type.toLowerCase());
                        let noteDateTime = item.noteDatedOn.split('T');
                        item.noteDate = noteDateTime[0];
                        item.noteTime = noteDateTime[1];
                    });
                    component.set('v.notes', res.notes);
                    //Show all notes on init
                    component.set('v.filteredNotes', res.notes);
                }
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    helper.showToast("Notes cannot be fetched for this Client. Please note the administrator has been notified", 'error');
                } else {
                    console.log("Unknown error");
                }
            }
            component.set('v.isLoading', false);
            helper.setChevronStyle(component, event);
        });
        $A.enqueueAction(action); 

    },
    getAllCustomerNotepadCategories: function (component, event) {
        var helper = this;
        var action = component.get('c.getAllCustomerNotepadCategories');
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {

                //Sort allCategories alphabetically
                let listOfCategories = response.getReturnValue();
                listOfCategories.sort(function(a,b){
                    let textA = a.Note_Type_Name__c.toUpperCase();
                    let textB = b.Note_Type_Name__c.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                component.set("v.allCategories", listOfCategories);
                component.set("v.options", this.getOptionsForFilter(response.getReturnValue()));

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
        });
        $A.enqueueAction(action);
    },
    getOptionsForFilter: function (allCategories) {
        let options = [];
        for(let i = 0; i < allCategories.length; i++){
            let option = {
                label: allCategories[i].Note_Type_Name__c,
                value: allCategories[i].Note_Type_Name__c
            };
            options.push(option);
        }
        options.unshift({label: 'All', value: 'All'});
        return options;
    },
    handleToggleFilters :  function (component, event) {
        let showFilters = component.get('v.showFilters');
        showFilters = !showFilters;
        component.set('v.showFilters', showFilters);

        if(showFilters){
            component.find('noteTypesFilter').focus();
        }
    },
    applyFilters :  function (component, event) {
        let selectedFilters = component.find("noteTypesFilter").get("v.value");
        component.set("v.selectedCategories", selectedFilters);
        component.set('v.currentPageNumber', 1);
        this.handleToggleFilters(component, event);
        this.getNotes(component);
    },
    buildTable: function (component) {
        if (component.get('v.showAll')) {
            component.set('v.columns', [{
                    label: 'Category',
                    fieldName: 'category',
                    type: 'text'
                },
                {
                    label: 'Note',
                    fieldName: 'noteDetails',
                    type: 'text'
                },
                {
                    label: 'Created By',
                    fieldName: 'noteCreatedBy',
                    type: 'text'
                },
                {
                    label: 'Created Date',
                    fieldName: 'noteDate',
                    type: 'date'
                },
                {
                    label: 'Created Time',
                    fieldName: 'noteTime',
                    type: 'text'
                },
                {
                    label: "Preview",
                    type: 'button',
                    typeAttributes:{
                        label: "View",
                        name: "ShowNote",
                        title: "Show this note"
                    }
                }
            ]);
        } else {
            component.set('v.columns', [{
                    label: 'Category',
                    fieldName: 'category',
                    type: 'text'
                },
                {
                    label: 'Note',
                    fieldName: 'noteDetails',
                    type: 'text'
                },
                {
                    label: 'Created Date',
                    fieldName: 'noteDate',
                    type: 'date'
                },
                {
                    label: "Preview",
                    type: 'button',
                    typeAttributes:{
                        label: "View",
                        name: "ShowNote",
                        title: "Show this note"
                    }
                }
            ]);
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
    openCreationViewModal: function (component, event, isInViewMode) {
        var helper = this;
        let noteInfo = null;
        let allCategories = component.get("v.allCategories");
        let recordId = component.get("v.recordId");
        if(isInViewMode){
            let rowIndex = event.getParam('row').Id;
            noteInfo = component.get('v.notes')[rowIndex];
            // Remove extra white spaces on both sides of the Note Details
            noteInfo.noteDetails = noteInfo.noteDetails.trim();
        }
        $A.createComponent("c:PBB_SapNotes_CreationModal", {isInViewMode: isInViewMode, noteInfo: noteInfo, allCategories: allCategories, recordId: recordId},
            function(content, status){
                if (status === "SUCCESS") {
                   let modalPromise = component.find('overlayLib').showCustomModal({
                       header: isInViewMode ? "View note" : "Create note",
                       body: content,
                       showCloseButton: true
                   });
                   //Set modalPromise attribute for Child Component after it is returned by showCustomModal
                   //content.set("v.modalPromise", modalPromise);
                   component.set("v.modalPromise", modalPromise);
                }
            });
    },
    closeOpenedModal: function (component, event) {
       if(component.get("v.modalPromise") != null){
           component.get("v.modalPromise").then(
                function(modal) {
                    modal.close();
            });  
       }
    },
    setChevronStyle :  function (component, event) {
        let chevronLeft = component.find("chevronleftId");
        let chevronRight = component.find("chevronrightId");
        if(component.get('v.currentPageNumber') == 1){
            $A.util.addClass(chevronLeft, 'inactive-chevron');
        }
        else{
            $A.util.removeClass(chevronLeft, 'inactive-chevron');
        }
        if(!component.get('v.isThereNextPage')){
            $A.util.addClass(chevronRight, 'inactive-chevron');
        }
        else{
            $A.util.removeClass(chevronRight, 'inactive-chevron');
        }
    },
    capitalize: function (string) {
		//return string.toLowerCase();
		//let regex = /(\s|\/){1}/;
		//console.log("splitByAndRejoin", this.splitByAndRejoin( string, regex ));
		//return this.splitByAndRejoin( string, "(\\s|\\/){1}");
        string = this.splitByAndRejoin(string, ' ');
        string = this.splitByAndRejoin(string, '/');

        return string;
    },
    splitByAndRejoin: function (string, separator) {
        let words = [];
        if(separator == ' '){
             string.toLowerCase().trim().split(separator).forEach((x) => {
                 words.push(x.charAt(0).toUpperCase() + x.slice(1));
             });
        }
        else{
             string.split(separator).forEach((x) => {
                 words.push(x.charAt(0).toUpperCase() + x.slice(1));
             });
        }

        return words.join(separator);
    }
})