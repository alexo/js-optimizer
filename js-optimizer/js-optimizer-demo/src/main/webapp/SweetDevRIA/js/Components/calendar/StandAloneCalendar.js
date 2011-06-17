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
 * RIA Stand Alone calendar implementation.
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
SweetDevRia.StandAloneCalendar = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.init(id, containerId, monthyear, selected);
	}
	superClass(this, SweetDevRia.BaseCalendar, id, "CalendarStandAlone");
};

/* Extending SweetDevRia.BaseCalendar */
extendsClass(SweetDevRia.StandAloneCalendar, SweetDevRia.BaseCalendar);

/**
 * No method "select" for this component.
 */
SweetDevRia.StandAloneCalendar.prototype.select = null;

/**
 * No method "setActive" for this component.
 */
SweetDevRia.StandAloneCalendar.prototype.setActive = null;

/**
 * No method "focus" for this component.
 */
SweetDevRia.StandAloneCalendar.prototype.focus = null;

SweetDevRia.StandAloneCalendar.prototype.wireCustomEvents = function() {

	/**
	 * No date selection on stand alone calendar.
	 * @param	e		The event
	 * @param	cal		A reference to the calendar passed by the Event utility
	 */
	this.doSelectCell = function(e, cal) {		
		null;
	};

	/**
	 * No over.
	 * @param	e		The event
	 * @param	cal		A reference to the calendar passed by the Event utility
	 * @private
	 */
	this.doCellMouseOver = function(e, cal) {
		null;
	};

	/**
	 * No over.
	 * @param	e		The event
	 * @param	cal		A reference to the calendar passed by the Event utility
	 * @private
	 */
	this.doCellMouseOut = function(e, cal) {
		null;
	};
};
