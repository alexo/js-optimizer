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
* This is the Hookeable component "interface" 
* @param {String} id Id of this hookeable SweetDEV RIA component
* @constructor
*/
SweetDevRia.Hookeable = function(id){
	this.id = id;
	this.hooker = null;
};

/**
* Every hookeable component MUST override this method to get closed on parent request
*/
SweetDevRia.Hookeable.prototype.close = function(){
	SweetDevRia.log.error("Component id "+this.id+" does not override the close function (called by any parent component).");
};

/**
* Return the hooker of a component, or null if none have been computed or found
*/
SweetDevRia.Hookeable.prototype.getHooker = function(){
	return this.hooker;
};


/**
* Function trying to hook (initializing the hook) for a specific HTML Element
* @param {HTMLElement} el the element to start from.
*/
SweetDevRia.Hookeable.prototype.tryHooking = function(el){
    this.hooker = SweetDevRia.Hookeable.searchHooker(el);
	if(this.hooker != null){
		this.hooker.hook(el.id);
	}
};


/**
* Recursiv function looking for a hooker from a specific HTML Element, assuming Hookers are registered in SweetDevRia according to their HTML id elements.
* @static 
* @param {HTMLElement} el the element to check
* @return the closest SweetDevRia Hooker for this HTML element, null if none
* @type Hooker
*/
SweetDevRia.Hookeable.searchHooker = function(el){
	var parent = el.parentNode;

	if(parent == document.body){
		return null;
	}
	if(SweetDevRia.$(parent.id) && SweetDevRia.$(parent.id).isHooker){
		return SweetDevRia.$(parent.id); 
	}
	return SweetDevRia.Hookeable.searchHooker(parent);
};



/**
* This is the Hooker component class 
* @constructor
*/
SweetDevRia.Hooker = function(){
	this.hookedIds = new Array();
	this.isHooker = true;
};

/**
* Hook a SweetDEV RIA component to this hooker
* @param {String} id the id of the SweetDEV RIA component
*/
SweetDevRia.Hooker.prototype.hook = function(id){
	this.hookedIds.push(id);
};

/**
* Close all the SweetDEV RIA components hooked to this one.
*/
SweetDevRia.Hooker.prototype.closeHooked = function(){
	for(var i=0;i<this.hookedIds.length;++i){
		var id=this.hookedIds[i]; 
		if(SweetDevRia.$(id)){
			SweetDevRia.$(id).close();
		}
	}
};