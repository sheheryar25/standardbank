({
    processResponse: function (component, revBudgetData) {
        var helper = this;
        var totalRevenue = revBudgetData.Revenue;
        var totalBudget = revBudgetData.Budget;

        var totalRevenueFormatted = (typeof totalRevenue == 'undefined' || totalRevenue == null ) ?  "None" : helper.amountFormatter(totalRevenue, 2);
        component.set("v.totalRevenue", totalRevenueFormatted);

        var totalBudgetFormatted = (typeof totalBudget == 'undefined' || totalBudget == null ) ?  "None" : helper.amountFormatter(totalBudget, 2);
        component.set("v.totalBudget", totalBudgetFormatted);

        //Calc percent difference
        if (totalRevenue > 0 && totalBudget > 0) {
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
    }
})