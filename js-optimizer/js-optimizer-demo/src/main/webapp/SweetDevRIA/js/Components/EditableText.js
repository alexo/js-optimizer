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
 * @class allowing edition of a text on double click
 * @constructor
 * @private
 * @extends RiaComponent
 * @base RiaComponent
 */ 
SweetDevRia.EditableText = function(id) {
	if (id) {
		superClass (this, SweetDevRia.RiaComponent, id, "EditableText");
	  		
		this.elements = {};
	  		
		this.activeElement = null;
	}
};

extendsClass(SweetDevRia.EditableText, SweetDevRia.RiaComponent);

/**
 * Unique EditableText JavaScript instance id. 
 * @type String
 * @static
 */
SweetDevRia.EditableText.ID = "__EditableText";

/**
 * Default edit zone suffix, if none are declared. Used for tooltip.
 * @type String
 * @static
 */
SweetDevRia.EditableText.EDIT_ZONE = "_editZone";
 
/**
 * Default value if the content is empty. This enable the click into the editable text.
 * @type String
 * @static
 */ 
SweetDevRia.EditableText.EMPTY_VALUE = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

/**
 * Unique instance of the EditableText component. Singleton.
 * @type EditableText
 * @static
 * @private
 */ 
SweetDevRia.EditableText._instance = new SweetDevRia.EditableText (SweetDevRia.EditableText.ID);

/**
 * Get the unique instance of the EditableText component. Singleton.
 * @type EditableText
 * @return the singleton instance of this editable text.
 * @static
 */ 
SweetDevRia.EditableText.getInstance = function () {
	return SweetDevRia.EditableText._instance;
};

//TODO
SweetDevRia.EditableText.prototype.exist = function(id) {
	return (this.elements [id] !== null && this.elements [id] !== undefined);
};

/**
 * Method called on page load. Initializes the EditableText components in the page.
 * @private
 */ 
SweetDevRia.EditableText.prototype.init = function() {
	var editableText = SweetDevRia.EditableText.getInstance();

	for (var id in editableText.elements) {
		var elem = SweetDevRia.DomHelper.get (editableText.elements [id][0]);
		editableText.initElement (elem, editableText.elements [id][4]);
	}
};

/**
 * Initializes an EditableText at page load
 * @param {HTMLElement} elem the element in the dom
 * @param {Array} listenersId a list of listeners id
 * @private
 */ 
SweetDevRia.EditableText.prototype.initElement  = function(elem, listenersId) {
	var editableText = SweetDevRia.EditableText.getInstance();
	
	if (elem && ! elem.isInitialized) {

		SweetDevRia.EventHelper.addListener (elem, "dblclick", SweetDevRia.EditableText.dblClickHandler);

		if (listenersId) {
			for (var i = 0; i < listenersId.length; i++) {
				var listener = SweetDevRia.getComponent (listenersId [i]);
				if (listener) {
					this.addEventListener (listener);			
				}
			}
		}

		elem.editComp = SweetDevRia.EditableText.getEditComp (elem);
		elem.type = SweetDevRia.Form.getType (elem.editComp);

		var value = editableText.elements [elem.id][2];

		if (value === null || value == undefined || value === ""){
			value = SweetDevRia.EditableText.getEditCompValue (elem);
		}
		
		if (value === null || value === "") {
			value = "Click here to enter a value.";
		}
		
		SweetDevRia.EditableText.setTextValue (elem, value);
		
		elem.isInitialized = true;
	}
};

/**
 * Adds an editable text component to the manager.
 * @param {String} id the id of the component to add
 * @param {String} editComp the component's id to edit
 * @param {String} value the initial value of the component
 * @param {String} srcId Optional, an id source creating this editableText.
 * @param {Array} listenersId Optional, a list of id to listen to this component
 * @param {boolean} init Optional, A boolean indicating if the component should be initialized right away.
 */ 
SweetDevRia.EditableText.add  = function(id, editComp, value, srcId, listenersId, init) {
	
	var editableText = SweetDevRia.EditableText.getInstance();
	if (! srcId) {
		srcId = id;		
	}
	editableText.elements [id] = [id, editComp, value, srcId, listenersId];
	var elem = SweetDevRia.DomHelper.get (id);
	elem.isInitialized = false;

	if (init || window.initialized) {
		editableText.initElement (elem, listenersId);
	}

	SweetDevRia.EventHelper.addListener (window, "load", SweetDevRia.EditableText.prototype.init);
};

