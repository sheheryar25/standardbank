({
    init : function(cmp, event, helper) {
        let options = cmp.get('v.options');
        cmp.set('v.tempOptions',options);
    },
    closeMenu : function(cmp, event, helper) {
        helper.closeMenuHelper(cmp, event, helper);
    },
    focus : function(cmp, event, helper){
        helper.focusHelper(cmp, event, helper);
        
    },
    focusOnSearch : function(cmp, event, helper){
        helper.focusOnSearchHelper(cmp, event, helper);
        
        
    },
    itemSelected : function(cmp, event, helper) {
        helper.itemSelectedHelper(cmp, event, helper);
    },
    handleValueChange : function(cmp, event, helper) {
        helper.handleValueChangeHelper(cmp, event, helper);
    },
    onkeydown:function(cmp,event,helper){
        helper.onkeydownHelper(cmp, event, helper);
    }
    
})