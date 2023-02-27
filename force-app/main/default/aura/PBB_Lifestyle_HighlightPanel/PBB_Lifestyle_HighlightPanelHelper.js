({
    fetchDebtRev: function (cmp) {
        var action = cmp.get("c.getDebtReview");
        action.setParams({
            clientId: cmp.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set('v.debtReview', response.getReturnValue());
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
					cmp.set('v.errorDebtReview', 'Data unavailable');
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
	fetchKycStatus :  function (cmp) {
        var action = cmp.get("c.getKycStatus");
        action.setParams({
            clientId: cmp.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set('v.kycStatus', response.getReturnValue());
            } else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
					cmp.set('v.errorKycStatus', 'Data unavailable');

                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    }
})