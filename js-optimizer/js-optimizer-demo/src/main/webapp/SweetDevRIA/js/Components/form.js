/*
 * 
 * connection a l action en passant par le proxy : les valeurs sont ds la request et on forward ou include vers l action. 
 * 						idee : include et zoneId pour afficher le resultat
 * mise a jour de valeur, kelle formalisme :  champ json updateValues  -> update automatique des values
 * envoi ajax des valeurs
 * 
 */



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
 * @class Form
 * @constructor
 * @param {String} 	id Identifier of the form component
 */ 
SweetDevRia.Form = function(id){

	superClass (this, SweetDevRia.RiaComponent, id, SweetDevRia.Form.prototype.className);

	this.formId = null;
	this.action = null;
	this.targetZoneId = null;
};

extendsClass(SweetDevRia.Form, SweetDevRia.RiaComponent);

/**
 * Name of the class
 * @type String
 */
SweetDevRia.Form.prototype.className = "SweetDevRia.Form";

SweetDevRia.Form.INPUT_TYPE = 0;
SweetDevRia.Form.SELECT_TYPE = 1;
SweetDevRia.Form.RADIO_TYPE = 2;
SweetDevRia.Form.CHECKBOX_TYPE = 3;
SweetDevRia.Form.TEXTAREA_TYPE = 4;
SweetDevRia.Form.RIA_CALENDAR_TYPE = 5;
SweetDevRia.Form.RIA_COMBOMULTI_TYPE = 6;
SweetDevRia.Form.RIA_SUGGEST_TYPE = 7;

/**
 * Type of event fire when the form is submitted
 */
SweetDevRia.Form.SUBMIT_EVENT = "submit";



/**
 * This method is called before submit the form component 
 * To be overridden !!
 * @param {String} action. Optional new action parameter. 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Form.prototype.beforeSubmit  = function(action){  /* override this */ return true;  };

/**
 * This method is called after submit the form component 
 * @param {String} action. Optional new action parameter. 
 * To be overridden !!
 */
SweetDevRia.Form.prototype.afterSubmit = function(action){  /* override this */ };



/**
 * Submit the form component.
 * @param {String} action. Optional new action parameter. 
 * @private
 */
SweetDevRia.Form.prototype.submit = function(action) {
	if (this.beforeSubmit (action)) {
		var myForm = document.getElementById (this.formId); 

		SweetDevRia.Form.ajaxFormSubmit (myForm, action, this.targetZoneId); 
		
		this.afterSubmit (action);
		
		this.fireEventListener (SweetDevRia.Form.SUBMIT_EVENT);
	}
};

SweetDevRia.Form.prototype.setAction = function(action) {
	this.action = action;
};

SweetDevRia.Form.prototype.setTargetZoneId = function(targetZoneId) {
	this.targetZoneId = targetZoneId;
};

SweetDevRia.Form.prototype.setFormId = function(formId) {
	this.formId = formId;
};

SweetDevRia.Form.ajaxFormSubmit = function (form, action, targetZoneId) {
	if (form == null) {
		return;
	}

	if (action == null) {
		action = form.getAttribute ("action"); 
	}

	var values = {};
	for (var i = 0; i < form.elements.length; i++) {
		var elem = form.elements [i];
		var name = elem.name;
		if (name) {
			values [name] = SweetDevRia.Form.getValue (name);
		}
	}

	values ["__RiaPageId"] = window[SweetDevRia.ComHelper.ID_PAGE];
	SweetDevRia.ComHelper.call (action, values, function () {
		SweetDevRia.log.debug (this.responseText);

		if (targetZoneId != null)  {
			var zone = SweetDevRia.$ (targetZoneId);
			if (zone) {
				zone.onCallServer ({"data":this.responseText});
			}	
		}
	});
}


/**
 * This method is used to get a component by its name. We search firstly a SweetDEV RIA component and if not, an html component
 * @param {String} names Searched component names (ex, "id1,id2")
 * @return An array of component associated with these identifiants
 * @type array
 * @private
 */
