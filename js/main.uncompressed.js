(function (doc) {

	var addEvent, calendarContainer,
		months = [
			'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
		],
		daysOfWeek = [
			'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
		];

	addEventToTarget();

	//Cross-browser compatible function for adding events
	function addEvent(ev, el, func) {
	 	if (el.addEventListener) {
	    	el.addEventListener(ev, func, false);
	    }
	 	else if (el.attachEvent) {
	    	el.attachEvent('on'+ev, func);
	 	}
	 	else {
	  		el[ev] = func;
	 	}
	}

	//Add event to the target element
	function addEventToTarget() {
		if (doc.getElementById('target')) {
			var target = doc.getElementById('target');
			addEvent('click', target, openCalendar);
		} else {
			setTimeout(addEventToTarget, 100);
		}
	}

	//Create the calendar, passing in an array of days and empty strings to fill out the week rows
	function openCalendar() {
		var calendarClose, calendarPrev, calendarNext,
			container = doc.createElement('div'),
			date = new Date(),
			monthNum = date.getMonth() + 1,
			year = date.getFullYear(),
			month = renderMonth(monthNum, year),
			daysInMonth = new Date(year, monthNum, 0).getDate(),
			days = renderDays(daysInMonth, monthNum, year);

		if (calendarContainer) {
			calendarContainer.style.display = 'block';
		} else {
			container.className = 'calendar-container';
			container.innerHTML = Handlebars.partials.calendarContainer({
				year: year
				, month: month
				, monthNum: monthNum
				, days: days
				, daysOfWeek: daysOfWeek
			});
			doc.body.appendChild(container);
			centerElement(container);
			calendarContainer = container;
			calendarClose = doc.getElementById('calendar-close');
			calendarPrev = doc.getElementById('calendar-prev');
			calendarNext = doc.getElementById('calendar-next');

			addEvent('click', calendarClose, hideCalendar);
			addEvent('click', calendarPrev, changeDate);
			addEvent('click', calendarNext, changeDate);
		}
	}

	function hideCalendar() {
		calendarContainer.style.display = 'none';
	}

	//Center calendar in the window
	function centerElement(el) {
		var elWidth = el.clientWidth,
			elHeight = el.clientHeight,
			leftDist = (window.innerWidth/2) - (elWidth/2),
			topDist = (window.innerHeight/2) - (elHeight/2);

		el.style.left = leftDist + 'px';
		el.style.top = topDist + 'px';
	}

	//Create an array of the days in the given month
	//pushing in empty strings for the days from Sunday to the first day of the month
	function renderDays(daysInMonth, month, year) {
		var days = [],
			firstDayOfWeek = new Date(year, parseInt(month-1, 10)).getDay();

		for (var i = 0; i < firstDayOfWeek; i++) {
			days.push('');
		}

		for (var i = 0; i < daysInMonth; i++) {
			days.push(i + 1);
		}
		return days;
	}

	function renderMonth(monthNum) {
		for (var i = 0; i < months.length; i++) {
			if (monthNum === i + 1) {
				return months[i];
				break;
			}
		}
	}

	//Previous/next month navigation... commonized for both buttons
	function changeDate() {
		var newDays, newDaysInMonth, newMonthNum, newMonth, newYear,
			target = event.target || event.srcElement || event.originalTarget,
			calendarPageArray = doc.getElementsByClassName('calendar-title')[0].id.split('-'),
			currentMonthNum = calendarPageArray[0],
			currentYear = calendarPageArray[1];

		if (target.id === 'calendar-prev') {
			//Loop back to December (of the last year) if we're in January
			if (currentMonthNum === '1') {
				newMonthNum = 12;
				newYear = parseInt(currentYear) - 1;
			} else {
				newMonthNum = parseInt(currentMonthNum) - 1;
				newYear = currentYear;
			}
		} else {
			//Loop back to January (of the next year) if we're in December
			if (currentMonthNum === '12') {
				newMonthNum = 1;
				newYear = parseInt(currentYear) + 1;
			} else {
				newMonthNum = parseInt(currentMonthNum) + 1;
				newYear = currentYear;
			}
		}

		newMonth = renderMonth(newMonthNum);
		newDaysInMonth = new Date(currentYear, newMonthNum, 0).getDate();
		newDays = renderDays(newDaysInMonth, newMonthNum, newYear);

		//Render the new month into the container
		doc.getElementById('calendar').innerHTML = Handlebars.partials.calendar({
			year: newYear
			, month: newMonth
			, monthNum: newMonthNum
			, days: newDays
			, daysOfWeek: daysOfWeek
		});
	}

})(document);