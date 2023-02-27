({
    render : function(component, helper) {
        var result = this.superRender();

        helper.highlight(component);

        return result;
    },
    rerender : function(component, helper) {
        var result = this.superRerender();

        helper.highlight(component);

        return result;
    }
})