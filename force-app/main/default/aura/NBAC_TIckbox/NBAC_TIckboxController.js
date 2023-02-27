({
	handleRecordChange: function (component, event, helper) {
		var record = component.get('v.simpleRecord');
        if(!record){
            component.find('forceRecord').reloadRecord();            
        } else if(record[component.get('v.field')] == true){
			component.set('v.showTick', true);
		} else {
			component.set('v.showTick', false);
		}
	}
})