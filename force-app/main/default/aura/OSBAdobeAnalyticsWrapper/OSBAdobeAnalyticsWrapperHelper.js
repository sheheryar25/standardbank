({
    sendToVF: function(component, pageData) {
        // Prepare message in the format required in VF page
        var dtm_deviceCheck = /Mobile/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
        let pageInfo = pageData.pageDetails;
        var dataLayer = {
            'deviceType' : dtm_deviceCheck,
            'loginStatus' : pageData.loginStatus,
            'userRegistrationSuccess' : pageData.registrationSuccess,
            'userLoginSuccess' : pageData.loginSuccess,
            'pageName' : pageInfo.Page_Name__c,
            'pageCategory' : pageInfo.Page_Category__c,
            'pageSubSection1' : pageInfo.Sub_Section_1__c ? pageInfo.Sub_Section_1__c : '',
            'pageSubSection2' : pageInfo.Sub_Section_2__c ? pageInfo.Sub_Section_2__c : '',
            'pageSubSection3' : pageInfo.Sub_Section_3__c ? pageInfo.Sub_Section_3__c : '',
            'pageSubSection4' : pageInfo.Sub_Section_4__c ? pageInfo.Sub_Section_4__c : '',
            'pageSubSection5' : pageInfo.Sub_Section_5__c ? pageInfo.Sub_Section_5__c : '',
            'domainName' : window.location.host,
            'pageUrl' : window.location.href,
            'siteCountry' : 'South Africa',
            'siteLanguage' : 'English'
        }
        // Send message to VF
        this.sendMessage(component, dataLayer, true);

    },

    sendQueuedMessages: function(component) {
        // Retrieve queued messages
        var queuedMessages = component.get('v.messageQueue');
        if(typeof queuedMessages !== 'undefined'){
            //Send all queued messages
            for(var i=0; i < queuedMessages.length; i++){
                // Send message to VF
                this.sendMessage(component, queuedMessages[i], false);
            }
            this._resetMessageQueue(component);
        }

    },

    sendMessage: function(component, message, addToQueueIfNotSent) {
        // Send message to VFd
        message = JSON.parse(JSON.stringify(message));
        var tag = component.find("vfFrame");
        var iFrameLoaded = component.get('v.iFrameLoaded');
        if(tag.getElement() && iFrameLoaded){
            var vfWindow = tag.getElement().contentWindow;
            vfWindow.postMessage(message, 'https://' + window.location.hostname);
        } else if(!iFrameLoaded && addToQueueIfNotSent){
            //Add the message to the queue
            if(typeof component.get('v.messageQueue') === 'undefined') {
                this._resetMessageQueue(component);
            }

            var messageQueue = component.get('v.messageQueue');
            messageQueue.push(message);
            component.set('v.messageQueue', messageQueue);
        }
    },

    _resetMessageQueue: function(component) {
        var initialMessageQueue = [];
        component.set('v.messageQueue', initialMessageQueue);
        var objarray = component.get('v.messageQueue');
    },

    addProductName: function(dataLayer, productName) {
        dataLayer.Page_Name__c += ' | ' + productName;
        // go over all page sub sections and fill in first empty value
        for(let i = 2; i <= 5; i++) {
            if(!dataLayer['Sub_Section_' + i + '__c']) {
                dataLayer['Sub_Section_' + i + '__c'] = dataLayer.Page_Name__c;
                return;
            }
        }
    }
});