/**
 * Sets a value into an editable component, and set it the focus.
 * @param {EditableElement} elem the elem to fill in
 * @param {String} value the value to set
 */ 
SweetDevRia.EditableText.setEditCompValue  = function(elem, value) {

	var comp = elem.editComp;
	var type = elem.type;

	if (type == SweetDevRia.Form.INPUT_TYPE) {
		comp.value = value;
		comp.focus ();
	}
	else if (type == SweetDevRia.Form.TEXTAREA_TYPE) {
		comp.value = value;
		comp.focus ();
	}
	else if (type == SweetDevRia.Form.RADIO_TYPE) {
	   for (var i = 0; i < comp.length; i++) {
			if (comp [i].value == value) {
     				comp [i].checked = true;
				comp [i].focus ();
     			}
			}
	}
	else if (type == SweetDevRia.Form.SELECT_TYPE) {
		var options = comp.options;
       	for (var j = 0; j < options.length; j++) {
       		if (options [j].value == value) {
				options [j].selected = true;
            	}
       	}
       	comp.focus ();
	}
	else if (type == SweetDevRia.Form.RIA_CALENDAR_TYPE) {
		null;
	}
};

/**
 * Gets a value of an editable component.
 * @param {EditableElement} elem the elem to get the value
 * @type String
 * @return the component value from the editable component
 */ 
SweetDevRia.EditableText.getEditCompValue  = function(elem) {
	var comp = elem.editComp;
	var type = elem.type;

	if (type == SweetDevRia.Form.INPUT_TYPE) {
		return comp.value;
	}
	else if (type == SweetDevRia.Form.TEXTAREA_TYPE) {
		return comp.value;
	}
	else if (type == SweetDevRia.Form.RADIO_TYPE) {
	   for (var i = 0; i < comp.length; i++) {
			if (comp [i].checked) {
				var label = SweetDevRia.EditableText.getLabel (comp [i].id);
				if (label) {
      				return label;
				}
				else {				
      				return comp [i].value;
      			}
     			}
			}
	}
	else if (type == SweetDevRia.Form.SELECT_TYPE) {
		var options = comp.options;
       	for (var j = 0; j < options.length; j++) {
       		if (options [j].selected) {
				return options [j].text;
       		}
       	}
	}
	else if (type == SweetDevRia.Form.RIA_CALENDAR_TYPE) {
		if (comp.singleDateField) {
			return comp.singleDateField.value;
		}

	}
	
	return null;
};

/**
 * Gets a value of the static text component.
 * @param {EditableElement} elem the elem to get the value
 * @type String
 * @return the component value from the text component
 */ 
SweetDevRia.EditableText.getTextValue  = function(elem) {
	var comp = elem.editComp;
	var type = elem.type;

	if (type == SweetDevRia.Form.INPUT_TYPE) {
		return elem.innerHTML;
	}
	else if (type == SweetDevRia.Form.TEXTAREA_TYPE) {
		return elem.innerHTML;
	}
	else if (type == SweetDevRia.Form.RADIO_TYPE) {
	   for (var i = 0; i < comp.length; i++) {
			var label = SweetDevRia.EditableText.getLabel(comp [i].id);
			if (label === null)  {
				label = comp [i].value;
			}

			if (label == elem.innerHTML) {
     				return comp [i].value;
     			}
			}
	}
	else if (type == SweetDevRia.Form.SELECT_TYPE) {
		var options = comp.options;
       	for (var j = 0; j < options.length; j++) {
       		if (options [j].text == elem.innerHTML) {
				return options [j].value;
       		}
       	}
	}
	else if (type == SweetDevRia.Form.RIA_CALENDAR_TYPE) {
		return elem.innerHTML; // TODO : Convert to date
	}
	
	return null;
};

/**
 * Sets a value to the static text component.
 * @param {HTMLElement} elem the elem to set the value inside
 * @param {String} value the value to sets
 */ 	
SweetDevRia.EditableText.setTextValue  = function(elem, value) {
	elem.innerHTML = value;
};

/**
 * Adds the event on the editable component
 * @param {EditableElement} elem the elem to add the events on
 * @private
 */ 
