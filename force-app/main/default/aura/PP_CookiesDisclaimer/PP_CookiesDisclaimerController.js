/**
 * Created by Syed Ovais Ali on July 2021.
 */
({
    init : function(component) {
        if(document.cookie.replace(/(?:(?:^|.*;\s*)firstTimeUser\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "true"){
            component.set("v.showCookieDisclaimer",false);
        }
    },
    closeDisclaimer : function(component) {
        document.cookie = "firstTimeUser=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; false; SameSite=None;Secure";
        component.set("v.showCookieDisclaimer",false);
    }
})