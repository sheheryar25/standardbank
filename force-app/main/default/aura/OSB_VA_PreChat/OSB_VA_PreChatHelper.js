({
    startChat: function(component, event, helper) {
        var fields = [{
                label: 'FirstName',
                name: 'FirstName',
                value: component.get('v.firstName')
            },
            {
                label: 'LastName',
                name: 'LastName',
                value: component.get('v.lastName')
            },
            {
                label: 'Email',
                name: 'Email',
                value: component.get('v.email')
            }
        ];
        if (component.find('prechatAPI').validateFields(fields).valid) {
            let event = new CustomEvent(
                'setExtraPreChatFormFields',
                {
                    detail: {
                        callback: component.find('prechatAPI').startChat.bind(this, fields),
                        userEmail: component.get('v.email'),
                        userId: component.get('v.userId'),
                        contactId: component.get('v.contactId'),
                        token: component.get('v.token')
                    }
                }
            );
            document.dispatchEvent(event);
        } else {
            component.find('prechatAPI').startChat(fields);
        }
    }
})