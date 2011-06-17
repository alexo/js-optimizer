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
 * @class Ajax object pool
 * @constructor
 * @private
 */ 
SweetDevRia.AjaxPooler = function () {

	/** contains multiples Ajax instances */
	this.pooler = {};
	this.poolSize = 0;
	
};

SweetDevRia.AjaxPooler._instance = new SweetDevRia.AjaxPooler ();

SweetDevRia.AjaxPooler.PREFIXE_ID = "AjaxInstance_";


/**
 * Get next available Ajax object from pool, or create a new one if none are available
 * @return An available Ajax object
 * @type Ajax
 */
SweetDevRia.AjaxPooler.getInstance = function() {
	var pooler = SweetDevRia.AjaxPooler._instance;
	
	/** Search for an available Ajax object */
	for (var i in pooler.pooler) {
		var ajax = pooler.pooler [i];	
		
		/** if it's available, return it */
		if (ajax.readyState == 4) {
			ajax.reset ();
			return ajax;			
		}
	}
	
	/** if no instance was found, create a new Ajax object */
	var newAjax = new SweetDevRia.Ajax (SweetDevRia.AjaxPooler.PREFIXE_ID + pooler.poolSize);
	
	/** record object in pool */
	pooler.pooler [newAjax.id] = newAjax;
	pooler.poolSize ++;
	
	/** return this Ajax object */
	return newAjax;
};