SweetDevRia.EditableText.addEditCompEvent  = function(elem) {
	var comp = elem.editComp;
	var type = elem.type;

	if (type == SweetDevRia.Form.INPUT_TYPE) {
		SweetDevRia.EventHelper.addListener (comp, "blur", SweetDevRia.EditableText.blurHandler);
	}
	else if (type == SweetDevRia.Form.TEXTAREA_TYPE) {
		SweetDevRia.EventHelper.addListener (comp, "blur", SweetDevRia.EditableText.blurHandler);
	}
	else if (type == SweetDevRia.Form.RADIO_TYPE) {
		for (var i = 0; i < comp.length; i++) {
			SweetDevRia.EventHelper.addListener (comp [i], "click", SweetDevRia.EditableText.valid);
		}
	}
	else if (type == SweetDevRia.Form.SELECT_TYPE) {
		SweetDevRia.EventHelper.addListener (comp, "change", SweetDevRia.EditableText.valid);
	}
	else if (type == SweetDevRia.Form.RIA_CALENDAR_TYPE) {
		// TODO : to modify !!
		if (comp.singleDateField) {
			SweetDevRia.EventHelper.addListener (comp.singleDateField, "change", SweetDevRia.EditableText.valid);
		}
	}
};

/**
 * Find a element editable into a parent one 
 * @param {HTMLElement} parent the HTMLElement to seek into
 * @type HTMLElement
 * @return the parent node of the editable component found
 * @private
 */ 
SweetDevRia.EditableText.findEditComp  = function(parent) {
	var tagName = parent.nodeName.toLowerCase ();

	if (tagName == "select" || tagName == "textarea") {
		return parent;
	}
	else if (tagName == "input") {
		var type = parent.getAttribute ("type");

		if (type && type.toLowerCase() == "radio") {
			var name = parent.getAttribute ("name");
			return document.getElementsByName(name);
		}	
			
		if (type === null || type.toLowerCase() != "hidden") {
			return parent;
		}
	}
	else {
		var children = parent.childNodes;
		for (var i = 0; i < children.length; i++) {
			var child = children [i];
			var find = SweetDevRia.EditableText.findEditComp (child);
			
			if (find) {
				return find;
			}
		}
	}
	
	return null;
};

/**
 * Get an editable component from an editable element. 
 * @param {EditableElement} elem the element where the component must be extracted
 * @type HTMLElement
 * @return the editable component for an editabletext element
 * @private
 */ 
SweetDevRia.EditableText.getEditComp  = function(elem) {
	var editableText = SweetDevRia.EditableText.getInstance();
 	var editComp = editableText.elements [elem.id][1];
	var comp = null;

	if (editComp && editComp !== "") {
		// A edit component id exist, we search the component
		// We are looking for a SweetDevRia component
		comp = SweetDevRia.getComponent (editComp);
		
		if (comp === null || comp === undefined) {
			// We are looking for a form component by id
			comp = document.getElementById (editComp);

			if (comp === null || comp == "undefined" || (comp.getAttribute("type") && comp.getAttribute("type").toLowerCase() == "radio")) {
				// We are looking for a form component by name (ex : radios)
				comp = document.getElementsByName(editComp);
			}				
		}
	}
	else {
		// We have no id, we inspect tag children for take the first form component
		var editZoneId = elem.id + SweetDevRia.EditableText.EDIT_ZONE;
		var editZone = document.getElementById (editZoneId);
		comp = SweetDevRia.EditableText.findEditComp (editZone);
	}

	return comp;
};

/**
 * Switches an element's state
 * @param {boolean} toEdition the state to switch to
 * @param {EditableElement} elem the element to switch
 */ 
SweetDevRia.EditableText.switchElement  = function(toEdition, elem) {
	var tooltip = SweetDevRia.getComponent (elem.id+SweetDevRia.EditableText.EDIT_ZONE);

	var editZoneId = elem.id + SweetDevRia.EditableText.EDIT_ZONE;
	var editZone = document.getElementById (editZoneId);
	
	if (toEdition) {
		if (tooltip) {
			tooltip.open (elem);
		}
		else {
			editZone.style.display = "";
			elem.style.display = "none";
		}
	}
	else {
		if (tooltip) {
			/**
			 * TT 106 : setTimeout pour que le onchange se declenche
			 * 
			 */
			setTimeout (function () {
					tooltip.close ();
				}, 3);
		}
		else {
			editZone.style.display = "none";
			elem.style.display = "";
		}
	}
};

/**
 * Activate an editable text element
 * @param {EditableElement} elem the element to activate 
 * @private
 */ 
