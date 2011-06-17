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
 * RIA Simple Calendar implementation.
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
SweetDevRia.SimpleCalendar = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.init(id, containerId, monthyear, selected);
		superClass(this, SweetDevRia.BaseCalendar, id, "CalendarSimple");
	}

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
};
/* Extending SweetDevRia.BaseCalendar */
extendsClass(SweetDevRia.SimpleCalendar, SweetDevRia.BaseCalendar);

/**
 * Is the date from input field valid ?
 * @return true if date is valid, false instead.
 * @type boolean
 */
SweetDevRia.SimpleCalendar.prototype.isSelectedDateValid = function() {
	if (this.dateMonthField) {
		return !SweetDevRia.DomHelper.hasClassName(this.dateMonthField, this.CssBadFormat);
	}
	if (this.singleDateField) {
		return !SweetDevRia.DomHelper.hasClassName(this.singleDateField, this.CssBadFormat);
	}
};

/**
 * Set the input HTML text field synchronized with the calendar.
 * @param {HTMLInputElement} singleDateFieldId	HTML input text field.
 */
SweetDevRia.SimpleCalendar.prototype.addSingleDateField = function(singleDateFieldId) {
	this.singleDateField = SweetDevRia.DomHelper.get(singleDateFieldId);
	this.singleDateField.calInstance = this;

	/* Accept date on blur */
	YAHOO.util.Event.addListener(this.singleDateField, "blur", this.acceptDate, this);
	/* Deactivate calendar to avoid that date change when using arrow keys */
	YAHOO.util.Event.addListener(this.singleDateField, "focus", this.deactivate, this);
	/* Handle key event on inputs fields */
	YAHOO.util.Event.addListener(this.singleDateField, "keydown", this.handleInputEvent, this);
};

/**
 * Handle keydown on input fields.
 * @param {Event} event.
 */
SweetDevRia.SimpleCalendar.prototype.handleInputEvent = function(event) {
	SweetDevRia.EventHelper.stopPropagation(event);
	return true;
};

/**
 * Desactivate the calendar.
 */
SweetDevRia.SimpleCalendar.prototype.deactivate = function() {
	this.calInstance.close();
};

/**
 * Set the 3 input HTML text fields (day, month and year) synchronized with the calendar.
 * @param {HTMLInputElement} yearFieldId	HTML year input text field.
 * @param {HTMLInputElement} monthFieldId	HTML month input text field.
 * @param {HTMLInputElement} dayFieldId		HTML day input text field.
 */
SweetDevRia.SimpleCalendar.prototype.addExplodedDateField = function(yearFieldId, monthFieldId, dayFieldId) {
	this.dateYearField = SweetDevRia.DomHelper.get(yearFieldId);
	this.dateMonthField = SweetDevRia.DomHelper.get(monthFieldId);
	this.dateDayField = SweetDevRia.DomHelper.get(dayFieldId);
	this.dateYearField.calInstance = this;
	this.dateMonthField.calInstance = this;
	this.dateDayField.calInstance = this;

	/* Accept date on blur */
	YAHOO.util.Event.addListener(this.dateYearField, "blur", this.acceptDate, this);
	YAHOO.util.Event.addListener(this.dateMonthField, "blur", this.acceptDate, this);
	YAHOO.util.Event.addListener(this.dateDayField, "blur", this.acceptDate, this);
	/* Deactivate calendar to avoid that date change when using arrow keys */
	YAHOO.util.Event.addListener(this.dateYearField, "focus", this.deactivate, this);
	YAHOO.util.Event.addListener(this.dateMonthField, "focus", this.deactivate, this);
	YAHOO.util.Event.addListener(this.dateDayField, "focus", this.deactivate, this);
	/* Handle key event on inputs fields */
	YAHOO.util.Event.addListener(this.dateYearField, "keydown", this.handleInputEvent, this);
	YAHOO.util.Event.addListener(this.dateMonthField, "keydown", this.handleInputEvent, this);
	YAHOO.util.Event.addListener(this.dateDayField, "keydown", this.handleInputEvent, this);
};

