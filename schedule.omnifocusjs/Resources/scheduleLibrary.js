var _ = function(){
	var scheduleLibrary = new PlugIn.Library(new Version("1.0"));
	
	var config = {};
	// calendar for tasks
	config.calendarName = "Professional";
	// default start time
	config.defaultStartTime = [9,30];
	// default duration for tasks with no estimatedDuration
	config.defaultDuration = 60;
	// maximum minutes per workcycle (connected tasks)
	config.maxWorkcycle = 180;
	// don't plan anything that starts after this time  
	config.cutoffTime = [17,0];

	// make config accessible for the outside 
	scheduleLibrary.config = config;

	scheduleLibrary.scheduleNow = async function(selection) {
		await scheduleLibrary.scheduleTasks(selection.tasks, scheduleLibrary.getStartDate());
	};

	scheduleLibrary.scheduleWithOptions = function(selection) {
		inputForm = new Form();
		dateInput = new Form.Field.Date("startDate", "Date", scheduleLibrary.getStartDate())
		inputForm.addField(dateInput, 0);
		formPromise = inputForm.show("When do you want to start the schedule?", "OK");
		formPromise.then(function(formObject) {
			startDate = formObject.values['startDate'];
			// If we pick a date, the hours/minutes are reset to 00:00 - change that to defaultStartTime
			if (startDate.getHours() == 0 && startDate.getMinutes() == 0) {
				startDate.setHours(config.defaultStartTime[0],config.defaultStartTime[1],0,0);
			}
			scheduleLibrary.scheduleTasks(selection.tasks, startDate);
		});
	};

	scheduleLibrary.scheduleTasks = async function(tasks, startDate) {
		let workcycleMinutes = 0;
		for (let index = 0; index < tasks.length; index++) {
	        	const task = tasks[index];
			console.log("Starting with task: " + task.name);
			var duration = task.estimatedMinutes || config.defaultDuration;

			noteString = "omnifocus:///task/" + task.id.primaryKey;
			if (app.platformName == "macOS") {
				sentenceString = "\"" + task.name + "\" for " + duration + "m " + startDate.toLocaleDateString("nl-NL") + " " + startDate.getHours() + ":" + ("00"+startDate.getMinutes()).slice(-2);
				urlStr = "x-fantastical2://parse?s=" + encodeURIComponent(sentenceString) + "&n=" + encodeURIComponent(noteString) + "&calendarName=" + encodeURIComponent(config.calendarName) + "&add=1";
			} else {
				console.log("platform is not macOS");
				sentenceString = "\"" + task.name + "\" for " + duration + "m " + startDate.toLocaleDateString("nl-NL") + " " + startDate.getHours() + ":" + ("00"+startDate.getMinutes()).slice(-2) + " /" + config.calendarName;
				urlStr = "fantastical2://x-callback-url/parse?sentence=" + encodeURIComponent(sentenceString) + "&note="+ encodeURIComponent(noteString)+"&add=1";
			}

			await scheduleLibrary.openURL(urlStr);

			timeToAdd = new DateComponents();
			if (workcycleMinutes >= config.maxWorkcycle) {
				timeToAdd.minute = duration + 60;
				workcycleMinutes = 0;
			} else {
				timeToAdd.minute = duration;
				workcycleMinutes = workcycleMinutes + duration;
			}

			startDate = Calendar.current.dateByAddingDateComponents(startDate, timeToAdd);
			
			if (startDate.getHours() == 12) {
				startDate.setHours(13,0,0,0);
				workcycleMinutes = 0;
			} else if (startDate.getHours() >= 18) {
				startDate.setHours(9,0,0,0);
				workcycleMinutes = 0;
				daysFromNow++;
			}
		};
	};

	scheduleLibrary.getStartDate = function getStartDate() {
		startDate = new Date();
		startDate.setHours(config.defaultStartTime[0],config.defaultStartTime[1],0,0);
		
		// Start tomorrow (not today)
		if (startDate.getHours() >= config.cutoffTime[0] && startDate.getMinutes() >= config.cutoffTime[1]) {
			startDate = startDate.setDate(startDate.getDate()+1);
		}

		// it's Saturday - start on Monday
		if (startDate.getDay() == 0) {
			startDate.setDate(startDate.getDate()+1);
		// it's Sunday - start on Monday
		} else if (startDate.getDay() == 6) {
			startDate.setDate(startDate.getDate()+2);
		}

		return startDate;
	}

	scheduleLibrary.openURL = async function openURL(urlStr) {
		console.log("Opening URL: " + urlStr);
		if (app.platformName == "macOS") {
			URL.fromString(urlStr).call(function(result){console.log("result: " + result)});
		} else {
			await URL.fromString(urlStr).promiseCall(function(result){console.log("result: " + result)});
		}
	}

	URL.prototype.promiseCall = function(success, failure) {
		return new Promise((resolve, reject) => {
	        this.call((successResult) => {
	            resolve(successResult);
	        }, (failureResult) => {
	            reject(new Error(failureResult));
	        });
	    });
	};

	return scheduleLibrary;
}();
_;
