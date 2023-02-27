({
	updateNotificationCallback : function(response) {
		var state = response.getState();
        if (state === "SUCCESS") {
            if(response) {
                console.log(response);
            } else {
                console.log("Update successful");
            }
        }
        else if (state === "ERROR") {
            var errors = response.getError();
            if (errors) {
                if (errors[0] && errors[0].message) {
                    console.log("Error message: " +
                             errors[0].message);
                }
            } else {
                console.log("Unknown error");
            }
        }
	}
})