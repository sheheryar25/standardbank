({
    setCrocAndRoe: function (name, value, component) {
        if (isNaN(value))
            component.set("v." + name, value);
        else {
            var helper = this;
            component.set("v." + name, helper.percentageFormatter(value));

            switch (name) {
                case "croc":
                    if (parseInt(value) < 60)
                        $A.util.addClass(component.find(name), 'red');
                    else if (parseInt(value) < 75)
                        $A.util.addClass(component.find(name), 'yellow');
                    else
                        $A.util.addClass(component.find(name), 'green');
                    break;
                case "roe":
                    if (parseInt(value) < 11)
                        $A.util.addClass(component.find(name), 'red');
                    else if (parseInt(value) < 16)
                        $A.util.addClass(component.find(name), 'yellow');
                    else
                        $A.util.addClass(component.find(name), 'green');
                    break;
            }
        }
    }
})