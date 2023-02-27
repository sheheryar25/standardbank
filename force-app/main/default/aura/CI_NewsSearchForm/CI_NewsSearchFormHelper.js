({
    handleParamsChange: function(component, event, helper) {
        let paramsJSON = this.buildParamsJson(component);
        let paramsEvent = component.getEvent('CI_NewsSearchParamsChanged');
        paramsEvent.setParams({
            "Params": paramsJSON,
        })
        paramsEvent.fire();
    },
    handleUserCountry: function(component, user, helper) {
        if(user) {
            helper.defaultRegion(component, user.Country, helper);
        }
    },

    handleAccountCountry: function(component, account, helper) {
        if(account) {
            helper.defaultRegion(component, account.Country_Risk__c, helper);
        }
    },
    buildParamsJson: function(component) {
        let params = {};
        component.get('v.SearchParams').forEach(function(param) {
            switch  (component.find(param).get('v.type')) {
                case 'toggle':
                    params[param] = component.find(param).get('v.checked');
                    break;
                default:
                    params[param] = component.find(param).get('v.value');
            }
        });
        return params;
    },
    getCurrentUser: function(component, event, helper) {
        let action = component.get('c.getUser');
        action.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
                this.handleUserCountry(component, response.getReturnValue(), helper);
            } else if(state === 'ERROR'){
                console.log('Error during downloading user\'s data');
            }
        });
        $A.enqueueAction(action);
    },
    handleMyPortfolioChange: function(component, event, helper) {
        let checkCmp = component.find("isMyPortfolio").get("v.value");
        let paramsEvent = component.getEvent('CI_NewsPortfolioChanged');
        paramsEvent.setParams({
                    "isMyPortfolio": checkCmp,
                })
        paramsEvent.fire();
    },
    getCurrentAccount: function(component, event, helper) {
        let recordId = component.get("v.recordId");
        let action = component.get('c.getAccount');
        action.setParam("accountId", recordId);
        action.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS' || state === 'DRAFT') {
                this.handleAccountCountry(component, response.getReturnValue(), helper);
            } else if(state === 'ERROR'){
                console.log('Error during downloading account\'s data');
            }
        });
        $A.enqueueAction(action);
    },

    fetchDepValues: function(component, ListOfDependentFields) {
        var dependentFields = [];
        dependentFields.push({'label':'--None--', 'value': '--None--'});
        for (var i = 0; i < ListOfDependentFields.length; i++) {
            dependentFields.push({'label':ListOfDependentFields[i], 'value': ListOfDependentFields[i]});
        }
        component.set("v.countriesList", dependentFields);
    },

    doApply: function(component, event, helper) {
        helper.handleParamsChange(component, event, helper);
        if (component.get('v.isMyPortfolioChanged')) {
            helper.handleMyPortfolioChange(component, event, helper);
            component.set('v.isMyPortfolioChanged', false);
        }
        var device = $A.get("$Browser.formFactor");
        if (device != 'DESKTOP') {
            helper.switchFiltersCard(component, event, helper);
        }
    },

   updateCountries: function(component, event, helper) {
       var controllerValueKey = event.getParam("value");
       var region2Countries = component.get("v.region2Countries");
       if (controllerValueKey != '--None--') {
           var ListOfDependentFields = region2Countries[controllerValueKey];

           if(ListOfDependentFields.length > 0){
               component.set("v.disabledCountries" , false);
               helper.fetchDepValues(component, ListOfDependentFields);
           }else{
               component.set("v.disabledCountries" , true);
               component.set("v.countriesList", [{'label':'--None--', 'value': '--None--'}]);
           }

       } else {
           component.set("v.countriesList", [{'label':'--None--', 'value': '--None--'}]);
           component.set("v.regionCountry", "--None--");
           component.set("v.disabledCountries" , true);
       }
   },

   defaultRegion: function(component, region, helper) {
       let action = component.get('c.getRegions');
       action.setCallback(this, function(response) {
           let state = response.getState();
           if (state === 'SUCCESS' || state === 'DRAFT') {
               var StoreResponse = response.getReturnValue();
               component.set("v.region2Countries",StoreResponse);
               var listOfkeys = [];
               var ControllerField = [];
               var selectedRegion;

               for (var singlekey in StoreResponse) {
                   listOfkeys.push(singlekey);
               }
               if (listOfkeys != undefined && listOfkeys.length > 0) {
                   ControllerField.push({'label':'--None--', 'value': '--None--'});
               }

               for (var i = 0; i < listOfkeys.length; i++) {
                   if (StoreResponse[listOfkeys[i]].includes(region)) {
                       selectedRegion = listOfkeys[i];
                       component.set("v.region", 'Africa');
                   } else {
                       selectedRegion = '--None--';
                      component.set("v.region", '--None--');
                   }
                   ControllerField.push({'label': listOfkeys[i], 'value' : listOfkeys[i]});
               }
               component.set("v.regionsList", ControllerField);


               var countries = [];
               var selectedCountry = '--None--';
               countries.push({'label':'--None--', 'value': '--None--'});

               if (selectedRegion != '--None--') {
                   var listOfCountries = StoreResponse[selectedRegion];
                   for (var i = 0; i < listOfCountries.length; i++) {
                       if (listOfCountries[i] == region) {
                           selectedCountry = region;
                       }
                       countries.push({'label':listOfCountries[i], 'value': listOfCountries[i], 'selected': 'true'});
                   }
               }
               if (selectedCountry == '--None--') {
                   component.set("v.disabledCountries" , true);
               }
               component.set("v.regionCountry", selectedCountry);
               component.set("v.countriesList", countries);

               helper.handleParamsChange(component, event, helper);
           } else {
               console.log('Error during downloading regions data');
           }
       });
       $A.enqueueAction(action);
   },

   switchFiltersCard: function(component, event, helper) {
       let showNewsFilters = component.get('v.showFilters');
       let filterDisplay = component.getEvent('CI_SmartNewsFilterDisplay');
       if (showNewsFilters) {
           var elements = document.getElementsByClassName("NewsSearchForm");
           elements[0].style.display = 'block';
           filterDisplay.setParams({
               "Show": true,
               });
       } else {
           var elements = document.getElementsByClassName("NewsSearchForm");
           elements[0].style.display = 'none';
           filterDisplay.setParams({
               "Show": false,
               });
       }
       component.set('v.showFilters', !component.get('v.showFilters'));
       filterDisplay.fire();
   },

    getClientRecordType: function(component, event, helper) {
        let action = component.get('c.getCommBClientRecordTypeId');
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS' || state === 'DRAFT') {
                var clientCommBRecordTypeId = response.getReturnValue();
                component.set('v.clientCommBRecordTypeId', clientCommBRecordTypeId);
            } else {
                console.log('Error during fetching CommB client recordtype');
            }
        });
        $A.enqueueAction(action);
    }
})