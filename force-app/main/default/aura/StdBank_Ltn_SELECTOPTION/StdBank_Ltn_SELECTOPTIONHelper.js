({
    highlight : function(component) {
        if (component.isValid()) {
            var highlight = component.get('v.highlight');
            var textElement = component.find('text').getElement();
            var text = component.get('v.data.Name');

            if (highlight && highlight != '' && text) {
                var res = text.match(new RegExp(highlight, 'ig'));

                if (res && res.length != 0) {
                    res.sort().filter(function(item, pos, ary) {
                        return !pos || item != ary[pos - 1];
                    });

                    res.forEach(function (item) {
                        textElement.innerHTML = text.replace(new RegExp(item, 'g'), '<b>' + item + '</b>');
                    });
                }
            }
        }
    }
})