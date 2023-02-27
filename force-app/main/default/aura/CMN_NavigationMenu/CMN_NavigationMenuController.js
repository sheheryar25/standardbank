({
  onInit: function(component, event, helper) {
    let urlString = window.location.href;
    component.set("v.homepage", urlString.substring(0, urlString.indexOf('/s/') + 3));
    component.set("v.loginIntoExperienceNameLabel",
      component.get("v.loginIntoLabel") + " " +
      component.get("v.experienceNameLabel"));
  },
  onClick: function(component, event, helper) {
    let id = event.target.dataset.menuItemId;
    if(id) component.getSuper().navigate(id);
  },    
  handleMobileMenuClick : function(component, event, helper) {
    let mobileNavFlag =  component.get("v.expandMobileMenu");
    if(!mobileNavFlag) {
      component.set("v.mobileLinksCss","dynamicDisplayBlock");
      component.set('v.expandMobileMenu',true);
    } else {
      component.set("v.mobileLinksCss","dynamicDisplayNone");
      component.set('v.expandMobileMenu',false);
    }
  }    
})