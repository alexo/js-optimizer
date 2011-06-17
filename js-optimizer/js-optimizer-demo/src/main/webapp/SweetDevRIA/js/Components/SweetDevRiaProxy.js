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
 *
 */

/**
 * @class client proxy of SweetDevRia
 * @constructor
 * @private
 */ 
function SweetDevRiaProxy (id) {
	if (id) {
		this.base = SweetDevRia.EventManager;
		this.base ();
		
		this.id = id;
	}
}


SweetDevRiaProxy.SWEETDEV_RIA_PROXY_ID = "__SweetDEV_RIA_Proxy";

SweetDevRiaProxy.prototype = new SweetDevRia.EventManager;
SweetDevRiaProxy._instance = new SweetDevRiaProxy (SweetDevRiaProxy.SWEETDEV_RIA_PROXY_ID);
SweetDevRiaProxy.getInstance = function () {
	return SweetDevRiaProxy._instance;
};

SweetDevRiaProxy.prototype.handleEvent = SweetDevRiaProxy_handleEvent;


function SweetDevRiaProxy_handleEvent (evt) {
	if (evt !== null && evt.sendServer !== false) {
		SweetDevRia.ComHelper.fireEvent (evt);
	}
	
	return true;
}