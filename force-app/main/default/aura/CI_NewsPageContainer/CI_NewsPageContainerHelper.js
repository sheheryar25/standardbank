({
    doRecentNews: function(component, event, helper) {
        var isMyPortfolio = null;
        if (typeof event.getParam('isMyPortfolio') === 'undefined') {
            isMyPortfolio = false;
        } else {
            isMyPortfolio = event.getParam("isMyPortfolio");
        }
        if(!isMyPortfolio){
            helper.getAllRecentNews(component, event, helper, false);
        } else{
            component.set("v.numberOfRecords", 99);
            helper.getAllNews(component);
        }
    },

    handleFiltering: function(all, selected, setList, component, event, helper, init) {
        this.switchSpinner(component, true);
        var params;
        if (!(typeof event === 'undefined')) {

            params = this.modifyParams(event.getParam('Params'));
            if(params){
                component.set("v.savedParams", params);
            } else {
                params = component.get("v.savedParams");
            }
        } else {
            params = component.get("v.savedParams");
        }
        component.set(setList, all.filter(function(record){
            let match = false;
            if(params.Pred) {
                match = record.Pred__c;
                if(!match) {
                    return false;
                }
            }
            if(params.Sb_Group_Sectors != "-1") {
                match = record.Sb_Group_Sectors__c.includes(params.Sb_Group_Sectors);
                if(!match) {
                    return false;
                }
            }

            if(params.Sb_Sub_Sectors != "-1") {
                match = record.Sb_Sub_Sectors__c.includes(params.Sb_Sub_Sectors);
                if(!match) {
                    return false;
                }
            }

            if(params.Countries != "-1") {
                match = record.Regions__c.includes(params.Countries);
                if(!match) {
                    return false;
                }
            }
            return true;
        }).slice(0,component.get("v.numberOfRecords")));
        if(!init) {
            this.switchSpinner(component, false);
        }
    },
    modifyParams: function(params) {
        for (let key in params) {
            if(params.hasOwnProperty(key)) {
                switch (params[key]) {
                    case false:
                        params[key] = 0;
                        break;
                    case true:
                        params[key] = 1;
                        break;
                    case "":
                        params[key] = "-1";
                        break;
                    case "Unknown Sector":
                        params[key] = "-1";
                        break;
                    case "--None--":
                        params[key] = "-1";
                        break;
                    case null:
                        params[key] = "-1";
                        break;
                }
            }
        }
        return params;
    },

    getAllNews: function (component) {
        var helper = this;
        helper.switchSpinner(component, true);
        var newsService = component.find("newsService");
        var numberOfArticlesPerType = 100;
        var publicationDate = new Date();
        publicationDate.setDate(publicationDate.getDate() - 30);
        var probability = 'medium';
        var isGettingClientSectorNews;
        var sortingArticles = true;

        var clientId = component.get("v.recordId");

        if (clientId) {
            isGettingClientSectorNews = false;
        } else {
            isGettingClientSectorNews = true;
        }

        newsService.getNewsForClient(component.get("v.recordId"), numberOfArticlesPerType, publicationDate, probability, isGettingClientSectorNews, sortingArticles, $A.getCallback(function (error, response) {
            if (!error) {
                if(sortingArticles){
                var allNews = response.allNews;
                }
                else{
                    var allNews = response.newsByClientSector;
                }

                if(allNews.length > 50){
                    allNews.length = 50;
                 }


                allNews.forEach(newsArticle => {
                    helper.formatArticle(newsArticle);
                });
                component.set("v.allArticles", allNews);
                helper.getAllArticlesStatus(component);

                //Default is to show all
                helper.showAll(component);
                $A.get("e.c:CI_NewsLoaded").fire();
                helper.getLikedArticlesStatus(component);
                helper.getSavedArticlesStatus(component);
                helper.handleFiltering(allNews, allNews, 'v.newsArticles', component, event, helper, false);
            } else {
                component.set("v.errorMsg", error);
            }
        }));
    },
    getSaved: function (component) {
        var newsService = component.find("newsService");
        var helper = this;
        newsService.getSavedNews(component.get("v.recordId"), $A.getCallback(function (error, response) {
            if (!error) {
                var articles = response.map(bookmark => bookmark.ArticleNews__r);

                articles.forEach(
                    savedArticle => {
                        helper.formatArticle(savedArticle);
                    }
                );
                component.set("v.savedArticles", articles);
                component.set("v.savedFilterArticles", articles);
            }
        }));
    },

    formatArticle: function (newsArticle) {
        var helper = this;
        var maxTitleLength = 120;

        newsArticle.formattedPublicationDate = newsArticle.Publication_Date__c ? helper.dateFormatter(helper.dateParser(newsArticle.Publication_Date__c)) : "No Date";
        newsArticle.formattedTitle = newsArticle.Title__c ? helper.truncate(newsArticle.Title__c, maxTitleLength) : "";
    },

     setStatusMsg: function (component) {
            if (component.get("v.newsArticles").length == 0) {
                let statusMsg = component.get("v.showingSaved") ? "No articles saved" : "No relevant news found";
                component.set("v.statusMsg", statusMsg);
                $A.util.removeClass(component.find('status_msg'), 'slds-hide');
                $A.util.addClass(component.find('news_section'), 'slds-hide');
            } else {
                $A.util.addClass(component.find('status_msg'), 'slds-hide');
                $A.util.removeClass(component.find('news_section'), 'slds-hide');
            }
        },
        showAll: function (component) {
            var helper = this;
            component.set("v.newsArticles", component.get("v.allArticles"));
            component.set("v.showingSaved", false);
            helper.setStatusMsg(component);
        },
        showSaved: function (component) {
            var helper = this;
            component.set("v.newsArticles", component.get("v.savedArticles"));
            component.set("v.showingSaved", true);
            helper.setStatusMsg(component);
        },
        scrollCarouselLeft: function (component) {
            var newsCarousel = component.find("news_carousel");
            if (newsCarousel)
                newsCarousel.scrollAllLeft();
        },
        getAllArticlesStatus: function (component) {
//            var action = component.get("c.getAllArticlesStatusAction");
//            action.setParams({ articlesObjects: component.get("v.allArticles") });
//              //action.setStorable();
//            action.setCallback(this, function (response) {
//                this.switchSpinner(component, false);
//                // helper.serviceResponseCallback(response, params.callback);
//            });
//            $A.enqueueAction(action);
//            this.switchSpinner(component, true);
        },
        handleNavigationToAdvancedBrowsing: function(component, event, helper) {
        let evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:CI_NewsPageContainer",
            componentAttributes: {
                        recordId : component.get("v.recordId")
                    },
        });
        evt.fire();
        },

    switchSpinner : function(component, status) {
        const spinnerComponent = component.find('spinner');

        if (spinnerComponent) {
            spinnerComponent.switchSpinner(status);
        }
        else {
            console.error("'spinner' does not exist");
        }
    },

    percentageChange: function (originalValue, newValue) {
        var percentageObject =
            {
                differencePercent: 0,
                colourClass: 'yellow',
                arrowCode: '',
                changeDirection: 'nochange'
            };

        var difference = 0;
        if (newValue > originalValue) {
            difference = newValue - originalValue;
            percentageObject.colourClass = 'green';
            percentageObject.arrowCode = '&#x2191';
            percentageObject.changeDirection = 'increase';
        }
        else if (newValue < originalValue) {
            difference = originalValue - newValue;
            percentageObject.colourClass = 'red';
            percentageObject.arrowCode = '&#x2193';
            percentageObject.changeDirection = 'decrease';
        }

        if (originalValue != 0)
            percentageObject.differencePercent = (newValue - originalValue) == 0 ? 0 : (difference / originalValue) * 100;
        else
            percentageObject = null;

        return percentageObject;
    },
    percentageFormatter: function (amount, decimals) {
        if (!decimals)
            decimals = 0;

        if (amount === undefined || amount.toString().includes("Infinity") || amount.toString().includes("N/A"))
            return "N/A";
        if (amount < 0)
            amount = amount * -1;
        return (+amount).toFixed(decimals) + "%";
    },
    serviceResponseCallback: function (response, callback) {
        if (response.getState() != "SUCCESS") {
            var err = response.getError()[0];
            if (err) {
                console.log(err.message);
                callback("Error");
            }
        }
        else {
            var respObject = response.getReturnValue();

            if (respObject.IsSuccess)
                callback(null, respObject.Data);
            else {
                console.log(respObject.Message);
                callback(respObject.Message);
            }
        }
    },
    dateFormatter: function (date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return (day < 10 ? "0" : "") + day + "/" + (month < 10 ? "0" : "") + month + "/" + year;
    },
    dateParser: function (dateString) {
        var dateParts = dateString.split(/[^0-9]/);

        //Check if year is first i.e YYYY/MM/DD
        if (dateParts[0].length == 4) {
            if (dateParts[3] && dateParts[4] && dateParts[5])
                return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4], dateParts[5]);
            else
                return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        } else {// Else DD/MM/YYYY
            if (dateParts[3] && dateParts[4] && dateParts[5])
                return new Date(dateParts[2], dateParts[1] - 1, dateParts[0], dateParts[3], dateParts[4], dateParts[5]);
            else
                return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        }
    },
    amountFormatter: function (amount, decimals) {
        if (!decimals)
            decimals = 0;

        if (Math.abs(amount) < 1000) {
            return parseFloat((amount / 1).toFixed(decimals));
        } else if (Math.abs(amount) < 1000000) {
            return parseFloat((amount / 1000).toFixed(decimals)) + "k";
        } else if (Math.abs(amount) < 1000000000) {
            return parseFloat((amount / 1000000).toFixed(decimals)) + "m";
        } else if (Math.abs(amount) < 1000000000000) {
            return parseFloat((amount / 1000000000).toFixed(decimals)) + "b";
        }
    },

    amountFormatterThousands: function (amount) {
        var parts = ('' + (amount < 0 ? -amount : amount)).split("."), s = parts[0], i = L = s.length, o = '', c;
        while (i--) {
            o = (i == 0 ? '' : ((L - i) % 3 ? '' : ' '))
                + s.charAt(i) + o
        }
        return (amount < 0 ? '-' : '') + o + (parts[1] ? '.' + parts[1] : '');
    },

    amountFormatterDecimals: function (amount, decimals) {
        if (!decimals)
            decimals = 2;

        return (Math.round(amount * 100) / 100).toFixed(decimals);
    },

    toggleSection: function (component, event) {
        var sectionIdToToggle = event.currentTarget.dataset.section
        $A.util.toggleClass(component.find(sectionIdToToggle), "slds-hide");
    },

    getMonthName: function (monthNumber) {
        monthNumber = monthNumber - 1;
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNumber];
    },

    truncate: function (value, maxLength) {
        if (value && value.length > maxLength)
            return value.substring(0, Math.min(maxLength, value.length)) + "...";
        else return value;
    },

    setHeading: function (component, heading) {
        var cmpEvent = component.getEvent("setHeadingEvent");
        cmpEvent.setParams({ data: heading });
        cmpEvent.fire();
    },

    navToComponent: function (component, cmpName, cmpData) {
        var appEvent = $A.get("e.c:CI_EvtNavigateToComponent");
        appEvent.setParams({ cmpName: cmpName, cmpData: cmpData });
        appEvent.fire();
    },
    forceNavigateToComponent : function(cmpName, cmpData) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:" + cmpName,
            componentAttributes: cmpData
        });
        evt.fire();
    },
    showToast : function (message,title,type,mode,duration) {
        var toastEvent = $A.get("e.force:showToast");
        if(!toastEvent){return;}
        if(title){toastEvent.setParam('title',title);}
        if(mode){toastEvent.setParam('mode',mode);}
        if(message){toastEvent.setParam('message',message);}
        if(type){toastEvent.setParam('type',type);}
        if(duration){toastEvent.setParam('duration',duration);}
        toastEvent.fire();
    },
    simpleSort: function(arrToSort, propName, desc) {
        return arrToSort.sort((a, b) => {
            if (desc)
                return a[propName] > b[propName] ? -1 : a[propName] < b[propName] ? 1 : 0;
            else
                return a[propName] > b[propName] ? 1 : a[propName] < b[propName] ? -1 : 0;
        });
    },

    getLikedArticlesStatus: function (component) {
        var action = component.get("c.getAllArticlesStatusLikedAction");
        action.setParams({ articlesObjects: component.get("v.allArticles") });
        action.setCallback(this, function (response) {
            component.set("v.feedbackArticles", response.getReturnValue());
            this.switchSpinner(component, false);
        });
        $A.enqueueAction(action);
        this.switchSpinner(component, true);
    },

    getSavedArticlesStatus: function (component) {
        let action = component.get("c.getAllArticlesStatusSavedAction");
        action.setParams({ articlesObjects: component.get("v.allArticles") });
        action.setCallback(this, function (response) {
            component.set("v.isSavedArticles", response.getReturnValue());
            this.switchSpinner(component, false);
        });
        $A.enqueueAction(action);
        this.switchSpinner(component, true);
    },

    getAllRecentNews: function(component, event, helper, init) {
        component.set("v.numberOfRecords", 999);
        let publicationDate = new Date();
        publicationDate.setDate(publicationDate.getDate() - 30);
        let action = component.get("c.getRecentNews");
        action.setParam("numberOfArticlesPerType", 200);
        action.setParam("publicationDate", publicationDate);
        this.switchSpinner(component, true);
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let storeResponse = response.getReturnValue();
                storeResponse.forEach(newsArticle => {
                                    this.formatArticle(newsArticle);
                                });
                component.set("v.allArticles", storeResponse);
                component.set("v.newsArticles", storeResponse);
                component.set("v.SelectedNews", storeResponse);
                helper.getAllArticlesStatus(component);
                helper.getLikedArticlesStatus(component);
                helper.getSavedArticlesStatus(component);
                this.handleFiltering(storeResponse, storeResponse, 'v.newsArticles', component, event, helper, init);
                if (!init) {
                    this.switchSpinner(component, false);
                }
            } else{
                this.switchSpinner(component, false);
            }
        });
        $A.enqueueAction(action);
    }
})