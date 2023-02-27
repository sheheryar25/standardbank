({ 
    getPosts : function(component){
        var action = component.get("c.getPosts");
        var userId = $A.get("$SObjectType.CurrentUser.Id");
        action.setParams({
            "userID": userId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(state);
            if (state === "SUCCESS") {
                var comments = [];
                for(let index in response.getReturnValue()) {
                    let product = response.getReturnValue()[index];
                    comments.push(product);  
                }
                for (var i = 0; i < comments.length; i++) {
                    if(comments[i].LastEditDate != '' && comments[i].LastEditDate != null){
                        if(comments[i].CreatedDate >= comments[i].LastEditDate){
                            component.set("v.lastModDate", comments[i].CreatedDate);
                        }else{
                            component.set("v.lastModDate", comments[i].LastEditDate);
                        }
                    }else{
                        component.set("v.lastModDate", comments[i].CreatedDate);
                    }
                }
                var commentCount = 0;
                var likeCount = 0;
                
                for (var i = 0; i < comments.length; i++) {
                    if(comments[i].CommentCount != null || comments[i].CommentCount != ''){
                        commentCount = commentCount + comments[i].CommentCount;
                    }
                    
                }
                commentCount = commentCount + comments.length;
                for (var i = 0; i < comments.length; i++) {
                    if(comments[i].LikeCount != null || comments[i].LikeCount != ''){
                        likeCount = likeCount + comments[i].LikeCount;
                    }
                }
                component.set("v.likes",likeCount);
                component.set("v.Comments",commentCount);
                
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                                    errors[0].message);
                        console.log('Error', errors[0]);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
})