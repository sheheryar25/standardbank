({
    scrollRight: function (component, event, helper) {
        var scroller = $(component.find("scroller").getElement());
        var leftPos = scroller.scrollLeft();
        scroller.animate({
            scrollLeft: '+=600'
        }, 500);
    },
    scrollLeft: function (component, event, helper) {
        var scroller = $(component.find("scroller").getElement());
        scroller.animate({
            scrollLeft: '-=600'
        }, 500);
    },
    scrollAllLeft: function (component, event, helper) {
        var scroller = $(component.find("scroller").getElement());
        scroller.animate({
            scrollLeft: 0
        }, 500);
    }
})