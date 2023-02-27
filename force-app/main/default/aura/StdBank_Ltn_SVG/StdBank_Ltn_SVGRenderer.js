({
    render: function(component, helper) {
        var classname   = component.get("v.class");
        var ariaHidden  = component.get("v.ariaHidden");
        var fill        = component.get("v.fill");

        var category    = component.get("v.category");
        var type        = component.get("v.type");

        console.log('debug here!!!');

        if (navigator.appName == 'Microsoft Internet Explorer' || (navigator.appName == "Netscape" && (navigator.appVersion.indexOf('Edge') > -1) || navigator.appVersion.indexOf('Trident') > -1)) {
            //IE & Edge
            //var result = document.createElementNS("http://www.w3.org/2000/xhtml", "image");

            //result.setAttribute('src', '/resource/sldsICONs/' + category + '/' + type + '_120.png');
            //result.setAttribute('style', 'height:14px;');
            //result.setAttribute('src', '/resource/sldsICONs/' + category + '-sprite/svg/symbols.svg#' + type);
            var result = this.superRender();
        } else {
            //Other browser
            var result = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            result.setAttribute('class', classname);
            result.setAttribute('aria-hidden', ariaHidden);
            result.setAttribute('style', 'fill: ' + fill);

            result.innerHTML = '<use xlink:href="/resource/SLDS221ICONs/' + category + '-sprite/svg/symbols.svg#' + type + '"></use>';

		}
        
        return result;
    }
})