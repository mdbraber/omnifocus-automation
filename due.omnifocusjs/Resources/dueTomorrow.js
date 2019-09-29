var _ = (function() {

  var action = new PlugIn.Action(function(selection, sender) {
	this.dueLibrary.dueChangeDate(selection, 1, null, false);
  });

  action.validate = function(selection, sender) {
    return selection.tasks.length > 0 || selection.projects.length > 0;
  };

  return action;
})();
_;
