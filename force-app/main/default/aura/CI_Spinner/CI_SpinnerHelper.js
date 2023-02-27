({
  doSwitchSpinner : function(component, event) {
          let args = event.getParam('arguments');

          if (args && args.status) {
              component.set('v.isSpinnerRun', true);
          }
          else {
              component.set('v.isSpinnerRun', false);
          }
      }
})