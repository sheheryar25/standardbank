({
    getCROC: function(component, event, helper) {
        var action = component.get("c.getClientReturnOverCapital");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setStorable();
        action.setCallback(this, function(response) {
            ciServiceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getDeal: function(component, event, helper) {
        var action = component.get("c.getDeals");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId, dealTypes: params.dealTypes });
        action.setStorable();
        action.setCallback(this, function(response) {
            ciServiceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getShare: function(component, event, helper) {
        var action = component.get("c.getShareOfWallet");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setStorable();
        action.setCallback(this, function(response) {
            ciServiceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getClientRevAndBudget: function(component, event, helper) {
        var action = component.get("c.getClientRevenueVsBudgetGap");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setStorable();
        //action.setBackground(true) forces call to be a sperate apex transaction thereby hopefully not hitting transaction limits
        action.setBackground(true);
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getRevByDivision: function(component, event, helper) {
        var action = component.get("c.getRevenueByDivision");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setStorable();
        action.setBackground(true);
        action.setCallback(this, function(response) {
            ciServiceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getBudByDivisionCountry: function(component, event, helper) {
        var action = component.get("c.getBudgetByDivisionCountry");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setStorable();
        action.setBackground(true);
        action.setCallback(this, function(response) {
            ciServiceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getRevByDivnCountryProduct: function(component, event, helper) {
        var action = component.get("c.getRevenueByDivisionCountryProduct");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setStorable();
        action.setBackground(true);
        action.setCallback(this, function(response) {
            ciServiceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getCalcROE: function(component, event, helper) {
        var action = component.get("c.getCalculatedRoe");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId, year: params.year, doAnnualise: params.doAnnualise });
        action.setStorable();
        action.setCallback(this, function(response) {
            ciServiceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getCalcCROC: function(component, event, helper) {
        var action = component.get("c.getCalculatedCroc");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId, year: params.year, doAnnualise: params.doAnnualise });
        action.setStorable();
        action.setCallback(this, function(response) {
            ciServiceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getCapitalDetailed: function(component, event, helper) {
        var action = component.get("c.getClientCapitalDetailed");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setStorable();
        action.setCallback(this, function(response) {
            ciServiceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getRevenueByDivisionProd: function(component, event, helper) {
        var action = component.get("c.getRevenueByDivisionProduct");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setStorable();
        action.setBackground(true);
        action.setCallback(this, function(response) {
            ciServiceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getRevBudgetDate: function(component, event, helper) {
        var action = component.get("c.getRevenueBudgetSnapshotDate");
        var params = event.getParam("arguments");

        action.setStorable();
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getPortfolioRevenueAndBudget: function(component, event, helper) {
        var action = component.get("c.getPortfolioRevenueVsBudgetGap");
        var params = event.getParam("arguments");

        action.setStorable();
        action.setBackground(true);
        action.setParams({querySettings : params.querySettings});
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getPortfolioRevenue: function(component, event, helper) {
        var action = component.get("c.getPortfolioRevenueYoY");
        var params = event.getParam("arguments");

        action.setParams({ startYear: params.startYear, numYearsBack: params.numYearsBack, toMonth: params.toMonth });
        action.setStorable();
        action.setBackground(true);
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getPortfolioClientReturnOverCapital: function(component, event, helper) {
        var action = component.get("c.getPortfolioCROC");
        var params = event.getParam("arguments");

        action.setStorable();
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },
    getRevenueByClientByDivision: function (component, event, helper) {
        var action = component.get("c.getRevenueClientByDivision");
        var params = event.getParam("arguments");
        action.setParams({ clientId: params.clientId });
        action.setStorable();
        action.setBackground(true);
        action.setCallback(this, function (response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getPortfolioReturnOnEquity: function(component, event, helper) {
        var action = component.get("c.getPortfolioROE");
        var params = event.getParam("arguments");

        action.setStorable();
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },
    
    getClientClientReturnOverCapital: function(component, event, helper) {
        var action = component.get("c.getClientCROC");
        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setStorable();
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getClientReturnOnEquity: function(component, event, helper) {
        var action = component.get("c.getClientROE");

        var params = event.getParam("arguments");

        action.setParams({ clientId: params.clientId });
        action.setStorable();
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getPortfolioMonthlyRevVariance: function(component, event, helper) {
        var action = component.get("c.getPortfolioMonthlyRevenueVariance");
        var params = event.getParam("arguments");

        action.setStorable();
        action.setBackground(true);
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getPortfolioVariance: function(component, event, helper) {
        var action = component.get("c.getPortfolioVarianceAction");
        var params = event.getParam("arguments");

        action.setStorable();
        action.setBackground(true);
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getPortfolioCYPipeline: function(component, event, helper) {
        var action = component.get("c.getPortfolioCYPipelineAction");
        var params = event.getParam("arguments");

        action.setStorable();
        action.setParams({ clientId: params.clientId ,
                           querySettings: params.querySettings});
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getUserIsoCode: function(component, event, helper) {
        var action = component.get("c.getUserIsoCodeAction");
        var params = event.getParam("arguments");

        action.setStorable();
        action.setCallback(this, function(response) {
            helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

    getCustomSettings: function(component, event, helper){
        var action = component.get("c.getCustomSettingsAction");
        var params = event.getParam("arguments");

        action.setStorable();
        action.setParams({
            querySettings : params.querySettings
        });
        action.setCallback(this, function(response) {
             helper.serviceResponseCallback(response, params.callback);
        });
        $A.enqueueAction(action);
    },

})