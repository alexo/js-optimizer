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
* @class Browser
* @constructor
* Object determining the browser type (IE/FF) and version
*/
SweetDevRia.Browser = function() {

	var ua, s, i;
	
	this.isIE    = false;  // Internet Explorer
	this.isNS    = false;  // Netscape
	this.version = null;

	ua = navigator.userAgent;

    s = "MSIE";
	if ((i = ua.indexOf(s)) >= 0){
		this.version = parseFloat(ua.substr(i + s.length));
	}

	s = "Netscape6/";
	if ((i = ua.indexOf(s)) >= 0){
		this.version = parseFloat(ua.substr(i + s.length));
	}

	// Treat any other "Gecko" browser as NS 6.1.
	s = "Gecko";
	if ((i = ua.indexOf(s)) >= 0){
		this.version = 6.1;
	}

    if (document.all){
    	this.isIE = true; 
    }else{
    	this.isNS = true;
    }
};

var browser = new SweetDevRia.Browser();


//Convertion des dates

function dateToIsoDateString(date){
		var year = new String(date.getFullYear());
		var month = new String(date.getMonth()+1);
		if(month.length == 1){
			month = "0" + month;
		}
		var day = new String(date.getDate());
		if(day.length == 1){
			day = "0" + day;
		}
		return "RIA_TYPE_DATE_ISO(" + year + month + day +")";	
}