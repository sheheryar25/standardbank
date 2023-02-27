/**
 * Created by Mykhailo Reznyk on 22.11.2019.
 */
({
     doInit: function (component, event, helper) {
           helper.getData(component, event);
     },
     goToAccountInformation: function (component, event, helper) {
         var navService = component.find("navService");
         var pageReference = {
             type: 'standard__recordPage',
             attributes: {
                 actionName: 'view',
                 objectApiName: 'Account_Information__c',
                 recordId: event.currentTarget.dataset.value
             }
         };
         navService.navigate(pageReference);
     },
     doSlide: function (component, event, helper) {

           // Grid and chevrons
           var grid = component.find("thisComponentGrid").getElement();
           var chevronright = component.find("chevronrightId");
           var chevronleft = component.find("chevronleftId");
           var chevron = event.getSource();
           var chevronId = chevron.getLocalId();

           // Translate_Degree and Number_of_Accounts
           var translateDegree = component.get("v.translateDegree");
           var numberOfClientAccounts = component.get("v.numberOfClientAccounts");

           // Before, Current, After pages and Max_number_of_pages
           var pageBeforeSlide = translateDegree/100;
           var currentPage = 0;
           var pageAfterSlide = 0;
           var maxNumberOfPages = Math.ceil(numberOfClientAccounts/3);

           // Define slide direction
           var nextPage = 0;
           if(chevronId == "chevronrightId"){

               nextPage = 100;
               currentPage = pageBeforeSlide + 1;
               pageAfterSlide = pageBeforeSlide + 2;

               // Hide and Show
               if(pageAfterSlide == maxNumberOfPages){
                  $A.util.addClass(chevronright, 'hide');
                  $A.util.removeClass(chevronright, 'show');
               }
               if($A.util.hasClass(chevronleft, 'hide') && currentPage != 0){
                  $A.util.addClass(chevronleft, 'show');
                  $A.util.removeClass(chevronleft, 'hide');
               }

           }
           if(chevronId == "chevronleftId"){

                nextPage = -100;
                currentPage = pageBeforeSlide - 1;
                pageAfterSlide = pageBeforeSlide - 2;

                // Hide and Show
                if(currentPage == 0){
                   $A.util.addClass(chevronleft, 'hide');
                   $A.util.removeClass(chevronleft, 'show');
                }
                if($A.util.hasClass(chevronright, 'hide') && pageAfterSlide != maxNumberOfPages){
                   $A.util.addClass(chevronright, 'show');
                   $A.util.removeClass(chevronright, 'hide');
                }
           }

           // Move the grid
           grid.style.transform = "translateX(-" + (translateDegree+nextPage) + "%)";
           grid.style.transition = "all 1s ease-in-out";

           // Update Translate_Degree
           component.set("v.translateDegree", translateDegree+nextPage);
     }
})