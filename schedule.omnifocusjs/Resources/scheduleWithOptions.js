var _ = (function() {

  var action = new PlugIn.Action(function(selection, sender) {
	this.scheduleLibrary.scheduleWithOptions(selection);
  });

  action.validate = function(selection, sender) {
    return selection.tasks.length > 0;
  };

  return action;
})();
_;
