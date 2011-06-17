/** ------------------------------------
 * SweetDEV RIA library
 * Copyright [2006] [Ideo Technologies]
 * ------------------------------------
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 		http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * For more information, please contact us at:
 *         Ideo Technologies S.A
 *        124 rue de Verdun
 *        92800 Puteaux - France
 *
 *      France & Europe Phone : +33 1.46.25.09.60
 *         USA & Canada Phone : (201) 984-7514
 *
 *        web : http://www.ideotechnologies.com
 *        email : SweetDEV-RIA@ideotechnologies.com
 *
 *
 * @version 2.2
 * @author Ideo Technologies
 */

/**
 * @class
 * MultiCalendar is an implementation of the CalendarGroup base class, when used
 * in a X-up view.
 * @constructor
 * @param {Int}		nbMonth 		Number of months wich should be displayed.
 * @param {Object}	childCalClass	Calendar class (StandAloneCalendar, SimpleCalendar, etc) used to instanciate child calendars.
 * @param {String}	id				The id of the table element that will represent the calendar widget
 * @param {String}	containerId		The id of the container element that will contain the calendar table
 * @param {String}	monthyear		The month/year string used to set the current calendar page
 * @param {String}	selected		A string of date values formatted using the date parser. The built-in
									default date format is MM/DD/YYYY. Ranges are defined using
									MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
									Any combination of these can be combined by delimiting the string with
									commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
*/
SweetDevRia.MultiCalendar = function(nbMonth, childCalClass, id, containerId, monthyear, selected) {
	if (arguments.length > 0) {	
		this.buildWrapper(containerId);
		this.init(nbMonth, childCalClass, id, containerId, monthyear, selected);
		superClass(this, SweetDevRia.RiaComponent, id, "MultiCalendar");
	}

	/**
	 * Click to open tooltip JavaScript object.
	 * @type ClickToOpen object
	 */
	this.tooltip = null;

	/**
	 * If calendar is hidden, we don't need to render it but we must know that it must be rendered when it will be displayed.
	 */
	this.mustBeRendered = false;
		
	/**
	 * Single date field HTML object.
	 * @type HTMLInputElement
	 */
	this.singleDateField = null;

	/**
	 * HTML day date field object.
	 * @type HTMLInputElement
	 */
	this.dateDayField = null;

	/**
	 * HTML month date field object.
	 * @type HTMLInputElement
	 */
	this.dateMonthField = null;

	/**
	 * HTML year date field object.
	 * @type HTMLInputElement
	 */
	this.dateYearField = null;

	/**
	 * HTML hidden date field object.
	 * @type HTMLInputElement
	 */
	this.hiddenDateField = null;

	/**
	 * CSS class for date bad format.
	 * @type String
	 */
	this.CssBadFormat = "ideo-cal-inputFieldBadFormat";
	
	/**
	 * Options.
	 * @type Array
	 */
	this.Options = new Array();

	/**
	 * Is the calendar group in multiple select mode ?
	 * @type boolean
	 */
	this.Options.MULTI_SELECT = false;
};

/* Extending CalendarGroup */
extendsClass(SweetDevRia.MultiCalendar, SweetDevRia.RiaComponent, YAHOO.widget.CalendarGroup);

/**
 * Initializes the calendar group. All subclasses must call this method in order for the
 * group to be initialized properly.
 * @param {int}		pageCount	The number of pages that this calendar should display.
 * @param {Object}	childCalClass	Calendar class (StandAloneCalendar, SimpleCalendar, etc) used to instanciate child calendars.
 * @param {String}		id			The id of the element that will be inserted into the DOM.
 * @param {String}		containerId	The id of the container element that the calendar will be inserted into.
 * @param {String}		monthyear	The month/year string used to set the current calendar page
 * @param {String}		selected	A string of date values formatted using the date parser. The built-in
 *									default date format is MM/DD/YYYY. Ranges are defined using
 *									MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
 * 									Any combination of these can be combined by delimiting the string with
 *									commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
 */
