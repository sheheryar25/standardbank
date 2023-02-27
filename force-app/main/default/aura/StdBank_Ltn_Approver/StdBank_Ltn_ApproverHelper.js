({
    processEvent: function (component, event) {
        component.set('v.dataEvent', event.getParam('data'));

        switch (event.getParam('type')) {
            case 'approve':
                this.setupModal(component, 'Approval', 'comment', 'Approve');
                this.openModal(component);
                break;
            case 'reject':
                this.setupModal(component, 'Rejection', 'comment', 'Reject');
                this.openModal(component);
                break;
            case 'reassign':
                this.setupModal(component, 'Reassign', 'lookup', 'Reassign');
                this.openModal(component);
                break;
            default:
                break;
        }
    },
    processSave: function (component) {
        var type = component.get('v.dataModal').action;
        var data = (component.get('v.isLookup')) ? component.get('v.dataModalLookup').Id : component.get('v.dataModalTextArea');
        var id = component.get('v.dataEvent').Id;

        
        switch (type) {
            case 'Approve':
                this.doApprove(component, id, data);
                this.clearEvent(component);
                break;
            case 'Reject':
                this.doReject(component, id, data);
                this.clearEvent(component);
                break;
            case 'Reassign':
             if ($A.util.isEmpty(data)) {
            alert('Please select a user for reassignment');
              } 
		 else {
                this.doReassign(component, id, data);
                this.clearEvent(component);
                break;
              }
	
            default:
                console.log('Unsupported action received!');
                break;
        }

        console.log('Got  type: ' + type);
        console.log('Got data: ' + JSON.stringify(data));
        console.log('Got data: ' + data);
        console.log('Got id: ' + id);
    },
    clearEvent: function (component) {
        var modal = component.find('modal');
        var modalShade = component.find('modal-shade');

        $A.util.removeClass(modal, 'slds-fade-in-open');
        $A.util.removeClass(modalShade, 'slds-backdrop_open');
        
        component.set('v.dataEvent', null);
        component.set('v.dataModalLookup', '');
        component.set('v.dataModalTextArea', '');

    },
    openModal: function (component) {
        var modal = component.find('modal');
        var modalShade = component.find('modal-shade');

        $A.util.addClass(modal, 'slds-fade-in-open');
        $A.util.addClass(modalShade, 'slds-backdrop_open');
    },
    setupModal: function (component, header, type, action) {
        component.set('v.isLookup', (type === 'lookup'));
        component.set('v.dataModal', {
            'header': header,
            'action': action
        });
    },
    doApprove: function (component, id, data) {
        var action = component.get('c.approve');
        var self = this;

        action.setParams({
            'itemToApprove': id,
            'comment': data
        });

        action.setCallback(self, function (result) {
            if (component.isValid()) {
                var toastEvent = $A.get('e.force:showToast');

                toastEvent.setParams({
                    'title': ((result.success) ? 'Success!' : 'Error!'),
                    'message': result.message,
                    'type': ((result.success) ? 'success' : 'error'),
                    'key': ((result.success) ? 'success' : 'error')
                });

                toastEvent.fire();

                self.refreshData(component);
            }
        });

        $A.enqueueAction(action);
    },
    doReject: function (component, id, data) {
        var action = component.get('c.reject');
        var self = this;

        action.setParams({
            'itemToReject': id,
            'comment': data
        });

        action.setCallback(self, function (result) {
            if (component.isValid()) {
                var toastEvent = $A.get('e.force:showToast');

                toastEvent.setParams({
                    'title': ((result.success) ? 'Success!' : 'Error!'),
                    'message': result.message,
                    'type': ((result.success) ? 'success' : 'error'),
                    'key': ((result.success) ? 'success' : 'error')
                });

                toastEvent.fire();

                self.refreshData(component);
            }
        });

        $A.enqueueAction(action);
    },
	    doReassign: function (component, id, data) {
        var action = component.get('c.reassign');
        var self = this;
				
            action.setParams({
            'itemToReassign': id,
            'userToReassign': data
        });
           

        action.setCallback(self, function (result) {
            if (component.isValid()) {
                var toastEvent = $A.get('e.force:showToast');

                toastEvent.setParams({
                    'title': ((result.success) ? 'Success!' : 'Error!'),
                    'message': result.message,
                    'type': ((result.success) ? 'success' : 'error'),
                    'key': ((result.success) ? 'success' : 'error')
                });

                toastEvent.fire();

                self.refreshData(component);
            }
        });

        $A.enqueueAction(action);
					
    },
    refreshData: function (component) {
        component.set('v.isLoading', true);

        var getData = component.get('c.getData');
        var self = this;

        getData.setCallback(self, function (result) {
            if (component.isValid()) {
                component.set('v.data', result.getReturnValue());
                component.set('v.isLoading', false);
            }
        });

        $A.enqueueAction(getData);
    }
});