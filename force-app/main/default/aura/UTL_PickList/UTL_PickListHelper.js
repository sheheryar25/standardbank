({
	
	closeMenuHelper : function(cmp, event, helper) {
		let openCmps = cmp.find("open");
		let elemOpenCMps = openCmps.getElement();
		let timeout = setTimeout(function(){
			elemOpenCMps.classList.remove('slds-is-open');
		},250);
		cmp.set('v.timeout',timeout);
	},
	focusHelper : function(cmp, event, helper){
		
		let parentClass = event.currentTarget.parentElement.parentElement;
		$A.util.toggleClass(parentClass, 'slds-is-open');
	},
	focusOnSearchHelper : function(cmp, event, helper){
		
		clearTimeout(cmp.get('v.timeout'));
		
	},
	itemSelectedHelper : function(cmp, event, helper) {
		let selectedItem = event.currentTarget; 
		let selectedItemlbl = selectedItem.dataset.lbl;
		let search_input = cmp.find("search_input");
		let tempOptions  = cmp.get('v.tempOptions');
		let dependencyMap = cmp.get('v.dependencyMap');
		let isDependent = cmp.get('v.isDependent');
		let showSearch = cmp.get('v.showSearch');
		let openCmps = cmp.find("open");
		if(showSearch){
			let searcEle = search_input.getElement();
			if(searcEle.value){
				searcEle.value='';
				cmp.set('v.options',tempOptions);
			}
		}
		if(isDependent){
			cmp.set('v.returnedDependency',dependencyMap[selectedItemlbl])
		}
		
		cmp.set('v.runOnce',true);
		cmp.set('v.assignTo',selectedItemlbl);
		let elemOpenCMps = openCmps.getElement();
		elemOpenCMps.classList.remove('slds-is-open');
	},
	handleValueChangeHelper : function(cmp, event, helper) {
		let runOnce = cmp.get('v.runOnce');
		if(runOnce){
			let compEvent = cmp.getEvent("pickListEvent");
			compEvent.setParams(
				{ "data":{
					"recId": cmp.get('v.recId'),
					"oldValue": event.getParam("oldValue"),
					"currentValue": event.getParam("value"),
					"fieldName": cmp.get('v.fieldName')
				}});
				cmp.set('v.runOnce',false);
				compEvent.fire();
			}
		},
		onkeydownHelper:function(cmp,event,helper){
			let search_input = event.target.value;
			let tempOptions  = cmp.get('v.tempOptions');
			let searchdData = [];
			if(search_input){
				if(search_input.length>2){
					cmp.set('v.wasSearching',true); 
					for(let index in tempOptions){
						if (tempOptions[index].value.toLowerCase().indexOf(search_input.toLowerCase())!== -1){
							
							searchdData.push(tempOptions[index]);
						}
						
					}
					cmp.set('v.options',searchdData);
				}
				else if(search_input.length<=2 && cmp.get('v.wasSearching')){
					
					let tempOptions  = cmp.get('v.tempOptions');
					cmp.set('v.options',tempOptions);
					cmp.set('v.wasSearching',false);
					
				}
			}
		}
		
})