SweetDevRia.MultiCalendar.prototype.init = function(pageCount, childCalClass, id, containerId, monthyear, selected) {
	this.id = id;
	this.selectedDates = new Array();
	this.containerId = containerId;
	
	this.pageCount = pageCount;

	this.pages = new Array();

	for (var p=0;p<pageCount;++p) {
		var cal = this.constructChild(id + "_" + p, childCalClass, this.containerId + "_" + p , monthyear, selected);
				
		cal.parent = this;
		
		cal.index = p;

		cal.pageDate.setMonth(cal.pageDate.getMonth()+p);
		cal._pageDate = new Date(cal.pageDate.getFullYear(),cal.pageDate.getMonth(),cal.pageDate.getDate());
		this.pages.push(cal);
	}
	
	this.doNextMonth = function(e, calGroup) {
		calGroup.nextMonth();
	};

	this.doNextYear = function(e, calGroup) {
		calGroup.nextYear();
	};
	
	this.doPreviousMonth = function(e, calGroup) {
		calGroup.previousMonth();
	};

	this.doPreviousYear = function(e, calGroup) {
		calGroup.previousYear();
	};
};

/**
 * Define custom config for multi-calendar.
 * Override YAHOO.widget.Calendar_Core.prototype.customConfig.
 */
SweetDevRia.MultiCalendar.prototype.customConfig = function() { null; };

/**
 * Override YAHOO.widget.Calendar_Core.prototype.setupConfig.
 */
SweetDevRia.MultiCalendar.prototype.setupConfig = function() {
	for (var p=0; p < this.pages.length; ++p) {
		if (this.customConfig) {
			this.pages[p].customConfig = this.customConfig;
			this.pages[p].setupConfig();
		}
	}
};

/**
 * Wiring renderBodyCellRestricted to YAHOO.widget.Calendar_Core.
 */
SweetDevRia.MultiCalendar.prototype.renderBodyCellRestricted = SweetDevRia.BaseCalendar.prototype.renderBodyCellRestricted;

/**
 * Override YAHOO.widget.Calendar_Core.prototype.addRenderer
 */
SweetDevRia.MultiCalendar.prototype.addRenderer = function(sDates, fnRender) {
	for (var p=0; p < this.pages.length; ++p) {
		this.pages[p].addRenderer(sDates, fnRender);
	}	
};

/**
 * Override SweetDevRia.BaseCalendar.prototype.addAcronymRender
 */
SweetDevRia.MultiCalendar.prototype.addAcronymRender = function(sDates, fnRender) {
	for (var p=0; p < this.pages.length; ++p) {
		this.pages[p].addAcronymRender(sDates, fnRender);
	}	
};

/**
 * Implementation of CalendarGroup.constructChild that add some multi-calendar actions.
 */
SweetDevRia.MultiCalendar.prototype.constructChild = function(id,childCalClass, containerId,monthyear,selected) {
	var cal = new childCalClass(id, containerId, monthyear, selected);
	
	if (cal.doSelectCellIfRange) {
		/* If DateRange mode */
		this.select						= SweetDevRia.MultiCalendar.prototype.selectOnDateRange;
		this.selectCell					= SweetDevRia.MultiCalendar.prototype.selectCellOnDateRange;
		this.doResetCalendar 			= SweetDevRia.MultiCalendar.prototype.doResetCalendarOnDateRange;
		this.doGoOnToday				= SweetDevRia.MultiCalendar.prototype.doGoOnTodayOnDateRange;
		this.doSelectCellIfRange 		= SweetDevRia.DateRangeCalendar.prototype.doSelectCellIfRange;
		this.highlightPeriod 			= SweetDevRia.DateRangeCalendar.prototype.highlightPeriod;
		this.highlightCell 				= SweetDevRia.DateRangeCalendar.prototype.highlightCell;
	}

	return cal;
};

/**
 * For DateRangerCalendar : Override DateRangeCalendar.prototype.selectCell.
 * @param	{int}	cellIndex	The index of the cell to select in the current calendar. 
 * @return							Array of JavaScript Date objects representing all individual dates that are currently selected.
 * @type Date[]
 */
SweetDevRia.MultiCalendar.prototype.selectCellOnDateRange = function(cellIndex) {
	return this.doSelectCellIfRange(YAHOO.widget.CalendarGroup.prototype.selectCell, cellIndex);
};

/**
 * For DateRangerCalendar : Override DateRangeCalendar.prototype.selectCell.
 * @param	{String/Date/Date[]}	date	The date string of dates to select in the current calendar. Valid formats are
 *								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
 *								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
 *								This method can also take a JavaScript Date object or an array of Date objects.
 * @return						Array of JavaScript Date objects representing all individual dates that are currently selected.
 * @type Date[]
 */
SweetDevRia.MultiCalendar.prototype.selectOnDateRange = function(date) {
	return this.doSelectCellIfRange(YAHOO.widget.CalendarGroup.prototype.select, date);
};

