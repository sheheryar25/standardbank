({
    getProducts : function(component) {
        var action = component.get("c.getProductsAndVotes");
        // Create a callback that is executed after
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Set the value received in response to attribute on component
                this.handleGetProductsAndVotes(component, response);
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
        });
        // $A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
    },

    handleGetProductsAndVotes : function(component, response) {
        var availableSolutions = [];
        var availableApis = [];
        var comingSoonSolutions = [];
        var comingSoonApis = [];
        var productIds = [];
        var products = response.getReturnValue().products;
        var userId = response.getReturnValue().userId;
        var article2Activities = response.getReturnValue().articlesWithActivities;

        for(let index in products) {
            let product = products[index];
            if(product.RecordType.DeveloperName == 'Community_Content_Solution') {
                if(product.Is_coming_soon__c) {
                    comingSoonSolutions.push(product);
                } else {
                    availableSolutions.push(product);
                }
            } else {
                if(product.Is_coming_soon__c) {
                    comingSoonApis.push(product);
                } else {
                    availableApis.push(product);
                }
            }
            this.setScoring(product, article2Activities, userId);
            this.setComments(product, article2Activities, userId);
        }
        component.set("v.products", products);
        this.setMockPages(availableSolutions);
        component.set("v.solutionsComingSoon", comingSoonSolutions);
        component.set("v.apisComingSoon", comingSoonApis);
        component.set("v.solutions", availableSolutions);
        component.set("v.apis", availableApis);
        component.set("v.productsLoaded", true);
    },

    setMockPages : function(solutions) {
        solutions = solutions.map(el => {
            let link = '/s/mock-page?name=' + el.URL__c;
            link = link + 'Landing';
            el.URL__c = link;
            return el;
        });
    },

    highlightTab : function(component, selectedTab) {
        var elements = component.find("productsTab");
        elements.forEach(function(element) {
            if(element.getElement().dataset.tabName == selectedTab) {
               $A.util.addClass(element.getElement(), "marketgram__tab-selected");
            } else {
               $A.util.removeClass(element.getElement(), "marketgram__tab-selected");
            }
        });
    },

    getProduct : function(component, productId) {
        let products = component.get("v.products");
        let highlightedProduct = null
        products.forEach(function(product) {
            if(product.Id == productId) {
                highlightedProduct = product;
            }
        });
        return highlightedProduct;
    },

    setScoring : function(product, article2Activities, userId) {
        let activities = article2Activities[product.KnowledgeArticleId];
        product.likes = 0;
        product.dislikes = 0;
        product.userLikes = false;
        product.userDislikes = false;
        if(activities.Votes) {
             // values taken from Vote standard object
            const LIKE = "5";
            const DISLIKE = "1";

            activities.Votes.forEach(function(vote) {
                 if(vote.Type == LIKE) {
                     product.likes++;
                     if(vote.CreatedById == userId) {
                         product.userLikes = true;
                         product.userDislikes = false;
                         product.userVoteId = vote.Id;
                     }
                 } else if (vote.Type == DISLIKE) {
                     product.dislikes++;
                     if(vote.CreatedById == userId) {
                         product.userDislikes = true;
                         product.userLikes = false;
                         product.userVoteId = vote.Id;
                     }
                 }
            });
        }
    },

    setComments : function(product, article2Activities, userId) {
        let activities = article2Activities[product.KnowledgeArticleId];
        if(activities.Feeds) {
            product.comments = activities.Feeds.length;
            activities.Feeds.forEach(function(comment) {
                if(comment.CreatedById == userId) {
                    product.userCommented = true;
                    return;
                }
            });
        } else {
            product.userCommented = false;
            product.comments = 0;
        }
    },

    notifyAnalytics : function(component, productTitle) {
        var appEvent = $A.get("e.c:OSBNavigationEvent");
        appEvent.setParams({
            "pageUrl" : component.get("v.currentTab"),
            "isSinglePageApp" : true,
            "productName" : productTitle
        });
        appEvent.fire();
    }
});