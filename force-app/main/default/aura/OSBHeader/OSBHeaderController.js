({
	init : function(component) {
        if (document.cookie.replace(/(?:(?:^|.*;\s*)firstTimeUser\s*\=\s*([^;]*).*$)|^.*$/, "$1") === "true") {
            component.set("v.showCookieDisclaimer",false);
        }
  	}
})