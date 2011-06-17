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
* Accordion
* @constructor
* @extends RiaComponent
* @base RiaComponent
* @param {String} id 	The id of the accordion
*/
SweetDevRia.Accordion = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Accordion");
	this.id = id;
	this.items = {};
	this.openedItem = undefined;
};

extendsClass(SweetDevRia.Accordion, SweetDevRia.RiaComponent);


/**
* Onload initialization.
* Open a default item on demand
* @private
*/
SweetDevRia.Accordion.prototype.initialize = function(){
	if(this.openAtStartupId){
		this.open(this.openAtStartupId);
	}
	return true;
};

/**
* Adds an item to the accordion, as hidden.
* @param {AccordionItem} accordionItem	The accordion item to add
* @private
*/
SweetDevRia.Accordion.prototype.addItem = function(accordionItem){
	this.items[accordionItem.id] = accordionItem;
	SweetDevRia.Accordion.hide( accordionItem.id );
};

/**
* Get an accordion item according to its id
* @param {String} id	The accordion item id
* @return the accordion item object
* @type AccordionItem
* @private
*/
SweetDevRia.Accordion.prototype.getItem = function(accordionItemId){
	return this.items[accordionItemId];
};

/**
* Open an accordion item. The actual opened item will be closed.
* @param {String} accordionItemId 	The accordion item id to open
*/
SweetDevRia.Accordion.prototype.open = function(accordionItemId){
	if(this.getOpenedItem() != undefined){
		if(this.getOpenedItem() == this.items[accordionItemId]){
			return;
		}
		else{
			this.closeActive();
		}
	}
	this.items[accordionItemId].open();
	this.openedItem = this.items[accordionItemId];
};

/**
* Close an accordion item
* @param {AccordionItem} accordionItem 	The accordion item to close
* @private
*/
SweetDevRia.Accordion.prototype.close = function(accordionItem){
	accordionItem.close();
};

/**
* Close the active accordion item
*/
SweetDevRia.Accordion.prototype.closeActive = function(){
	this.close(this.getOpenedItem());
};

/**
* Return the current opened accordion item
* @return the current opened accordion item
* @type AccordionItem
* @private
*/
SweetDevRia.Accordion.prototype.getOpenedItem = function(){
	return this.openedItem;
};


/**
* Return whether an item is opened or not.
* @param {String} accordionItemId	The id to check
* @return true if the accordion item is open, false otherwise
* @type boolean
*/
SweetDevRia.Accordion.prototype.isOpen = function(accordionItemId){
	return this.items[accordionItemId].isOpen();
};


/*--------------------- Accordion Item -------------------------*/


/**
* @class
* AccordionItem
* @constructor
* @param {String} id 		the id of the item
* @param {String} title 	the displayed title of the item
* @private
*/
SweetDevRia.AccordionItem = function(id, title){
	this.id = id;
	this.title = title;
	this.isOpen = false;
};

/**
* Return whether this item is opened or not.
* @return true if this item is open, false otherwise
* @type boolean
*/
SweetDevRia.AccordionItem.prototype.isOpen = function(){
	return this.isOpen;
};

/**
* Open this item, using Yahoo animation
*/
SweetDevRia.AccordionItem.prototype.open = function(){
	SweetDevRia.DomHelper.verticalShow(SweetDevRia.DomHelper.get(this.id), 0.4);
};

/**
* Close this item, using Yahoo animation
*/
SweetDevRia.AccordionItem.prototype.close = function(){
	SweetDevRia.DomHelper.verticalHide(SweetDevRia.DomHelper.get(this.id), 0.4);
};

/**
* Show a DOM component
* @param {String} id Id of component to show
* @private
*/
SweetDevRia.Accordion.show = function (id) {
	var comp = document.getElementById(id);
	if (comp) {
		comp.style.display = "block";
	}
};

/**
* Hide a DOM component
* @param {String} id Id of component to hidde
* @private
*/
SweetDevRia.Accordion.hide = function (id) {
	var comp = document.getElementById(id);
	if (comp) {
		comp.style.display = "none";
	}
};