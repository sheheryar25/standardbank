({
    handleUpdateScoringCallback : function(component, response, eventType) {
        var state = response.getState();
        if (state === "SUCCESS") {
            // Set the value received in response to attribute on component
            let product = component.get("v.product");
            if(eventType === "LIKE" && product.userVoteId) {
                product.dislikes--;
                product.userDislikes = false;
            } else if (eventType === "DISLIKE" && product.userVoteId){
                product.likes--;
                product.userLikes = false;
            }
            if(eventType === "LIKE") {
                product.likes++;
                product.userLikes = true;
            } else if(eventType === "DISLIKE") {
                product.dislikes++;
                product.userDislikes = true;
            }
            product.userVoteId = response.getReturnValue();

            component.set("v.product", product);
        } else if (state === "ERROR") {
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
});