SweetDevRia.Form.getComponents = function (names) {
	 var names = names.split(",");
	 var comps = [];
	 for (var i = 0; i < names.length; i++) {
		 var name = names[i];
		 var comp = SweetDevRia.Form.getComponent (name);

		 if (comp != null) {
			comps.add (comp);
		 }
	 }
	 return comps;
};

SweetDevRia.Form.getComponent = function (name) {
	 var comp = SweetDevRia.$ (name);

	 if (comp == null) {
		comp = document.getElementsByName (name)

		 if (!(comp && comp.length && comp[0].type && comp[0].type.toLowerCase() == "radio")) {
		 	comp = comp [0];
		 }
	 }

	 return comp;
};

/**
 * Return the component type (ex : input, select, radio, checkbox, calendar, comboMulti)
 * @param {Object} comp Component to return type
 * @return component type (ex : input, select, radio, checkbox, calendar, comboMulti)
 * @type int
 * @private
 */
SweetDevRia.Form.getType = function (comp) {
	var type = null;

	 if (comp.isRiaComponent) {
	 	var className = comp.className;

		 if (className == "CalendarBase") {
			 type =  SweetDevRia.Form.RIA_CALENDAR_TYPE;
		 }
		 else if (className == "SweetDevRia.ComboMulti") {
			 type =  SweetDevRia.Form.RIA_COMBOMULTI_TYPE;
		 }		 
		 else if (className == "SweetDevRia.Suggest") {
			 type =  SweetDevRia.Form.RIA_SUGGEST_TYPE;
		 }		 
		
	 }
	 else {
		 var nodeName = comp.nodeName;

		 if (nodeName) {
			 if (nodeName.toLowerCase() == "input") {
			 	var type = comp.type;
				 if (type == "text" || type == "password") {
					 type =  SweetDevRia.Form.INPUT_TYPE;
				 }
				 else if (type == "radio") {
					 type =  SweetDevRia.Form.RADIO_TYPE;
				 }
				 else if (type == "checkbox") {
				 	type =  SweetDevRia.Form.CHECKBOX_TYPE;
				 }
			 }
			 else if (nodeName.toLowerCase() == "textarea") {
			 	type =  SweetDevRia.Form.TEXTAREA_TYPE;
			 }
			 else if (nodeName.toLowerCase() == "select") {
				type =  SweetDevRia.Form.SELECT_TYPE;
			}
		 }
		 else {
			 if (comp && comp.length && comp[0].type && comp[0].type.toLowerCase() == "radio") {
				 type =  SweetDevRia.Form.RADIO_TYPE;
		 	}
		 }
	}
	
	return type;
};

/**
 * Return the component value
 * @param {String} name component name  which we want the value
 * @return The source component value
 * @type String
 * @private
 */
SweetDevRia.Form.getValue = function (name) {
	var value = null;
	
	var srcs = SweetDevRia.Form.getComponents (name);
	
	var src = srcs [0];

	var type = SweetDevRia.Form.getType (src);

	switch (type) {
		case SweetDevRia.Form.INPUT_TYPE :
		case SweetDevRia.Form.TEXTAREA_TYPE :
			value =  src.value;
			break;
		case SweetDevRia.Form.SELECT_TYPE :
			if(src.multiple) {
				value = [];
			}				
			var options = src.options;
			for (var j  =0; j < options.length; j++) {
				var opt = options [j];
				if (opt.selected) {
					if(src.multiple) {
						value.add (opt.value);
					}
					else {
						value =  opt.value;
						break;
					}
				}	
			}

			break;
		case SweetDevRia.Form.RADIO_TYPE :
			var radios = document.getElementsByName (name);

			for (var j = 0; j < radios.length; j ++) {
				if (radios[j].checked) {
					value =  radios[j].value;
				}
			}

			break;
		case SweetDevRia.Form.CHECKBOX_TYPE :

			if (src.checked) {
				value =  src.value;
			}
			else {
				value =  null;
			}

			break;
		case SweetDevRia.Form.RIA_CALENDAR_TYPE :
			value =  src.getSelectedDates();

			break;
		case SweetDevRia.Form.RIA_COMBOMULTI_TYPE :
			
			value = src.arrSelectedItems;
			
			break;
		case SweetDevRia.Form.RIA_SUGGEST_TYPE :
			
			value = src.selectedItemsIds;
			
			break;
		default:break;
	}

	return value;
};


