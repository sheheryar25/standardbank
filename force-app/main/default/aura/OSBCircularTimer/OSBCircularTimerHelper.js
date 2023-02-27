({
	doInit : function(component, event, helper)  {
        helper.startTimer(component, event);
	},
    computeProgress : function(component, event, helper, totalVal, actualVal)  {
        if(totalVal && (actualVal || actualVal === 0) && !isNaN(parseInt(totalVal)) && isFinite(totalVal) && !isNaN(parseInt(actualVal)) && isFinite(actualVal)){
            let percVal = parseInt(actualVal) / parseInt(totalVal) ;
            let progressVal = parseInt(  percVal * 360  ) ;
            component.set("v.cirDeg" , progressVal );
            component.set("v.perText" , helper.intToSecondString(actualVal) ); 
        }
    },
    intToSecondString : function(seconds) {
        let formattedMinutes = parseInt(seconds / 60);
        let formattedSeconds = String(seconds - formattedMinutes * 60);
        if (formattedSeconds.length < 2){
            formattedSeconds = "0" + formattedSeconds;
        }
        return formattedMinutes + ":" + formattedSeconds;
    },
    startTimer : function(component, event) {
        let helper = this;
        clearInterval(parseInt(component.get("v.intervalId")));
        let totalVal = component.get("v.totalProgress");
        let actualVal = component.get("v.totalProgress"); 
        helper.computeProgress(component, event, helper, totalVal, actualVal);
        let intervalId = window.setInterval(function(){
            actualVal--;
            helper.computeProgress(component, event, helper, totalVal, actualVal);
            if(actualVal === 0){
                let timerEvent = $A.get("e.c:OSBTimerEvent");
                timerEvent.setParams({
                    "isQrCode" : component.get("v.qrCodePage"),
                    "timerState" : "FIN"
                });
                timerEvent.fire();

                clearInterval(intervalId);
            }
        }, 1000);
        component.set("v.intervalId", intervalId);
    }

})