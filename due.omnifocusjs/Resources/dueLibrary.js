var _ = (function() {
	var dueLibrary = new PlugIn.Library(new Version("1.0"));

        dueLibrary.dueToday = function(selection) {
                var tasksToChange = [];

                // get 'task' for each selected project
                selection.projects.forEach(function(project) {
                  tasksToChange.push(project.task);
                });

                tasksToChange = selection.tasks.concat(tasksToChange);

		defaultDueTime = settings.defaultObjectForKey("DefaultDueTime");
		defaultDueTimeSplit = defaultDueTime.split(":");
		defaultDueHours = defaultDueTimeSplit[0];
		defaultDueMinutes = defaultDueTimeSplit[1];

		today = new Date();
		today.setHours(defaultDueHours);
		today.setMinutes(defaultDueMinutes);

                tasksToChange.forEach(function(task) {
	             task.dueDate = today;
                });
        }

	dueLibrary.changeDueDate = function(selection, days) {
		var tasksToChange = [];
		
		// get default due time to use if task has no due date
		defaultDueTime = settings.defaultObjectForKey("DefaultDueTime");
		defaultDueTimeSplit = defaultDueTime.split(":");
		defaultDueHours = defaultDueTimeSplit[0];
		defaultDueMinutes = defaultDueTimeSplit[1];
		
		// get 'task' for each selected project
		selection.projects.forEach(function(project) {
		  tasksToChange.push(project.task);
		});
		
		tasksToChange = selection.tasks.concat(tasksToChange);
		
		tasksToChange.forEach(function(task) {
		  // get existing due date
		  existingDueDate = task.effectiveDueDate;
		
		  // if no due date, use now as starting point; otherwise use existing due date
		  if (existingDueDate == null) {
		    startingDueDate = new Date();
		    startingDueDate.setHours(defaultDueHours);
		    startingDueDate.setMinutes(defaultDueMinutes);
		  } else {
		    startingDueDate = existingDueDate;
		  }
		
		  // add one day to get new due date
		  timeToAdd = new DateComponents();
		  timeToAdd.day = days;
		  newDueDate = Calendar.current.dateByAddingDateComponents(
		    startingDueDate,
		    timeToAdd
		  );
		
		  // set the due date of the task
		  task.dueDate = newDueDate;
		});
	}

        dueLibrary.dueClear = function(selection) {
                var tasksToChange = [];

                // get 'task' for each selected project
                selection.projects.forEach(function(project) {
                  tasksToChange.push(project.task);
                });

                tasksToChange = selection.tasks.concat(tasksToChange);

                tasksToChange.forEach(function(task) {
                    task.dueDate = null;
                });
        }

	return dueLibrary;
})();

_;
