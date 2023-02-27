({
    calcAndShowUnderOverBudget: function (component, totalPipeline, totalRevenue, totalBudget) {
        var helper = this;

        totalPipeline = totalPipeline ? +totalPipeline : 0;
        totalRevenue = totalRevenue ? +totalRevenue : 0;
        totalBudget = totalBudget ? +totalBudget : 0;

        component.set("v.totalPipeline", helper.amountFormatter(totalPipeline, 2));
        
        var revenueBudgetGap = totalRevenue - totalBudget;
        var revenueBudgetGapDesc;

        if (revenueBudgetGap < 0) {
            revenueBudgetGapDesc = "Deficit";
            revenueBudgetGap = revenueBudgetGap * -1;
        } else { 
            revenueBudgetGapDesc = "Surplus"; 
        }

        component.set("v.revenueBudgetGap", helper.amountFormatter(revenueBudgetGap, 2));
        component.set("v.revenueBudgetGapDesc", revenueBudgetGapDesc);

        //Set percentageOverUnderBudget to zero if totalBudget is zero because you cant divide by zero
        var percentageOverUnderBudget = totalBudget == 0 ? 0 : (((totalPipeline + totalRevenue) - totalBudget) / totalBudget) * 100;
        var percentageOverUnderBudgetFormatted = helper.percentageFormatter(percentageOverUnderBudget);

        if (percentageOverUnderBudget >= 0) {
            component.set("v.percentageOverUnderBudget", "+" + percentageOverUnderBudgetFormatted);
            $A.util.addClass(component.find("percentage_over_under_budget"), "green");
        } else {
            component.set("v.percentageOverUnderBudget", "-" + percentageOverUnderBudgetFormatted);
            $A.util.addClass(component.find("percentage_over_under_budget"), "red");
        }

    }
})