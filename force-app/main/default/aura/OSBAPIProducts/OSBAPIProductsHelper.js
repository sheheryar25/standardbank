({
    openProduct: function(component, event, helper) {
        let navService = component.find("navService");
        let pageReference = {
            type: "comm__namedPage",
            attributes: {
                name: "API_Products_OPTL__c"
            }
        };
        
        navService.navigate(pageReference);
   },
   searchAPIProducts: function(component, event, helper) {
       let action = component.get("c.getApiProductsSearchResults");
       let searchKeyword = component.get("v.searchKeyword");
       action.setParams({
           "searchKeyword" : searchKeyword,
       });
       action.setCallback(this, function(response) {
           let state = response.getState();
           if (state === "SUCCESS") {
               if(component.get("v.tile")===true) {
                   let allProducts = response.getReturnValue();
                   component.set("v.ourApiProducts", allProducts);
               } else {
                   let availableProducts = [];
                   let comingSoonProducts = [];
                   let apiProducts = response.getReturnValue(); 
                   if(apiProducts.length === 0) {
                       component.set("v.noSearchResults", true);
                   }else{
                       component.set("v.noSearchResults", false);
                   }
                   for(let index in response.getReturnValue()) {
                       let product = response.getReturnValue()[index];
                       if(product.Is_coming_soon__c) {
                           comingSoonProducts.push(product);
                       } else {
                           availableProducts.push(product);
                       }
                   }
                   component.set("v.comingSoonProducts", comingSoonProducts);
                   component.set("v.ourApiProducts", availableProducts);
               }
           }
       });
       $A.enqueueAction(action);
   }
})