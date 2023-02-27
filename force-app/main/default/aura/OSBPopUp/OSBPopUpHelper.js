({
    dispatchClosePopUpEvent : function(component, pageNumber, eventTarget) {
        let popUpEvent = component.getEvent("closePopUpEvent");
        popUpEvent.setParams({
            "pageNumber" : pageNumber,
            "message" : eventTarget
        });
        popUpEvent.fire();
    },

    handleChatBot : function(component) {
        let position = {};
        position.bottom = '10px';
        position.right = '220px';
        position.onRightSide = false;

        component.set("v.position", position);
    },

    handleClose : function(component, eventTarget) {
        let currentPage = component.get("v.pageNumber");
        this.dispatchClosePopUpEvent(component, currentPage, eventTarget);
    },

     scrollToTile : function(component, element, window) {
        let fromTop = window.scrollY;
        let windowHeight = window.innerHeight - 80;
        let scrollRequired = false;
        if( element.offsetTop > fromTop + windowHeight || element.offsetTop < fromTop || element.offsetTop + element.offsetHeight > windowHeight) {
            window.scrollTo(0, element.offsetTop - 16);
            scrollRequired = true;
        }
        return scrollRequired;
    },

    changePosition : function(component, window) {
        let popUp = component.find("popUpBox").getElement()
        let page = component.get("v.pageNumber");
        let lastPage = component.get("v.maxPages");
        let positionElement = component.get("v.positionElement");
        let finalTop;
        let finalLeft;
        let margin = 16;
        if(positionElement.inInitialPosition == true) {
            $A.util.addClass(popUp, 'popUp-box-center');
            window.scrollTo(0,0);
        } else {
            $A.util.removeClass(popUp, 'popUp-box-center');
            let arrowSize = 16;
            let scrollingRequired = this.scrollToTile(component, positionElement, window);
            if(positionElement.position == "HORIZONTAL") {
                let isOnRightSide = positionElement.offsetLeft + positionElement.offsetWidth + popUp.offsetWidth < window.innerWidth;
                component.set("v.isOnRightSide", isOnRightSide);
                finalTop = positionElement.offsetTop - window.scrollY;
                finalTop += 166;
                if(page == 3){
                    finalLeft = positionElement.offsetLeft - popUp.offsetWidth - arrowSize;
                }
                else{
                    if(isOnRightSide) {
                        finalLeft = positionElement.offsetLeft + positionElement.offsetWidth + arrowSize;
                    } else {
                        finalLeft = positionElement.offsetLeft - popUp.offsetWidth - arrowSize;
                    }
                }

            } else {
                if(positionElement.offsetLeft + popUp.offsetWidth > window.innerWidth) {
                    finalLeft = positionElement.offsetLeft - (positionElement.offsetLeft + popUp.offsetWidth - window.innerWidth) - margin;
                } else if(positionElement.offsetLeft > 0) {
                    finalLeft = positionElement.offsetLeft;
                } else {
                    finalLeft = positionElement.offsetLeft + margin;
                }
                let isBelow = positionElement.offsetTop < popUp.offsetHeight;
                if(isBelow) {
                    finalTop = positionElement.offsetTop + positionElement.offsetHeight + margin;
                } else {
                    finalTop = positionElement.offsetTop - (popUp.offsetHeight + margin);
                }
            }
            finalTop += 'px';
            finalLeft += 'px';
        }
        popUp.style.top =  finalTop;
        popUp.style.left = finalLeft;
        popUp.style.bottom = 'unset';
        popUp.style.right = 'unset';
    }
})