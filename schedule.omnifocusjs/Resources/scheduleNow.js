var _ = (function() {

  var action = new PlugIn.Action(function(selection, sender) {
	this.scheduleLibrary.scheduleNow(selection);
  });

  action.validate = function(selection, sender) {
    return selection.tasks.length > 0;
  };

  return action;
})();
_;
