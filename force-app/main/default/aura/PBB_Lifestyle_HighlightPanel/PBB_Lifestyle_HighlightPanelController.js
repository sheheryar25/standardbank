({
	doInit : function(component, event, helper){
		helper.fetchDebtRev(component);
		helper.fetchKycStatus(component);
	}
        
})