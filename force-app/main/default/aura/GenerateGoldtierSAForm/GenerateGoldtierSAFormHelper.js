/**
 * Created by mjaznicki on 09.07.2018.
 */
({
    generateDocument: function(component, event, toSend){
         var record = component.get('v.recordId');
         var account = component.get('v.account');
         var kycId = account.KYC_Contact__c;
         var products = component.get('v.products');
         var entityType = component.get('v.entityType');
         var singleRevenue = component.get('v.singleRevenue');
         var entityClassification = component.get('v.entityClassification');
         var nature = component.get('v.nature');
         var sourceWealth = component.get('v.sourceWealth');
         var sourceFunds = component.get('v.sourceFunds');
         var anticipatedLevel = component.get('v.anticipatedLevel');
         var natureBusiness = component.get('v.natureBusiness');
         var profClient = component.get('v.profClient');
         var offshore = component.get('v.offshore');
         var services = component.get('v.services');
         var shell = component.get('v.shell');
         var corespondent = component.get('v.corespondent');
         var expectedIncome = component.get('v.expectedIncome');
         var shell = component.get('v.shell');
         console.log(account);
         var parameterList = component.get('v.parameterList');
         var urlToSend = component.get('v.urlParam');
         var urlEvent = $A.get("e.force:navigateToURL");
         var errorString = '';
         if(nature === '') {
             errorString+='Nature of relationship; ';
         }
         if(products === '') {
             errorString+='Services/Products to be expected; ';
         }
         if(!sourceWealth) {
             errorString+='Source of Wealth (including source of income); ';
         }
         if(sourceFunds == null) {
             errorString+='Source of Funds; ';
         }
         if(expectedIncome == null) {
             errorString+='Expected Income; ';
         }
         if(anticipatedLevel == null) {
             errorString+='Anticipated level/volume of activity; ';
         }
         if(shell == '') {
             errorString+='Does the entity provide corresponding bank services, directly or indirectly, to shell banks ?; ';
         }
         if(entityType == '') {
             errorString+='Entity Type; ';
         }
         if(entityClassification == '' && entityType != 'Branch' && entityType != 'Managed Fund') {
             errorString+='Entity Classification; ';
         }
         if(singleRevenue == '') {
             errorString+='Is More than 50% of the Customers revenue generated out of a single Country ?; ';
         }
         if(account.KYC_Contact__c == null) {
             errorString+='KYC Contact; ';
         }
         if(natureBusiness == null) {
             errorString+='Nature of Business; ';
         }
         if(profClient === '') {
             errorString+='Professional Client; ';
         }
         if(offshore === '' && shell === 'Yes') {
             errorString+='Is this an offshore bank that is limited to conducting business with Non-Residents in Non-Local currency ?; ';
         }
         if(services === '' && shell === 'Yes') {
             errorString+='Bank Services;';
         }
         if(corespondent === '' && shell === 'Yes') {
             errorString+='Does the entity provide downstream correspondent clearing ?; ';
         }
         if(errorString != '') {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                     title: 'Required fields are missing',
                     type: 'error',
                     message: 'Please complete required fields: ' + errorString
                });
                toastEvent.fire();
         } else {
             parameterList.forEach(function(parameter) {
                  var urlToSend = component.get('v.urlParam');
                  var valueToGet = 'v.';
                  valueToGet += parameter;
                  var value = component.get(valueToGet);
                  urlToSend +='&';
                  urlToSend +=parameter;
                  urlToSend +='=';
                  urlToSend += value;
                  component.set('v.urlParam', urlToSend);
                  console.log(urlToSend);
             });
                urlEvent.setParams({
                  "url": component.get('v.urlParam') + "&id=" + record + '&toSend=' + toSend + '&kycId=' + kycId
                });
                 urlEvent.fire();
         }
    }


})