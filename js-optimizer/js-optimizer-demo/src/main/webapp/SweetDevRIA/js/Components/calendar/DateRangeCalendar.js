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
 * RIA Date Range Calendar implementation.
 * @constructor
 * @param {String}	id			The id of the table element that will represent the calendar widget
 * @param {String}	containerId	The id of the container element that will contain the calendar table
 * @param {String}	monthyear	The month/year string used to set the current calendar page
 * @param {String}	selected	A string of date values formatted using the date parser. The built-in
 *								default date format is MM/DD/YYYY. Ranges are defined using
 *								MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
 *								Any combination of these can be combined by delimiting the string with
 *								commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
 */
SweetDevRia.DateRangeCalendar = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.init(id, containerId, monthyear, selected);
		superClass(this, SweetDevRia.SimpleCalendar, id, "CalendarSimple");
		this.Options.MULTI_SELECT = true;
		this._renderStack = new Array();
	}
	
	/**
	 * Initial render stack.
	 */
	this.oldRenderStack = new Array();
	
};
/* Extending SweetDevRia.BaseCalendar */
extendsClass(SweetDevRia.DateRangeCalendar, SweetDevRia.SimpleCalendar);

/**
 * Override SweetDevRia.BaseCalendar.prototype.selectCell in order to manage 2 selections.
 * @param	{int}	cellIndex	The index of the cell to select in the current calendar. 
 * @return							Array of JavaScript Date objects representing all individual dates that are currently selected.
 * @type Date[]
 */
SweetDevRia.DateRangeCalendar.prototype.selectCell = function(cellIndex) {
	return this.doSelectCellIfRange(SweetDevRia.BaseCalendar.prototype.selectCell, cellIndex);
};

/**
 * Override SweetDevRia.BaseCalendar.prototype.selectCell in order to manage 2 selections.
 * @param	{String/Date/Date[]}	date	The date string of dates to select in the current calendar. Valid formats are
 *								individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
 *								Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
 *								This method can also take a JavaScript Date object or an array of Date objects.
 * @return						Array of JavaScript Date objects representing all individual dates that are currently selected.
 * @type Date[]
 */
SweetDevRia.DateRangeCalendar.prototype.select = function(date) {
	return this.doSelectCellIfRange(YAHOO.widget.Calendar_Core.prototype.select, date);
};

/**
 * Generic method used for date or cell selection.
 * @param 	{Function}		Function to call.
 * @param 	{arg}			First and single function's argument. 
 */
SweetDevRia.DateRangeCalendar.prototype.doSelectCellIfRange = function ( fct, arg ) {
	var ret;
	if (this.getSelDates().length >= 2) {
		ret = false;
	} else {
		ret = fct.call(this, arg);
		if (this.getSelDates().length == 2) {
			this.highlightPeriod();
		}
		this.fillDateInfields();
	}
	return ret;
};


/**
 * Override YAHOO.widget.Calendar_Core.prototype.onDeselect in order to clear rendering on calendar.
 */
SweetDevRia.DateRangeCalendar.prototype.onDeselect = function() {
	if (this.getSelDates().length == 1) {
		if (this.parent && this.parent.clearPeriodDateRange) {
			this.parent.clearPeriodDateRange();
			this.parent.render();
		} else {
			this._renderStack.copy(this.oldRenderStack);
			this.render();
		}
	}
	if (this.getSelDates().length === 0) {
		this.emptyDatefields();
	} else {
		this.fillDateInfields();
	}
};

/**
 * Override SweetDevRia.SimpleCalendar.prototype.resetCalendar in order to clear rendering on calendar.
 */
SweetDevRia.DateRangeCalendar.prototype.resetCalendar = function() {
	/* Restoring initial render stack. */
	this._renderStack.copy(this.oldRenderStack);
	SweetDevRia.SimpleCalendar.prototype.resetCalendar.call(this);
};

/**
 * Override SweetDevRia.SimpleCalendar.prototype.goOnToday in order to clear rendering on calendar.
 */
SweetDevRia.DateRangeCalendar.prototype.goOnToday = function() {
	/* Restoring initial render stack. */
	this._renderStack.copy(this.oldRenderStack);
	SweetDevRia.SimpleCalendar.prototype.goOnToday.call(this);
};

/**
 * This function is called when 2 dates are selected.
 * It add a rendering function on each cells contained between selected dates.
 * The rendering function add a CSS style on each cell.
 */
SweetDevRia.DateRangeCalendar.prototype.highlightPeriod = function() {
	if (this.getSelDates().length != 2) {
		return;
	}

	/* Copy old render stack to render stack */
	if (this.parent) {
		for (var p=0; p < this.parent.pages.length; ++p) {
			var cal = this.parent.pages[p];
				cal.renderStack.copy(cal.oldRenderStack);
		}
	} else {
		if (this.renderStack) {
			this.renderStack.copy(this.oldRenderStack);
		}
	}
	
	var d1 = new Date(this.getSelDates()[0][0], this.getSelDates()[0][1] - 1, this.getSelDates()[0][2]),
		d2 = new Date(this.getSelDates()[1][0], this.getSelDates()[1][1] - 1, this.getSelDates()[1][2]),
		dateList = "";

	if (YAHOO.widget.DateMath.after(d1, d2)) {
		var dtmp = d1;
		d1 = d2;
		d2 = dtmp;
	}

	d1 = YAHOO.widget.DateMath.add(d1, YAHOO.widget.DateMath.DAY, 1);
	if (d1.valueOf() == d2.valueOf()) {
		return;
	}
	d2 = YAHOO.widget.DateMath.subtract(d2, YAHOO.widget.DateMath.DAY, 1);	

	dateList = 	(d1.getMonth() + 1) + "/" + d1.getDate() + "/" + d1.getFullYear() + "-" + 
				(d2.getMonth() + 1) + "/" + d2.getDate() + "/" + d2.getFullYear();
	this.addPeriodRenderer(dateList);
	if (this.parent) {
		this.parent.render();
	} else {
		this.render();
	}
};

/**
 * Add renderer to calendar and render it.
 * @param	{String}	Date List. See YAHOO.widget.Calendar_Core.prototype.addRenderer#sDates
 */
SweetDevRia.DateRangeCalendar.prototype.addPeriodRenderer = function(dateList) {
	var toCall = (this.parent) ? this.parent : this;
	toCall.addRenderer(dateList, this.highlightCell);
};

/**
 * This function add a CSS class on a HTMLTableCellElement.
 * @param	{Date}					Working date.
 * @param	{HTMLTableCellElement}	Cell to highlight.
 */
SweetDevRia.DateRangeCalendar.prototype.highlightCell = function(workingDate, cell) { 
	YAHOO.util.Dom.addClass(cell, "ideo-cal-rangeSelected");
};

