var _ = (function() {
	var priorityLibrary = new PlugIn.Library(new Version("1.0"));

	priorityLibrary.priorityChange = function(tasks, prio) {
		tasks.forEach(function(task) {
			task.removeTags([tagNamed("1"), tagNamed("2"), tagNamed("3"), tagNamed("4"), tagNamed("5")]);
			task.addTag(tagNamed(prio));
			priorityLibrary.reorderTags(task);
		});
	};

	priorityLibrary.reorderTags = function(task) {
		allTags = [];
		tags.apply(tag => allTags.push(tag));
		assignedTags = task.tags;
		
		sortedAssignedTags = assignedTags.sort(function(a, b) {
			return allTags.indexOf(a) > allTags.indexOf(b);
		});
		task.removeTags(assignedTags);
		task.addTags(sortedAssignedTags);
	}	

	return priorityLibrary;
})();

_;