/**
 * For DateRangerCalendar : Override DateRangeCalendar.prototype.resetCalendar.
 */
SweetDevRia.MultiCalendar.prototype.doResetCalendarOnDateRange = function(e, calGroup) {
	calGroup.clearPeriodDateRange();
	calGroup.resetCalendar();
};


/**
 * For DateRangerCalendar : Override DateRangeCalendar.prototype.goOnToday.
 */
SweetDevRia.MultiCalendar.prototype.doGoOnTodayOnDateRange = function(e, calGroup) {
	calGroup.clearPeriodDateRange();
	calGroup.goOnToday();
};

/**
 * For DateRangerCalendar : Clear period for date range calendar.
 */
SweetDevRia.MultiCalendar.prototype.clearPeriodDateRange = function() {
	/* Restoring initial render stack. */
	for (var p=0; p < this.pages.length; ++p) {
		var cal = this.pages[p];
			cal._renderStack.copy(cal.oldRenderStack);
	}
};

/**
 * Builds the wrapper container for the X-up calendar.
 * @param {String} containerId	The id of the outer container element.
 */
SweetDevRia.MultiCalendar.prototype.buildWrapper = function(containerId) {
	var outerContainer = document.getElementById(containerId);
	
	var innerContainer = document.getElementById(containerId + "_inner");
	
	this.innerContainer = innerContainer;
	this.outerContainer = outerContainer;
};

/**
 * Renders the X-up calendar.
 */
SweetDevRia.MultiCalendar.prototype.render = function() {
	/* If the calendar is inside a tooltip and if the tooltip is close, no need to render it now ! */
	if (this.tooltip && !this.tooltip.opened) {
		this.mustBeRendered = true;
		return;
	}
	
	/* Set Options on child calendars */
	for (var p=0; p < this.pages.length; ++p) {
		if (this.minDate !== null) {
			this.pages[p].minDate = this.minDate;
		}
		if (this.maxDate !== null) {
			this.pages[p].maxDate = this.maxDate;
		}
		if (this.Options.MULTI_SELECT !== this.pages[p].Options.MULTI_SELECT) {
			this.pages[p].Options.MULTI_SELECT = this.Options.MULTI_SELECT;
		}
	}
	
	YAHOO.widget.CalendarGroup.prototype.render.call(this);
};

/**
 * Go on today's date.
 */
SweetDevRia.MultiCalendar.prototype.doGoOnToday = function(e, calGroup) {
	calGroup.goOnToday();
};

/*
 * Override SweetDevRia.BaseCalendar.goOnToday function.
 */
SweetDevRia.MultiCalendar.prototype.goOnToday = function() {
	var now = new Date();
	
	this.deselectAll();
	
	if (this.pages[0].select) {	
		this.select(now);
	}

	this.setMonth(now.getMonth());
	this.setYear(now.getFullYear());
	this.render();

	if (this.pages[0].setActive) {
		this.pages[0].setActive(true);
	}
	this.fillDateInfields(now);
};

/**
 * Clear calendar.
 */
SweetDevRia.MultiCalendar.prototype.doResetCalendar = function(e, calGroup) {
	calGroup.resetCalendar();
};

/*
 * Override SweetDevRia.BaseCalendar.resetCalendar function.
 */
SweetDevRia.MultiCalendar.prototype.resetCalendar = function() {
	for (var p=0; p < this.pages.length; ++p) {
		var cal = this.pages[p];
		cal.deselectAll();
		cal.render();
		if (cal.setActive) {
			cal.setActive(false);
		}
	}
	this.emptyDatefields();
	this.setActive(false);	
};

/**
 * Override SweetDevRia.SimpleCalendar.focus function.
 */
SweetDevRia.MultiCalendar.prototype.focus = function() {
	if (this.pages[0].focus) {
		this.pages[0].focus();
	}
};

/**
 * Override SweetDevRia.SimpleCalendar.getSelDates.
 * @return	2-dim arrays : [ [ year, month, day ], [...] ]
 * @type Array
 */
SweetDevRia.MultiCalendar.prototype.getSelDates = function() {
	return this.selectedDates;
};

/**
 * This function set the new date on calendar.
 * @param {Date}	the new date to set.
 */
SweetDevRia.MultiCalendar.prototype.setNewDate = function(dat) {
	this.setMonth(dat.getMonth());
	this.setYear(dat.getFullYear());
	this.render();
	return true;
};

