({
    doInit: function(component) {
        var param = "index";
        var result=decodeURIComponent(
            (new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').
            exec(location.search)||[,""])[1].replace(/\+/g, '%20')
            )||null;
        component.set("v.notificationsIndex", result);
        component.set("v.isInitialized", true);
    }

})