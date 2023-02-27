({
    percentageChange: function (originalValue, newValue) {
        var percentageObject =
            {
                differencePercent: 0,
                colourClass: 'yellow',
                arrowCode: '',
                changeDirection: 'nochange'
            };

        var difference = 0;
        if (newValue > originalValue) {
            difference = newValue - originalValue;
            percentageObject.colourClass = 'green';
            percentageObject.arrowCode = '&#x2191';
            percentageObject.changeDirection = 'increase';
        }
        else if (newValue < originalValue) {
            difference = originalValue - newValue;
            percentageObject.colourClass = 'red';
            percentageObject.arrowCode = '&#x2193';
            percentageObject.changeDirection = 'decrease';
        }

        if (originalValue != 0)
            percentageObject.differencePercent = (newValue - originalValue) == 0 ? 0 : (difference / originalValue) * 100;
        else
            percentageObject = null;

        return percentageObject;
    },
    percentageFormatter: function (amount, decimals) {
        if (!decimals)
            decimals = 0;

        if (amount === undefined || amount.toString().includes("Infinity") || amount.toString().includes("N/A"))
            return "N/A";
        if (amount < 0)
            amount = amount * -1;
        return (+amount).toFixed(decimals) + "%";
    },
    serviceResponseCallback: function (response, callback) {
        if (response.getState() != "SUCCESS") {
            var err = response.getError()[0];
            if (err) {
                console.log(err.message);
                callback("Error");
            }
        }
        else {
            var respObject = response.getReturnValue();

            if (respObject.IsSuccess)
                callback(null, respObject.Data);
            else {
                console.log(respObject.Message);
                callback(respObject.Message);
            }
        }
    },
    dateFormatter: function (date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return (day < 10 ? "0" : "") + day + "/" + (month < 10 ? "0" : "") + month + "/" + year;
    },
    dateParser: function (dateString) {
        var dateParts = dateString.split(/[^0-9]/);

        //Check if year is first i.e YYYY/MM/DD
        if (dateParts[0].length == 4) {
            if (dateParts[3] && dateParts[4] && dateParts[5])
                return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4], dateParts[5]);
            else
                return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        } else {// Else DD/MM/YYYY
            if (dateParts[3] && dateParts[4] && dateParts[5])
                return new Date(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4], dateParts[5]);
            else
                return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        }
    },
    amountFormatter: function (amount, decimals) {
        if (!decimals)
            decimals = 0;

        if (Math.abs(amount) < 1000) {
            return parseFloat((amount / 1).toFixed(decimals));
        } else if (Math.abs(amount) < 1000000) {
            return parseFloat((amount / 1000).toFixed(decimals)) + "k";
        } else if (Math.abs(amount) < 1000000000) {
            return parseFloat((amount / 1000000).toFixed(decimals)) + "m";
        } else if (Math.abs(amount) < 1000000000000) {
            return parseFloat((amount / 1000000000).toFixed(decimals)) + "b";
        }
    },

    amountFormatterThousands: function (amount) {
        var parts = ('' + (amount < 0 ? -amount : amount)).split("."), s = parts[0], i = L = s.length, o = '', c;
        while (i--) {
            o = (i == 0 ? '' : ((L - i) % 3 ? '' : ' '))
                + s.charAt(i) + o
        }
        return (amount < 0 ? '-' : '') + o + (parts[1] ? '.' + parts[1] : '');
    },

    amountFormatterDecimals: function (amount, decimals) {
        if (!decimals)
            decimals = 2;

        return (Math.round(amount * 100) / 100).toFixed(decimals);
    },

    toggleSection: function (component, event) {
        var sectionIdToToggle = event.currentTarget.dataset.section
        $A.util.toggleClass(component.find(sectionIdToToggle), "slds-hide");
    },

    getMonthName: function (monthNumber) {
        monthNumber = monthNumber - 1;
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNumber];
    },

    truncate: function (value, maxLength) {
        if (value && value.length > maxLength)
            return value.substring(0, Math.min(maxLength, value.length)) + "...";
        else return value;
    },

    setHeading: function (component, heading) {
        var cmpEvent = component.getEvent("setHeadingEvent");
        cmpEvent.setParams({ data: heading });
        cmpEvent.fire();
    },

    navToComponent: function (component, cmpName, cmpData) {
        var appEvent = $A.get("e.c:CI_EvtNavigateToComponent");
        appEvent.setParams({ cmpName: cmpName, cmpData: cmpData });
        appEvent.fire();
    },
    forceNavigateToComponent : function(cmpName, cmpData) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:" + cmpName,
            componentAttributes: cmpData
        });
        evt.fire();
    },
    showToast : function (message,title,type,mode,duration) {
        var toastEvent = $A.get("e.force:showToast");
        if(!toastEvent){return;}
        if(title){toastEvent.setParam('title',title);}
        if(mode){toastEvent.setParam('mode',mode);}
        if(message){toastEvent.setParam('message',message);}
        if(type){toastEvent.setParam('type',type);}
        if(duration){toastEvent.setParam('duration',duration);}
        toastEvent.fire();
    },
    simpleSort: function(arrToSort, propName, desc) {
        return arrToSort.sort((a, b) => {
            if (desc)
                return a[propName] > b[propName] ? -1 : a[propName] < b[propName] ? 1 : 0;
            else
                return a[propName] > b[propName] ? 1 : a[propName] < b[propName] ? -1 : 0;
        });
    }
})