/**
 * Set the input HTML text field synchronized with the calendar.
 * @param {HTMLInputElement} singleDateFieldId	HTML input text field.
 */
SweetDevRia.MultiCalendar.prototype.addSingleDateField = SweetDevRia.SimpleCalendar.prototype.addSingleDateField;

/**
 * Set the 3 input HTML text fields (day, month and year) synchronized with the calendar.
 * @param {HTMLInputElement} yearFieldId	HTML year input text field.
 * @param {HTMLInputElement} monthFieldId	HTML month input text field.
 * @param {HTMLInputElement} dayFieldId		HTML day input text field.
 */
SweetDevRia.MultiCalendar.prototype.addExplodedDateField = SweetDevRia.SimpleCalendar.prototype.addExplodedDateField;

/**
 * Set the input HTML hidden field on calendar in order to update selected date(s).
 * @param {HTMLInputElement} hiddenDateFieldId	HTML input hidden field.
 */
SweetDevRia.MultiCalendar.prototype.addHiddenDateField = SweetDevRia.SimpleCalendar.prototype.addHiddenDateField;

/**
 * Clear all bad format CSS style class on input type.
 */
SweetDevRia.MultiCalendar.prototype.clearBadFormat = SweetDevRia.SimpleCalendar.prototype.clearBadFormat;

/**
 * This function checks the date on input type field(s). 
 * If it's correct, date is set on the Calendar, if not, an error class is applied on input type field(s).
 */
SweetDevRia.MultiCalendar.prototype.acceptDate = SweetDevRia.SimpleCalendar.prototype.acceptDate;

/**
 * Empty dates HTML input text fields (single field and 3 parts fields).
 */
SweetDevRia.MultiCalendar.prototype.emptyDatefields = SweetDevRia.SimpleCalendar.prototype.emptyDatefields;

/**
 * Fill dates HTML input text fields (single field and 3 parts fields).
 */
SweetDevRia.MultiCalendar.prototype.fillDateInfields = SweetDevRia.SimpleCalendar.prototype.fillDateInfields;

/**
 * Open the tooltip or set the focus on it if it's still opened.
 */
SweetDevRia.MultiCalendar.prototype.openTooltip = SweetDevRia.BaseCalendar.prototype.openTooltip;


/**
 * Add a acronym and a rendering for specified dates in dateList.
 * @param	{String}	Date List, separated by comma.
 * @param 	{String[]}	List of acronyms in same order than date list.
 * @param	{String[]}	CSS Style class.
 */
SweetDevRia.MultiCalendar.prototype.addAcronymRender = function(dateList, acronymList, cssStyleClass) {
	for (var p=0; p < this.pages.length; ++p) {
		var cal = this.pages[p];
		cal.addAcronymRender(dateList, acronymList, cssStyleClass);
	}
};

/**
 * Override SweetDevRia.DateRangeCalendar.prototype.addPeriodRenderer
 * @param	{String}	Date List. See YAHOO.widget.Calendar_Core.prototype.addRenderer#sDates
 */
SweetDevRia.MultiCalendar.prototype.addPeriodRenderer = function(dateList) {
	for (var p=0; p < this.pages.length; ++p) {
		this.pages[p].addPeriodRenderer(dateList);
	}
};

SweetDevRia.MultiCalendar.prototype.onSelect = function(){
	var dates = this.getSelectedDates();
	for(var i=0;i<dates.length;i++){
		dates[i] = dateToIsoDateString(dates[i]);
	}
	if(dates.length == 0){
		dates = null;
	}
	this.id = this.id.substr(0,this.id.length-3);
	this.updateServerModel ("preselect", dates);
	this.id += "Cal";
};

SweetDevRia.MultiCalendar.prototype.onDeselect = function(){
	var dates = this.getSelectedDates();
	for(var i=0;i<dates.length;i++){
		dates[i] = dateToIsoDateString(dates[i]);
	}
	if(dates.length == 0){
		dates = null;
	}
	this.id = this.id.substr(0,this.id.length-3);
	this.updateServerModel ("preselect", dates);
	this.id += "Cal";
};

SweetDevRia.MultiCalendar.prototype.subCalOnSelect = function (obj){
	return function (){
		obj.onSelect();
		
		if (this.superOnSelect){
			this.superOnSelect ();
		}
	};
};

SweetDevRia.MultiCalendar.prototype.subCalOnDeselect = function (obj){
	return function (){
		obj.onDeselect();

		if (this.superOnDeselect){
			this.superOnDeselect ();
		}
	};
};