/**
 * Reset the component value
 * @param {Component} comp component to reset
 * @private
 */
SweetDevRia.Form.resetComponent = function (comp) {
	var type = SweetDevRia.Form.getType (comp);
	switch (type) {
		case SweetDevRia.Form.INPUT_TYPE :
		case SweetDevRia.Form.TEXTAREA_TYPE :
			comp.value = "";
			break;
		case SweetDevRia.Form.SELECT_TYPE :

			var options = comp.options;
			for (var j  =0; j < options.length; j++) {
				options[j].selected = false;
			}

			break;
		case SweetDevRia.Form.RADIO_TYPE :
			for (var j = 0; j < comp.length; j ++) {
				comp[j].checked = false;
			}

			break;
		case SweetDevRia.Form.CHECKBOX_TYPE :
			comp.checked = false;
			break;
		case SweetDevRia.Form.RIA_CALENDAR_TYPE :
		
			comp.resetCalendar ();

			break;
		case SweetDevRia.Form.RIA_COMBOMULTI_TYPE :
			
			comp.clearResults ();
			comp.suppressItems ();

			var domInput  = document.getElementById (comp.domInput);
			if (domInput) {
				domInput.value ="";
			}

			if (comp.enabledButton) {
				comp.enabledButton.style.display = (comp.arrSelectedItems.length > 0) ? "" : "none";
			}
			if (comp.disabledButton) {
				comp.disabledButton.style.display = ! (comp.arrSelectedItems.length > 0) ? "" : "none";
			}


			break;
		case SweetDevRia.Form.RIA_SUGGEST_TYPE :
		
			comp.unselectAll ();

			break;		
			default:break;
	}
};


/**
 * Set the value of a component value
 * @param {component} comp Component to set
 * @param {String} value the new value to set
 * @private
 */
SweetDevRia.Form.setValue = function (comp, value) {
	var type = SweetDevRia.Form.getType (comp);

	switch (type) {
		case SweetDevRia.Form.INPUT_TYPE :
		case SweetDevRia.Form.TEXTAREA_TYPE :
			comp.value = value;

			break;
		case SweetDevRia.Form.SELECT_TYPE :
			
			var options = comp.options;
			for (var j  =0; j < options.length; j++) {
				var opt = options [j];
				if (opt.text == value) {
					opt.selected = true;
				}
				else {
					opt.selected = false;
				}
			}

			break;
		case SweetDevRia.Form.RADIO_TYPE :
			var radio = document.getElementById (id);
			var radios = document.getElementsByName (radio.name);
			
			for (var j = 0; j < radios.length; j ++) {
				if (radios[j].value == value) {
					radios[j].checked = true;
				}
				else {
					radios[j].checked = false;
				}
			}
			
			//return null; //JSLINT fix				
			break;
		case SweetDevRia.Form.CHECKBOX_TYPE :

			if (comp.value == value) {
				comp.checked = true;
			}
			else {
				comp.checked = false;
			}

			break;
		case SweetDevRia.Form.RIA_CALENDAR_TYPE :

			// If value is a date, we parse it
			if (value ["time"] && value ["time"]["time"]) {
				value = new Date (value ["time"]["time"]);
			}

			comp.setNewDateAndFillDateInFields (value);
			
			break;
		case SweetDevRia.Form.RIA_COMBOMULTI_TYPE :
			for (var i = 0; i < value.length; i++) {
				var id = value[i][0];

				comp.clickOnItem (id, value[i][1], null, true);
			}
			
			break;
		case SweetDevRia.Form.RIA_SUGGEST_TYPE :
			for (var i = 0; i < value.length; i++) {
				var id = value[i];
				var item = this.getSelectedItemFromId(id);
				
				if (item) {
					comp.setItemSelected (item);
				}
			}
			
			break;
			
		default:break;
	}
};






