({
    stringFormat : function(component, event, helper){
        var params = event.getParam('arguments');
        if (params) {
            var string = params.message;
            var paramList = params.paramList;
        }
      return string.replace(/\{(\d+)\}/g, function() {
              return paramList[arguments[1]];
          });
    }
})