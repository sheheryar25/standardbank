window.utilities = (function () {

    return { //public API        
        amountFormatter: function (amount, decimals = 0) {
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

        amountFormatterDecimals: function (amount, decimals = 2) {
            return (Math.round(amount * 100) / 100).toFixed(decimals);
        },

        percentageFormatter: function (amount, deciamls = 0) {
            if (amount.toString().includes("Infinity") || amount.toString().includes("N/A"))
                return "N/A";
            if (amount < 0)
                amount = amount * -1;
            return (+amount).toFixed(deciamls) + "%";
        },

        dateFormatter: function (date) {
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            return (day < 10 ? "0" : "") + day + "/" + (month < 10 ? "0" : "") + month + "/" + year;
        },

        divisionFormatter: function (divisionName) {
            var divisionFormat = divisionName.toLowerCase();

            switch (divisionFormat) {
                case "investment banking":
                    return { Name: "IB", ColourClass: "IB" };
                case "transactional products and services":
                case "t.p.s.":
                    return { Name: "TPS", ColourClass: "TPS" };
                case "global markets":
                    return { Name: "GM", ColourClass: "GM" };
                case "real estate":
                    return { Name: divisionName, ColourClass: "RealEstate" };
                case "personal and business banking":
                    return { Name: "PBB", ColourClass: "PBB" };
                case "card and payment solutions":
                    return { Name: "POS", ColourClass: "POS" };
                case "instalment sale and finance leases":
                    return { Name: "VAF", ColourClass: "VAF" };
                default:
                    return { Name: divisionName, ColourClass: divisionName };
            }
        },
        csiDescriptionColour: function (text) {
            var csi = '';
            if (text == 'Not Rated') {
                csi = 'yellow';
            }
            else if (parseInt(text) < 7) {
                csi = 'red';
            }
            else if (parseInt(text) < 8) {
                csi = 'yellow';
            }
            else {
                csi = 'green';
            }

            return csi;
        },

        csiRatingFormatter: function (text) {
            var csi = '';
            if (text == 'Not Rated' || text == 'No CSI') {
                csi = text;
            } else {
                csi = text + ' / 10 CSI'
            }


            return csi;
        },

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

            if (originalValue != 0 && newValue != 0)
                percentageObject.differencePercent = (newValue - originalValue) == 0 ? 0 : (difference / originalValue) * 100;
            else
                percentageObject = null;

            return percentageObject;
        },

        getMonthName: function (monthNumber) {
            monthNumber = monthNumber - 1;
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months[monthNumber];
        },

        createCmp: function (component, cmpName, cmpData, auraId) {
            $A.createComponent(
                cmpName,
                cmpData,
                function (cmp) {
                    var cmpContainer = component.find(auraId);
                    cmpContainer.set("v.body", cmp);
                }
            );
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
        }
    };
}());

window.ciFilter = (function () {

    var filterObject = { clientId: null }; // private

    return { //public API

        setClientId: function (clientId) {
            filterObject.clientId = clientId;
        },

        setFilter: function (filter) {
            filterObject = filter;
        },

        getFilter: function () {
            return filterObject;
        }

    };

}());

window.ciServiceResponseCallback = function (response, callback) {
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
};