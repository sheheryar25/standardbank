({
  onInit: function(component, event, helper) {
    let urlString = window.location.href;
    component.set("v.homepage", urlString.substring(0, urlString.indexOf('/s/') + 3));
    // component.set("v.navigationLinkSetId", "ACM_Default_Menu");

    window.addEventListener('click', function(event) {
      if(event.target && !event.target.matches('.showSubMenu')) {
        window.setTimeout(
            $A.getCallback(function() {
              let dropdownCmp = component.find("submenuid");
              if($A.util.hasClass(dropdownCmp, "show-sub-menu"))
                $A.util.removeClass(dropdownCmp, "show-sub-menu");

                let dropdownIconCmp = component.find("rotateicon");
                if($A.util.hasClass(dropdownIconCmp, "down"))
                  $A.util.removeClass(dropdownIconCmp, "down");
        }), 100
      );
      }
    });

    let media = window.matchMedia('(min-width: 1025px');
    component.set("v.showProfileMenu", media.matches);
    
    window.addEventListener('resize', $A.getCallback(function(){
      component.set("v.showProfileMenu", media.matches);
    }));

  },
  navigateToMenu: function(component, event, helper) {
    let savedDataLayer = Object.assign({}, window.savedDataLayer);
    let menuItemId = event.target.dataset.menuItemId;
    let tabLabel = event.target.dataset.text;
    $A.util.removeClass(component.find("submenuid"), "show-sub-menu");
    $A.util.removeClass(component.find("rotateicon"), "down");
    $A.util.removeClass(component.find("mobilenavid"), "show-overlay");
    $A.util.removeClass(component.find("naviconid"), "show-navicon");

    let id = event.target.dataset.menuItemId;
    if(id) {
      component.getSuper().navigate(id);     
      component.find('analyticsintegration').fireDirectAnalyticsInteraction(event, savedDataLayer);
    }
    
  },    
  handleMobileMenuClick : function(component, event, helper) {
    
    $A.util.addClass(component.find("hamburgerid"), "show");
    $A.util.toggleClass(component.find("mobilenavid"), "show-overlay");
    $A.util.toggleClass(component.find("naviconid"), "show-navicon");
    
  },
  showSearch: function(component, event, helper) {
    component.set('v.isSearchBoxVisible', true);
    $A.util.toggleClass(component.find("showsearchbar"), "slds-hide");

  },  
  searchKeyCheck : function(component, event, helper){
    if (event.which == 13){
      component.set('v.isSearchBoxVisible', false);
      $A.util.toggleClass(component.find("showsearchbar"), "slds-hide");
    }    
  },
  closeSearch: function(component, event, helper) {
    component.set('v.isSearchBoxVisible', false);
    $A.util.toggleClass(component.find("showsearchbar"), "slds-hide");
  },
  showSubMenu: function(component) {
      $A.util.toggleClass(component.find("submenuid"), "show-sub-menu");
      $A.util.toggleClass(component.find("rotateicon"), "down");
  },
  navigateToCountries: function(component) {     
	  var urlEvent = $A.get("e.force:navigateToURL");
	  urlEvent.setParams({
		  "url": component.get("v.apiCountryUrl")
	  });
	  urlEvent.fire()
  },

  handlefireDirectAnalyticsInteraction: function(component, event, helper) {
    component.find('analyticsintegration').fireDirectAnalyticsInteraction(event,window.savedDataLayer);
  }
})