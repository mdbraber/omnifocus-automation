var _ = (function() {

  var action = new PlugIn.Action(function(selection, sender) {
	this.dueLibrary.dueToday(selection, 0);
  });

  action.validate = function(selection, sender) {
    return selection.tasks.length > 0 || selection.projects.length > 0;
  };

  return action;
})();
_;
