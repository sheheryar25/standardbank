({
    closeAllDropDown: function() {
        Array.from(document.querySelectorAll('#picklist-dropdown')).forEach(function(node){
            node.classList.remove('slds-is-open');
        });
    },

    onDropDownClick: function(dropDownDiv) {
        var classList = Array.from(dropDownDiv.classList);
        if(!classList.includes("slds-is-open")){
            this.closeAllDropDown();
            dropDownDiv.classList.add('slds-is-open');
        } else{
            this.closeAllDropDown();
        }
        
    },

    handleClick: function(component, event, where) {
        var tempElement = event.target;
        var outsideComponent = true;
        var multiComp = component.find("MultiSelect");
        while(tempElement){
            if(tempElement.id === 'list-item'){
                multiComp.setCustomValidity("");
                multiComp.reportValidity();
                if(where === 'component'){
                	this.onOptionClick(component, event.target);
                }
                outsideComponent = false;
                break;
            } else if(tempElement.id === 'dropdown-items'){
                outsideComponent = false;
                break;
            } else if(tempElement.id === 'picklist-dropdown'){
                if(where === 'component'){
                	this.onDropDownClick(tempElement);
                }
                outsideComponent = false;
                break;
            }
            tempElement = tempElement.parentNode;
        }
        if(outsideComponent){
            component.set("v.outSideElement","true");
            this.closeAllDropDown();
        }
    },
    
    rebuildPicklist: function(component) {
        var allSelectElements = component.getElement().querySelectorAll("li");
        Array.from(allSelectElements).forEach(function(node){
            node.classList.remove('slds-is-selected');
        });
    },
    
    filterDropDownValues: function(component, inputText) {
        var allSelectElements = component.getElement().querySelectorAll("li");
        Array.from(allSelectElements).forEach(function(node){
            if(!inputText){
                node.style.display = "block";
            }
            else if(node.dataset.name.toString().toLowerCase().indexOf(inputText.toString().trim().toLowerCase()) != -1){
                node.style.display = "block";
            } else{
                node.style.display = "none";
            }
        }); 
    },
    resetAllFilters : function(component) {
        this.filterDropDownValues(component, '');
    },
    setPickListName : function(component, selectedOptions) {
        const maxSelectionShow = component.get("v.maxSelectedShow");
        const operatingCountriesComp = component.find("MultiSelect");
        if(selectedOptions.length == 0){            
            operatingCountriesComp.set("v.value",'');
            component.set("v.selectedLabel", 'Enter operating country/countries'); 
        }
        else if(selectedOptions.length < 1){
            component.set("v.selectedLabel", component.get("v.msname"));
            operatingCountriesComp.set("v.value",selectedOptions.Name);
            operatingCountriesComp.setCustomValidity("");
            operatingCountriesComp.reportValidity();
        } else if(selectedOptions.length > maxSelectionShow){
            component.set("v.selectedLabel", selectedOptions.length+' Options Selected');
            operatingCountriesComp.set("v.value", selectedOptions.length+' Options Selected');
        } else{
            var selections = '';
            selectedOptions.forEach(option => {
                selections += option.Name+';';
            });
                component.set("v.selectedLabel", selections.slice(0, -1));
                operatingCountriesComp.set("v.value", selections.slice(0, -1));
            }
    },
    
    onOptionClick: function(component, ddOption) {
            var clickedValue = {"Id":ddOption.closest("li").getAttribute('data-id'),
                                "Name":ddOption.closest("li").getAttribute('data-name')};
            var selectedOptions = component.get("v.selectedOptions");
            var alreadySelected = false; 
            selectedOptions.forEach((option,index) => {
                if(option.Id === clickedValue.Id){
                    selectedOptions.splice(index, 1);   
                    alreadySelected = true;
                    ddOption.closest("li").classList.remove('slds-is-selected');
                } 
            });
            if(!alreadySelected){
                selectedOptions.push(clickedValue);
                 ddOption.closest("li").classList.add('slds-is-selected');
            }
        this.setPickListName(component, selectedOptions);
    },
               
})