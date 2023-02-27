/**
 * Created by Mykhailo Reznyk on 24.10.2019.
 */
({
    init : function(component) {
        var context = component.get("v.context");
        if(context=="OPTL" && document.cookie.replace(/(?:(?:^|.*;\s*)firstTimeUser\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "true"){
           var cmpTarget = component.find('header-cookie--container');
            $A.util.removeClass(cmpTarget, 'header-cookie--open');
            $A.util.removeClass(cmpTarget, 'header_mainSec');
            $A.util.addClass(cmpTarget, 'header-cookie--closed');
            $A.util.addClass(cmpTarget, '.header_cookie-disclaimer--close');
        }
    },
    closeDisclaimer : function(component) {
        var context = component.get("v.context");
        if(context==="OPTL"){
            document.cookie = "firstTimeUser=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; false; SameSite=None;Secure";
        }
        else{
            document.cookie = "firstTimeUserMP=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; false; SameSite=None;Secure";
        }
        var cmpTarget = component.find('header-cookie--container');
        $A.util.removeClass(cmpTarget, 'header-cookie--open');
        $A.util.removeClass(cmpTarget, 'header_mainSec');
        $A.util.addClass(cmpTarget, 'header-cookie--closed');
        $A.util.addClass(cmpTarget, '.header_cookie-disclaimer--close');
    }
})