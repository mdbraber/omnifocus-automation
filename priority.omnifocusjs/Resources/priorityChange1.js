var _ = (function() {

  var action = new PlugIn.Action(function(selection, sender) {
	this.priorityLibrary.priorityChange(selection.tasks, "1");
  });

  action.validate = function(selection, sender) {
    return selection.tasks.length > 0;
  };

  return action;
})();

_;
