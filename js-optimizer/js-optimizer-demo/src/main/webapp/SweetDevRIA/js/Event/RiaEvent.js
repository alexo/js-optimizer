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
 * @class event class of SweetDevRia
 * @constructor
 * @private
 */ 
SweetDevRia.RiaEvent = function(type, idSrc, params) {
	this.type = type;
	this.idSrc = idSrc;
	this.params = params;
	this.sendServer = false;
	
	for (var id in this.params) {
		if ((id != "type") && (id != "idSrc") && (id != "params")) {
			this [id] = this.params [id];		
		}
	}
};

SweetDevRia.RiaEvent.RIA_EVENT_IDSRC_ATTR = "idSrc";
SweetDevRia.RiaEvent.RIA_EVENT_TYPE_ATTR = "type";
SweetDevRia.RiaEvent.PARAM_TAG = "param";
SweetDevRia.RiaEvent.PARAM_TAG_ID_ATTR = "id";
SweetDevRia.RiaEvent.KEYBOARD_TYPE 		= 1;
SweetDevRia.RiaEvent.MOUSE_TYPE 		= 2;
SweetDevRia.RiaEvent.APPLICATION_TYPE 	= 3;
SweetDevRia.RiaEvent.COPY_TYPE 			= 4;
SweetDevRia.RiaEvent.CUT_TYPE 			= 5;
SweetDevRia.RiaEvent.PASTE_TYPE 		= 6;
SweetDevRia.RiaEvent.INIT_TYPE 			= 7;
SweetDevRia.RiaEvent.OPEN_EDIT_TYPE 	= 9;
SweetDevRia.RiaEvent.CLOSE_EDIT_TYPE 	= 10;
SweetDevRia.RiaEvent.HASH_TYPE 			= 11;
SweetDevRia.RiaEvent.CLOSE_WINDOW_TYPE 	= 12;
SweetDevRia.RiaEvent.MINIMIZE_WINDOW_TYPE= 13;
SweetDevRia.RiaEvent.MAXIMIZE_WINDOW_TYPE= 14;
SweetDevRia.RiaEvent.RESTORE_WINDOW_TYPE = 15;
SweetDevRia.RiaEvent.SELECT_ALL = 16;

SweetDevRia.RiaEvent.CHANGE_VALUE_TYPE 	= "changeValue";  
SweetDevRia.RiaEvent.LOAD_NODE 			= "loadNode";
SweetDevRia.RiaEvent.SETTER_TYPE = "setter";

SweetDevRia.RiaEvent.prototype.toJson = function() {
	return this.toJSONString ();
};