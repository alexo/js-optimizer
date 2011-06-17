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
 * @class event manager class of SweetDevRia
 * @constructor
 * @private
 */ 
SweetDevRia.EventManager = function() {
	this.listeners = {};
};

/** 
  *	Add a listener of this component
  * @param {Object} listener New listener object of this component
  */
SweetDevRia.EventManager.prototype.addEventListener = function(listener) {
	if (listener) {
		this.listeners [listener.id] = listener;
	}
};

/** 
  *	Remove a listener of this component
  * @param {Object} listener listener object to removed 
  */
SweetDevRia.EventManager.prototype.removeEventListener = function(listener) {
	if (listener) {
		this.listeners [listener.id] = null;
	}		
};

/** 
  *	Fire a event to all listeners
  * @param {Object} evt event to fired
  */
SweetDevRia.EventManager.prototype.fireEvent = function(evt) {
	var type = evt.type;

	for (var id in this.listeners) {
		var listener = this.listeners [id];
		if (listener) { 
			if (this.sendEvent (listener, evt) == false){
				return false;
			}
		}

	}
	return true;
};


SweetDevRia.EventManager.prototype.sendEvent = function(listener, evt) {
	var res = true;
	if (listener.priorityHandleEvent) {
	  res = listener.priorityHandleEvent (evt);
	}
	if (res && listener.handleEvent) {
	  res = listener.handleEvent (evt);
	}
	
	return res;
};