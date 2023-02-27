({
    doInit: function (component, event, helper) {
        var iconCategory   = component.get("v.svgCategory");
        var iconType       = component.get("v.svgType");
        var iconClass      = component.get("v.svgClass");
        var iconFill       = component.get("v.svgFill");

        if ((iconCategory && iconCategory != '') && (iconType && iconType != '')) {
            $A.createComponent(
                "c:StdBank_Ltn_SVG",
                {
                    'category': iconCategory,
                    'type': iconType,
                    'class': iconClass,
                    'fill': iconFill
                },
                function(newButton){
                    if (component.isValid()) {
                        var body = component.get("v.body");

                        body.push(newButton);
                        component.set("v.body", body);
                    }
                }
            );
        }
    }
})