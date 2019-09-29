var _ = (function() {
	var deferLibrary = new PlugIn.Library(new Version("1.0"));

	deferLibrary.deferThisEvening = function(selection) {
		newDeferDate = new Date();
		newDeferDate.setHours("18");
		newDeferDate.setMinutes("00");
		deferLibrary.deferChangeDate(selection, 0, newDeferDate, false)
	}

	deferLibrary.deferChangeDate = function(selection, shiftDays = 0, forceDate = null, defaultTime = false) {
		var tasksToChange = [];
		
		// get default due time to use if task has no due date
		defaultDeferTime = settings.objectForKey("DefaultStartTime");
		defaultDeferTimeSplit = defaultDeferTime.split(":");
		defaultDeferHours = defaultDeferTimeSplit[0];
		defaultDeferMinutes = defaultDeferTimeSplit[1];

		// get 'task' for each selected project
		selection.projects.forEach(function(project) {
		  tasksToChange.push(project.task);
		});
		
		tasksToChange = selection.tasks.concat(tasksToChange);
		
		tasksToChange.forEach(function(task) {
		  // get existing start date
		  existingDeferDate = task.effectiveDeferDate;
		
		  // if no due date, use now as starting point; otherwise use existing due date
		  if (forceDate != null) {
	            startingDeferDate = forceDate
		    if (!defaultTime) {
			    // we ignore the hours/minutes from the forced date
			    startingDeferDate.setHours(defaultDeferHours);
			    startingDeferDate.setMinutes(defaultDeferMinutes);
		    }
		  } else if (existingDeferDate) {
		    startingDeferDate = existingDeferDate;
		  } else {
		    startingDeferDate = new Date();
		    startingDeferDate.setHours(defaultDeferHours);
		    startingDeferDate.setMinutes(defaultDeferMinutes);
		  }
		
		  // add one day to get new due date
		  timeToAdd = new DateComponents();
		  timeToAdd.day = shiftDays;
		  newDeferDate = Calendar.current.dateByAddingDateComponents(
		    startingDeferDate,
		    timeToAdd
		  );
		
		  // set the due date of the task
		  task.deferDate = newDeferDate;
		});
	}

	deferLibrary.deferClear = function(selection) {
		var tasksToChange = [];
		
		// get 'task' for each selected project
		selection.projects.forEach(function(project) {
		  tasksToChange.push(project.task);
		});
		
		tasksToChange = selection.tasks.concat(tasksToChange);
		
		tasksToChange.forEach(function(task) {
		    task.deferDate = null;
		});
	}

	return deferLibrary;
})();

_;
