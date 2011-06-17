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

/* 
 * @class DateFormat
 * @constructor
 */ 
SweetDevRia.DateFormat = function() {null;};

/**
 * Pattern to print dates. Default is "MM/DD/YYYY"
 * @type String
 */
SweetDevRia.DateFormat.pattern = "MM/DD/YYYY";

/**
 * Date separator. Default is "-"
 * @type String
 */
SweetDevRia.DateFormat.separator = "-";

/**
 * MultiDate separator. Default is ","
 * @type String
 */
SweetDevRia.DateFormat.multiDateSeparator = ",";

/**
 * Returns a formated date according to the specified pattern.
 * @param {int}	year	The year number.
 * @param {int}	month	The month number.
 * @param {int}	day		The day number.
 * @return returns the date in the specified pattern.
 * @type String
 */
SweetDevRia.DateFormat.getDateFromPattern = function(year, month, day) {
	if (!SweetDevRia.DateFormat.pattern || !day || !month || !year) {
		SweetDevRia.log.error("Pattern or argument(s) is/are null");
		/*TODO throw("ParseException : The data SweetDevRia.DateFormat.pattern var or one of the argument is null.");
		return null;*/
		return "";
	}
	try {
		/* Cast in number */
		year = Number(year);
		month = Number(month);
		day = Number(day);
		var result = SweetDevRia.DateFormat.pattern,
			day2Num = (day < 10) ? "0" + day : day,
			month2Num = (month < 10) ? "0" + month : month,
			year4Num = year,
			year2Num = ((year % 1000) < 10) ? "0" + (year % 1000) : year % 1000;

		result = result.replace(/DD/, day2Num);
		result = result.replace(/MM/, month2Num);
		result = result.replace(/YYYY/, year4Num);
		result = result.replace(/YY/, year2Num);	
		result = result.replace(/\//g, SweetDevRia.DateFormat.separator);
	} catch (e) {
		SweetDevRia.log.warn("Error on parsing date [" + e + "]");
	}
	return result;
};

/**
 * Returns a formated day (01, 12, ...)
 * @param {int}	day		The day number.
 * @return returns the formated day.
 * @type String
 */
SweetDevRia.DateFormat.getDay = function(day) {
	if (!day) {
		SweetDevRia.log.error("Argument is null");
		/*TODO throw("NullPointerException : The day argument is null.");
		return null;*/
		return "";
	}
	day = Number(day);
	return String((day < 10) ? "0" + day : day);
};

/**
 * Returns a formated month (01, 12, ...)
 * @param {int}	month		The month number.
 * @return returns the formated month.
 * @type String
 */
SweetDevRia.DateFormat.getMonth = function(month) {
	if (!month) {
		SweetDevRia.log.error("Argument is null");
		/*TODO throw("NullPointerException : The month argument is null.");
		return null;*/
		return "";
	}
	month = Number(month);
	return String((month < 10) ? "0" + month : month);
};

/**
 * Returns a formated year according the the specified pattern.
 * @param {int}	year 		The year number.
 * @return returns the formated year.
 * @type String
 */
SweetDevRia.DateFormat.getYear = function(year) {
	if (!year) {
		SweetDevRia.log.error("Argument is null");
		/*TODO throw("NullPointerException : The year argument is null.");
		return null;*/
		return "";
	}

	year = Number(year);
	if (SweetDevRia.DateFormat.pattern.indexOf("YYYY") != -1) {
		return String(year);
	} else {
		return String(((year % 1000) < 10) ? "0" + (year % 1000) : (year % 1000));
	}
};

/**
 * Returns a Date if the date is valid, else null.
 * @param {int}	year 		The year number.
 * @param {int}	month 		The month number.
 * @param {int}	day 		The day number.
 * @return returns the formated year or null if invalid.
 * @type Date
 */
SweetDevRia.DateFormat.getDate = function(year, month, day) {
    year = parseInt(year,10);
	month = parseInt(month,10) - 1;
    day = parseInt(day,10);

    var dat = new Date(year, month, day);

    if (dat.getDate() == day &&
        dat.getMonth() == month &&
        dat.getFullYear() == year) {
        return dat;
   }
   return null;
};

/**
 * Remove separator repetition, remove alphabetic character and add "0" on each value (day, month, year) wich contains only 1 number.
 * @param {HTMLInputTextField}	formField	HTML input text field.
 */
SweetDevRia.DateFormat.prepareDateField = function (formField) {
	if (formField && formField.value.length > 0) {
		var sep = "";
		// Remove multiple separator
		var separatorRegEx = new RegExp(SweetDevRia.DateFormat.separator + "+", "g");
		formField.value = formField.value.replace(separatorRegEx, SweetDevRia.DateFormat.separator);
		// Remove alphabetic character
		formField.value = formField.value.replace(/[A-Z]+/ig, "");

		var tabDate = formField.value.split(SweetDevRia.DateFormat.separator);
		if (tabDate) {
			formField.value = "";
			for (var i = 0; i < tabDate.length; i++) {
				if (tabDate[i].length == 1) {
					tabDate[i] = "0" + tabDate[i];
				}
				formField.value += sep + tabDate[i];
				sep = SweetDevRia.DateFormat.separator;
			}
		}
	}
};

/**
 * Returns the date value from text representation according to the DateFormat.pattern.
 * @param {string}	value 	The date representation
 * @return returns the date value or null
 * @type Date
 */
SweetDevRia.DateFormat.parseDate = function (value) {
    if (value.length === 0) {
        return new Date();
    }

    var day, month, year, yearPattern = 4;
    var format = SweetDevRia.DateFormat.pattern.toUpperCase();

    var posDay = format.indexOf("DD");
    if (posDay >= 0) {
        day = value.substring(posDay, posDay+2);
        var posMonth = format.indexOf("MM");
        if (posMonth >=0 ){
            month = value.substring(posMonth, posMonth+2);
            var posYear = format.indexOf("YYYY");
            if (posYear == -1) {
            	posYear = format.indexOf("YY");
            	yearPattern = 2;
            }
            if (posYear >= 0){
                year = value.substring(posYear, posYear + yearPattern);
                if (yearPattern == 2) {
                	year = "20" + year;
                }
                var t=/^[0-9]*$/;
                if (t.test(year) && t.test(month) && t.test(day)){
                    year = parseInt(year,10);
                    month= parseInt(month,10)-1;
                    day = parseInt(day,10);
                    var dat = new Date(year,month,day);
                    if (dat.getDate() == day &&
                        dat.getMonth() == month &&
                        dat.getFullYear() == year){

                        return dat;
                    }
                }
            }
        }
    }
    return null;
};