/**
 * Set the input HTML hidden field on calendar in order to update selected date(s).
 * @param {HTMLInputElement} hiddenDateFieldId	HTML input hidden field.
 */
SweetDevRia.SimpleCalendar.prototype.addHiddenDateField = function(hiddenDateFieldId) {
	this.hiddenDateField = SweetDevRia.DomHelper.get(hiddenDateFieldId);
};

/**
 * Clear all bad format CSS style class on input type.
 */
SweetDevRia.SimpleCalendar.prototype.clearBadFormat = function () {
	SweetDevRia.DomHelper.removeClassName(this.singleDateField, this.CssBadFormat);
	SweetDevRia.DomHelper.removeClassName(this.dateYearField, this.CssBadFormat);
	SweetDevRia.DomHelper.removeClassName(this.dateMonthField, this.CssBadFormat);
	SweetDevRia.DomHelper.removeClassName(this.dateDayField, this.CssBadFormat);
};

/**
 * This function checks the date on input type field(s). 
 * If it's correct, date is set on the Calendar, if not, an error class is applied on input type field(s).
 */
SweetDevRia.SimpleCalendar.prototype.acceptDate = function() {
	if (!this || !this.calInstance) {
		SweetDevRia.log.error("acceptDate : 'this' is null !");
		return false;
	}

	/*
	 * Only active component if calendar is visible so if :
	 * - there's a parent with no tooltip;
	 * - there's a parent with a tooltip opened,
	 * - there's no tooltip
	 * - there's a tooltip opened) 
	 */
	if ( (this.parent && ((this.parent.tooltip && this.parent.tooltip.opened) || !this.parent.tooltip)) ||
		!this.tooltip || (this.tooltip && this.tooltip.opened) ) {
		this.calInstance.setActive(true);
	}

	SweetDevRia.DomHelper.removeClassName(this, this.CssBadFormat);
	this.calInstance.clearBadFormat();
	this.calInstance.deselectAll();

	var verif, dateValue;
	try {
		if (this.calInstance.singleDateField == this) {
			// Single field
			var datePattern = "^" + SweetDevRia.DateFormat.pattern.toUpperCase() + "$";
			datePattern = datePattern.replace("YYYY", "[0-9]{4,4}").replace("YY", "[0-9]{1,2}").replace("DD", "[0-9]{1,2}").replace("MM", "[0-9]{1,2}").replace(/\//g, SweetDevRia.DateFormat.separator);
			verif = new RegExp(datePattern);
			if (verif.test(this.value)) {
				SweetDevRia.DateFormat.prepareDateField(this);
				dateValue = SweetDevRia.DateFormat.parseDate(this.value);
				if (dateValue === null) {
					throw("BadDateException");
				}
			} else {
				throw("BadFormatException");
			}
		} else {
			// Multiple fields
			if (this == this.calInstance.dateYearField && SweetDevRia.DateFormat.pattern.toUpperCase().indexOf("YYYY") !== -1) {
				verif = new RegExp("^[0-9]{4,4}$");
			} else {
				verif = new RegExp("^[0-9]{1,2}$");
			}
			if (verif.test(this.value)) {
				SweetDevRia.DateFormat.prepareDateField(this);
				
				if (this.calInstance.dateDayField.value.length > 0 &&
					this.calInstance.dateMonthField.value.length > 0 &&
					this.calInstance.dateYearField.value.length > 0) {
					
					dateValue = SweetDevRia.DateFormat.getDate(this.calInstance.dateYearField.value, this.calInstance.dateMonthField.value, this.calInstance.dateDayField.value);
					if (dateValue === null) {
						throw("BadDateException");
					}
				}
			} else {
				throw("BadFormatException");
			}
		}
		
		// here, the selected date has been set into dateValue and is well formatted
		if (dateValue) {
			// check for good date range
			if(this.calInstance.minDate){
				if(YAHOO.widget.DateMath.before(dateValue, this.calInstance.minDate)){
					throw("UnauthorizedDateException");
				}
			}
			if(this.calInstance.maxDate){
				if(YAHOO.widget.DateMath.after(dateValue, this.calInstance.maxDate)){
					throw("UnauthorizedDateException");
				}
			}
			
			if(this.calInstance.disabledDays){
				var ddArray = this.calInstance.disabledDays;
				for(var dd=0;dd<ddArray.length;dd++){
					var ddDate =  ddArray[dd];
					if( ddDate.getTime() == dateValue.getTime() ){
						throw("UnauthorizedDateException");
					}
				}				
			}
			
			this.calInstance.clearBadFormat();
			this.calInstance.select(dateValue);
			this.calInstance.setNewDate(dateValue);
		}
	} catch (e) {
		this.calInstance.render();
		SweetDevRia.DomHelper.addClassName(this, this.calInstance.CssBadFormat);
		SweetDevRia.DomHelper.addClassName(this.calInstance.dateYearField, this.calInstance.CssBadFormat);
		SweetDevRia.DomHelper.addClassName(this.calInstance.dateMonthField, this.calInstance.CssBadFormat);
		SweetDevRia.DomHelper.addClassName(this.calInstance.dateDayField, this.calInstance.CssBadFormat);
		SweetDevRia.log.warn("Error on parsing date [" + e + "]");
	}
	
	this.calInstance.fireEventListener ("change");
	
	return true;
};

/**
 * Clean the date selected, clean HTML date input text fields and desactivate the calendar.
 */
SweetDevRia.SimpleCalendar.prototype.resetCalendar = function() {
	if (this.parent) {
		this.parent.resetCalendar();
		this.close();
		return true;
	} else {
		this.emptyDatefields();
		this.deselectAll();
		this.setMonth(new Date().getMonth());
		this.setYear(new Date().getFullYear());
		this.render();
		this.setActive(false);
		return true;
	}
	return false;
};

/*
 * Go and selected today's date.
 * Override SweetDevRia.BaseCalendar.prototype.goOnToday.
 */
SweetDevRia.SimpleCalendar.prototype.goOnToday = function() {
	this.deselectAll();
	this.select(new Date());
	SweetDevRia.BaseCalendar.prototype.goOnToday.call(this);
	this.fillDateInfields();
	this.setActive(true);
};

/**
 * Fill dates HTML input text fields (single field, 3 parts fields and hidden fields).
 */
SweetDevRia.SimpleCalendar.prototype.fillDateInfields = function() {

	if (this.parent) {
		this.parent.fillDateInfields();
	} else {
		if (this.getSelDates().length === 0) {
			this.emptyDatefields();
		} 
		else if (this.getSelDates().length == 1) {
			/* Only 1 date was selected */
			this.clearBadFormat();

			if (this.singleDateField !== null) {
				this.singleDateField.value = SweetDevRia.DateFormat.getDateFromPattern(this.getSelDates()[0][0], this.getSelDates()[0][1], this.getSelDates()[0][2]);
			}
			if (this.hiddenDateField !== null) {
				this.hiddenDateField.value = SweetDevRia.DateFormat.getDateFromPattern(this.getSelDates()[0][0], this.getSelDates()[0][1], this.getSelDates()[0][2]);
			}
			if (this.dateDayField !== null) {
				this.dateDayField.value = SweetDevRia.DateFormat.getDay(this.getSelDates()[0][2]);
			}
			if (this.dateMonthField !== null) {
				this.dateMonthField.value = SweetDevRia.DateFormat.getMonth(this.getSelDates()[0][1]);
			}
			if (this.dateYearField !== null) {
				this.dateYearField.value = SweetDevRia.DateFormat.getYear(this.getSelDates()[0][0]);
			}
		} 
		else {
			/* Multiple dates were selected */
			if (this.hiddenDateField !== null) {
				this.hiddenDateField.value = "";
				for (var i = 0; i < this.getSelDates().length; i++) {
					this.hiddenDateField.value += ((i > 0) ? SweetDevRia.DateFormat.multiDateSeparator : "") + SweetDevRia.DateFormat.getDateFromPattern(this.getSelDates()[i][0], this.getSelDates()[i][1], this.getSelDates()[i][2]);
				}
			}
		}
			
		this.fireEventListener ("change");
	}
};

/**
 * Returns selected date(s).
 * @return	2-dim arrays : [ [ year, month, day ], [...] ]
 * @type Array
 */
SweetDevRia.SimpleCalendar.prototype.getSelDates = function() {
	if (this.parent) {
		return this.parent.selectedDates;
	} else {
		return this.selectedDates;
	}
};

/**
 * Empty dates HTML input text fields (single field and 3 parts fields).
 */
SweetDevRia.SimpleCalendar.prototype.emptyDatefields = function() {
	this.clearBadFormat();

	if (this.singleDateField !== null) {
		this.singleDateField.value = "";
	}
	if (this.hiddenDateField !== null) {
		this.hiddenDateField.value = "";
	}
	if (this.dateDayField !== null) {
		this.dateDayField.value = "";
	}
	if (this.dateMonthField !== null) {
		this.dateMonthField.value = "";
	}
	if (this.dateYearField !== null) {
		this.dateYearField.value = "";
	}
};


/**
 * This is an overrided function from RiaComponent.
 * It's called to catch event.
 * @param {RiaEvent}	evt 	RiaEvent object
 */
SweetDevRia.SimpleCalendar.prototype.handleEvent = function(evt) {
	if (!this.isActive()) {
		return true;
	}

	if (evt && evt.type) {
		if (evt.type == SweetDevRia.RiaEvent.KEYBOARD_TYPE) {
			var dat = null,
				keyCode = evt.keyCode;
			if (this.getSelDates().length == 1) {
				dat = new Date(this.getSelDates()[0][0], this.getSelDates()[0][1]-1, this.getSelDates()[0][2]);
			}

			switch(keyCode) {
				case SweetDevRia.KeyListener.ARROW_UP_KEY:
					if (dat) {
						dat = YAHOO.widget.DateMath.subtract(dat, YAHOO.widget.DateMath.DAY, 7);
					}
					break;
				case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
					if (dat) {
						dat = YAHOO.widget.DateMath.subtract(dat, YAHOO.widget.DateMath.DAY, 1);
					}
					break;
				case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
					if (dat) {
						dat = YAHOO.widget.DateMath.add(dat, YAHOO.widget.DateMath.DAY, 7);
					}
					break;
				case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
					if (dat) {
						dat = YAHOO.widget.DateMath.add(dat, YAHOO.widget.DateMath.DAY, 1);
					}
					break;
				case SweetDevRia.KeyListener.ESCAPE_KEY:
					this.resetCalendar();
					break;
				case SweetDevRia.KeyListener.ENTER_KEY:
				case SweetDevRia.KeyListener.SPACE_KEY:
					SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
					SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
					this.close();
					this.setActive(false);
					return false;
				default:
					break;
			}

			if (this.Options.MULTI_SELECT) {
				SweetDevRia.log.warn("No keyboard support for multidate calendar !");
				SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
				SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
				return true;
			}

			// If the date was a restricted date, we should select previous/next date.
			while(this.isRestrictedDate(dat)) {
				switch(keyCode) {
					case SweetDevRia.KeyListener.ARROW_UP_KEY:
					case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
						if (dat) {
							dat = YAHOO.widget.DateMath.subtract(dat, YAHOO.widget.DateMath.DAY, 1);
						}
						break;
					case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
					case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
						if (dat) {
							dat = YAHOO.widget.DateMath.add(dat, YAHOO.widget.DateMath.DAY, 1);
						}
						break;
					default:
						break;
				}
			}

			this.setNewDateAndFillDateInFields(dat);
			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			return false;
		}
	}
};

/**
 * This function check if date is a restricted date (= not selectionable) or not.
 * @param {Date}	New date to check if restricted.
 * @return True if date is a restricted date (not selectable) or false instead.
 * @type boolean
 */
SweetDevRia.SimpleCalendar.prototype.isRestrictedDate = function(dat) {

	for (var r=0;r<this._renderStack.length;++r) {
		var rArray = this._renderStack[r];
		var type = rArray[0];
		var fn = rArray[2];
		
		var month, day, year;

		if (fn == this.renderBodyCellRestricted) {

			switch (type) {
				case YAHOO.widget.Calendar_Core.DATE:
					month = rArray[1][1];
					day = rArray[1][2];
					year = rArray[1][0];
	
					if (year == dat.getFullYear() && month == (dat.getMonth() + 1) && day == dat.getDate()) {
						return true;
					}
	
					break;
				case YAHOO.widget.Calendar_Core.MONTH_DAY:
					month = rArray[1][0];
					day = rArray[1][1];

					if (month == (dat.getMonth() + 1) && day == dat.getDate()) {
						return true;
					}
					
					break;
				case YAHOO.widget.Calendar_Core.RANGE:
// TODO : handle this case.
/*					var date1 = rArray[1][0];
					var date2 = rArray[1][1];
	
					var d1month = date1[1];
					var d1day = date1[2];
					var d1year = date1[0];
					
					var d1 = new Date(d1year, d1month-1, d1day);
	
					var d2month = date2[1];
					var d2day = date2[2];
					var d2year = date2[0];
	
					var d2 = new Date(d2year, d2month-1, d2day);*/
					break;
				case YAHOO.widget.Calendar_Core.WEEKDAY:
// TODO : handle this case.
/*					var weekday = rArray[1][0];*/
					break;
				case YAHOO.widget.Calendar_Core.MONTH:
					month = rArray[1][0];

					if (month == (dat.getMonth() + 1)) {
						return true;
					}
					break;
				default:
					break;
			}
		}
	}
	return false;
};

/**
 * This function set the new date on calendar and fills html inputs fields.
 * @param {Date}	the new date to set.
 */
SweetDevRia.SimpleCalendar.prototype.setNewDateAndFillDateInFields = function(dat) {
	this.select(dat);
	this.setNewDate(dat);
	this.fillDateInfields();
	return true;
};

/**
 * This function set the new date on calendar.
 * If the date is on the same calendar, no render is made to optimize display.
 * @param {Date}	the new date to set.
 */
SweetDevRia.SimpleCalendar.prototype.setNewDate = function(dat) {
	var idx = this.getIndex(dat);

	if (this.parent) {
		var sameMonth = true;

		if (this.selectedDates.length == 1) {
			sameMonth = (this.selectedDates[0][1] == this.pageDate.getMonth() + 1);
		}

		/* If the cell is the last or the first, rendering a new display */
		if (idx == -1 || !sameMonth) {
			this.parent.setMonth(dat.getMonth());
			this.parent.setYear(dat.getFullYear());
			this.parent.render();
		} else {
			this.selectCell(idx);
		}
		return true;
	} else {
		/* If the cell is the last or the first, rendering a new display */
		if (idx == -1) {
			this.setMonth(dat.getMonth());
			this.setYear(dat.getFullYear());
			this.render();
		} else {
			this.selectCell(idx);
		}
		return true;
	}
	return false;
};

/**
 * Yahoo method override.
 */
SweetDevRia.SimpleCalendar.prototype.wireCustomEvents = function() {
	/**
	 * 
	 * @param	e		The event
	 * @param	cal		A reference to the calendar passed by the Event utility
	 */
	this.doSelectCell = function(e, cal) {
		// Component is active !
		cal.setActive(true);

		var cell = this;
		var index = cell.index;
		var d = cal.cellDates[index];
		var date = new Date(d[0],d[1]-1,d[2]);
		
		if (! cal.isDateOOM(date) && ! YAHOO.util.Dom.hasClass(cell, cal.Style.CSS_CELL_RESTRICTED) && ! YAHOO.util.Dom.hasClass(cell, cal.Style.CSS_CELL_OOB)) {
			var link = null;
			if (cal.Options.MULTI_SELECT) {
				link = cell.getElementsByTagName("A")[0];
				link.blur();
				
				var cellDate = cal.cellDates[index];
				var cellDateIndex = cal._indexOfSelectedFieldArray(cellDate);
				
				if (cellDateIndex > -1) {	
					cal.deselectCell(index);
				} else {
					cal.selectCell(index);
				}	
				
			} else {
				link = cell.getElementsByTagName("A")[0];
				link.blur();

			cal.selectCell(index);
		}
		}
		cal.fillDateInfields();
		if (!cal.Options.MULTI_SELECT) {
			cal.close();
		}
	};
};