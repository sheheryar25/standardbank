({
	NBAC_PrintToPDF: function(component, event, helper) {
		
		if(!component.get("v.isDoneRendering")){
			component.set("v.isDoneRendering", true);
			
			var recId = component.get("v.recordId");
			window.open('/apex/NBAC_PDF_attach?id=' + recId);
			
			var closeActionPanel = $A.get("e.force:closeQuickAction");
			closeActionPanel.fire();
	    }
	    /*var btnClicked = event.getSource();
        var recId = component.get("v.recordId");

        alert("PDF has been attached to Notes and Attachments");
		window.open('https://standardbank--sprint2017--c.cs88.visual.force.com/apex/NBAC_PDF_attach?id=' + recId);*/
        //window.open('https://standardbank--sprint2017--c.cs88.visual.force.com/apex/NBAC_PDF?id=' + recId);
    }
})