SweetDevRia.EditableText.active  = function(elem) {
	if (elem) {
		var editableText = SweetDevRia.EditableText.getInstance();
		if (editableText.exist (elem.id)) {
	       	SweetDevRia.EditableText.close ();

			var value = SweetDevRia.EditableText.getTextValue (elem);

			SweetDevRia.EditableText.switchElement (true, elem);

			if (elem.isEmptyValue == true) {
				value ="";
				elem.isEmptyValue = false;
			}
			
			SweetDevRia.EditableText.setEditCompValue (elem, value);
			
			SweetDevRia.EditableText.addEditCompEvent (elem);

			editableText.activeElement = elem;

			// Send open edit Event !
			var evt = new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.OPEN_EDIT_TYPE, editableText.id, {"compId":editableText.elements [elem.id][3], "elemId":elem.id, "value":value, "sendServer": false});

			editableText.fireEvent(evt);
		}
	}
};

/**
 * Get the label related to an HTML element's id
 * @param {String} elemId the HTML element id to get the label related
 * @type String
 * @return the label fo this HTML id
 */ 
SweetDevRia.EditableText.getLabel = function(elemId) {
	var labels = document.getElementsByTagName ("label");

	if (labels) {
		for (var i = 0; i < labels.length; i++) {
			var label = labels [i];
			if (label) {
				var forAttr = label.getAttribute("for");
				/** Hack for IE */
				if (forAttr === null){
					forAttr = label.getAttribute("htmlFor");
				}
				
				if (forAttr && forAttr == elemId) {
					return label.childNodes[0].nodeValue;
				}
			}
		}
	}
	
	return null;
};

/**
 * Validates the value of the current active element, and notify the server.
 * @private
 */ 
SweetDevRia.EditableText.valid  = function() {
	var editableText = SweetDevRia.EditableText.getInstance();
	var elem = editableText.activeElement;

    if (elem) {
		var oldValue = SweetDevRia.EditableText.getTextValue (elem);
		var newValue = SweetDevRia.EditableText.getEditCompValue (elem);

		if (newValue == "" ) {
			elem.isEmptyValue = true;
			newValue = SweetDevRia.EditableText.EMPTY_VALUE;
		}

		// Send changeValue Event !
		SweetDevRia.EditableText.setTextValue (elem, newValue);

		if (elem.isEmptyValue == true) {
			newValue = '';
		}

		if (oldValue== SweetDevRia.EditableText.EMPTY_VALUE) {
			oldValue = "";
		}

		SweetDevRia.EditableText.close ();

		var evt = new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.CHANGE_VALUE_TYPE, elem.id, {"elemId":editableText.elements [elem.id][3], "oldValue":oldValue, "newValue":newValue, "sendServer": true});
		editableText.fireEvent(evt);
	}
};

/**
 * Closes the current tooltip opened
 */ 
SweetDevRia.EditableText.close  = function() {
	var editableText = SweetDevRia.EditableText.getInstance();
     var elem = editableText.activeElement;

        if (elem) {
       	SweetDevRia.EditableText.switchElement (false, elem);

		editableText.activeElement = null;

		// Send close edit Event !
		var evt = new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.CLOSE_EDIT_TYPE, editableText.id, {"compId":editableText.elements [elem.id][3], "elemId":elem.id, "sendServer": false});
		editableText.fireEvent(evt);
	}
};

/**
 * Blur handler for editable components
 * @private
 */ 
SweetDevRia.EditableText.blurHandler  = function(evt) {
	var editableText = SweetDevRia.EditableText.getInstance();
	var elem = editableText.activeElement;

       if (elem) {
		var oldValue = SweetDevRia.EditableText.getTextValue (elem);
		var newValue = SweetDevRia.EditableText.getEditCompValue (elem);

		// Send changeValue Event !
		SweetDevRia.EditableText.setEditCompValue (elem, oldValue);

		SweetDevRia.EditableText.close ();
	}
	
	return true;
};

/**
 * Double click handler for text components
 * @private
 */ 
SweetDevRia.EditableText.dblClickHandler  = function(evt) {
	evt = SweetDevRia.EventHelper.getEvent (evt);
	var elem = evt.src;

	SweetDevRia.EditableText.active (elem);
};

/**
 * Element keyboard event handler
 * @param {Event} evt a well formed event
 * @private
 */ 
SweetDevRia.EditableText.prototype.handleEvent  = function(evt) {
	if (evt && evt.type) {
		if (evt.type == SweetDevRia.RiaEvent.KEYBOARD_TYPE) {
			if (evt.keyCode == SweetDevRia.KeyListener.ENTER_KEY) {
			  SweetDevRia.EditableText.valid ();
			}
			else if (evt.keyCode == SweetDevRia.KeyListener.ESCAPE_KEY) {
				SweetDevRia.EditableText.close();
				this.setActive(false);
				SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
				SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			}
		}
	}
	return true;
};

