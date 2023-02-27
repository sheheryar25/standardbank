({
    processResponse: function (component, revBudgetData) {
        var helper = this;
        var totalRevenue = +revBudgetData.Revenue;
        var totalBudget = +revBudgetData.Budget;


        var totalRevenueFormatted = (typeof totalRevenue == 'undefined' || totalRevenue == null || isNaN(totalRevenue)) ?  0 : helper.amountFormatter(totalRevenue, 2);
        component.set("v.totalRevenue", totalRevenueFormatted);

        var totalBudgetFormatted = (typeof totalBudget == 'undefined' || totalBudget == null || isNaN(totalBudget) ) ?  0 : helper.amountFormatter(totalBudget, 2);

        component.set("v.totalBudget", totalBudgetFormatted);

        //Calc percent difference
        if (totalRevenue >= 0 && totalBudget > 0) {
            var percentDiffObj = helper.percentageChange(totalBudget, totalRevenue);
            if (percentDiffObj) {
                var differencePercent = helper.percentageFormatter(percentDiffObj.differencePercent);

                switch (percentDiffObj.changeDirection) {
                    case "decrease": differencePercent = "-" + differencePercent;
                        break;
                    case "increase": differencePercent = "+" + differencePercent;
                        break;
                }
                $A.util.addClass(component.find("difference_percent"), percentDiffObj.colourClass);
                component.set("v.differencePercent", differencePercent);
            }
        }
        var revenueBudgetGap = totalRevenue - totalBudget;
                var revenueBudgetGapDesc;

                if(revenueBudgetGap < 0){
                    revenueBudgetGapDesc = 'Deficit';
                    revenueBudgetGap = revenueBudgetGap * -1;
                } else if(revenueBudgetGap > 0){
                    revenueBudgetGapDesc = 'Surplus';
                } else {
                    revenueBudgetGap = 0;
                }

                component.set("v.revenueBudgetGap", helper.amountFormatter(revenueBudgetGap, 2));
                component.set("v.revenueBudgetGapDesc", revenueBudgetGapDesc);

    },

    getCustomSettings: function(component){
        var querySettings = component.get("v.querySettings");
        var revenueService = component.find("revenue_service");
        revenueService.getCustomSettings(querySettings, $A.getCallback(function (error, response) {
                if (!error) {
                    component.set("v.redirectComponent", response.redirectComponent);
                    component.set("v.title", response.title);
                }
            }));
        },

})