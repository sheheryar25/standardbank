({
  render: function(component, helper) {
    var ret = this.superRender();

    helper.drawChart(component);
    return ret;
  },

  rerender: function(component, helper) {
    var ret = this.superRerender();

    helper.drawChart(component);
    return ret;
  }

})