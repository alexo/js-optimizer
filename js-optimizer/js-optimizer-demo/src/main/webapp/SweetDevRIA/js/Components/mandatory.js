/** ------------------------------------
 * SweetDEV RIA library
 * Copyright [2006] [Ideo Technologies]
 * ------------------------------------
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * For more information, please contact us at:
 * Ideo Technologies S.A
 * 124 rue de Verdun
 * 92800 Puteaux - France
 *
 * France & Europe Phone : +33 1.46.25.09.60
 * USA & Canada Phone : (201) 984-7514
 *
 * web : http://www.ideotechnologies.com
 * email : Sweetdev_ria_sales@ideotechnologies.com
 *
 *
 * @version 2.2-SNAPSHOT
 * @author Ideo Technologies
 */

SweetDevRia.Mandatory = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Mandatory");
	
	this.formId = null;
	this.ids = {};
	this.type = SweetDevRia.Mandatory.AND_TYPE;
};

extendsClass(SweetDevRia.Mandatory, SweetDevRia.RiaComponent);

SweetDevRia.Mandatory.AND_TYPE = 0;
SweetDevRia.Mandatory.OR_TYPE = 1;

/**
 * This method is automaticly called at the page load
 * @private
 */
SweetDevRia.Mandatory.prototype.initialize = function () {
	if (this.formId) {
		var form = document.getElementById (this.formId);

		if (form) {
			YAHOO.util.Event.addListener(form, "submit", this.onControlListener, this);
		}
	}
};

/**
 * Return all Mandatory controls associated with a formular id.
 * @param {String} formId formular id to search
 * @return All mandatory controls associated with a formular id.
 * @type Array
 */
SweetDevRia.Mandatory.getFormControl = function (formId) {
	var controls = [];
	var mandatories = SweetDevRia.getAllInstances("SweetDevRia.Mandatory");
	if (mandatories) {
		for (var i = 0; i < mandatories.length; i++){
			var mandatory = SweetDevRia.$ (mandatories [i]);
			if (mandatory && mandatory.formId == formId) {
				controls.add (mandatory);
			}
		}
	}

	return controls;
};

/**
 * Test if formular all mandatory constraints are respected
 * @param {String} formId formulare id to test
 * @return true if formular all mandatory constraints are respected, else false
 * @type boolean
 */
SweetDevRia.Mandatory.testFormMandatory = function (formId) {
	var mandatories = SweetDevRia.Mandatory.getFormControl (formId);
	for (var i = 0; i < mandatories.length; i++){
		var mandatory = mandatories [i];
		if (! mandatory.onControl ()) {
			return false;
		}
	}
	
	return true;
};

/**
 * call control method and stop event propagation if the form does't be submitted
 * @param {Event} evt
 * @param {SweetDevRia.Mandatory} mandatory
 * @private
 */
SweetDevRia.Mandatory.prototype.onControlListener = function (evt, mandatory) {
	var res = mandatory.onControl ();

	if (! res) {
		SweetDevRia.EventHelper.preventDefault (evt);
	}
	
	return res;
};

/**
 * Display all error messages
 * @param {Array} errorIds Component identifiants on error
 * @private
 */
SweetDevRia.Mandatory.prototype.displayErrors = function (errorIds) {

	for (var i = 0; i < errorIds.length; i++) {
		var id  = errorIds [i];		
		if (this.ids  [id]) {
			var messageConf = this.ids [id];
			SweetDevRia.Messenger.sendMessage (messageConf, true, id);
		}
	}
	
	if (errorIds.length > 0) {
		// send general message
		SweetDevRia.Messenger.sendMessage (this.messageConf, true, null);
	}
	else {
		SweetDevRia.Messenger.sendMessage (this.messageConf, null, null);
	}

};

/**
 * Test if all mandatory components are not null.
 * @return true if mandatory rules are ok, else false
 * @type boolean
 */
SweetDevRia.Mandatory.prototype.onControl = function () {
	var errorIds = [];
	var or = false;	
	for (var id  in this.ids) {
		if (id != "toJSONString") {
			var value = SweetDevRia.Control.getValue (id);

			if (value == null || value == "") {
				errorIds.add (id);
			}
			else {
				if (this.type == SweetDevRia.Mandatory.OR_TYPE) {
					or = true;
				}
			}	
		}
	}

	if (or) {
		errorIds = [];
	}

	this.displayErrors (errorIds);

	return (errorIds.length == 0);
};

/**
 * Add an mandatory component identifiant
 * @param {String} id New mandatory component identifiant
 * @param {Array} messageConf Optionnal error messages configuration. ex :[["loginMessage", null, true, false],  ["globalMessage", "Votre identifiant est inconnu !", true, true]]
 */
SweetDevRia.Mandatory.prototype.addMandatoryId = function (id, messageConf) {
	this.ids [id] = messageConf;
};


SweetDevRia.Mandatory.prototype.addMessage = function (messageConf) {
	this.messageConf = messageConf;
};

/**
 * Return the data property name associating of a component id using mapping map 
 * @param {Map} mapping Mapping between html element id and data property (ex : {"name":"firstName", "age":"year"} )
 * @param {String} componentId component id 
 */
SweetDevRia.Mandatory.getDataProperty = function (mapping, componentId) {
	if (mapping) {
		var dataProperty = mapping [componentId];
		if (dataProperty) {
			return dataProperty;
		}
	}

	return componentId;
};

/**
 * Get data of a form
 * @param (Form) form Formular to get data
 * @param {Map} mapping Mapping between html element id and data property (ex : {"name":"firstName", "age":"year"} )
 * @return Data of this formular
 * @type Map
 */
SweetDevRia.Mandatory.getFormData = function (form, mapping) {
	var data = {};

	for (var i = 0; i <  form.elements.length; i++) {
		var elem = form.elements [i];
		var id = elem.id;
		if (id) {
			var value = SweetDevRia.Control.getValue (id);
			if (value) {
				var dataProperty = SweetDevRia.Mandatory.getDataProperty (mapping, id);
				data [dataProperty] = value;
			}
		}		
	}

	return data;
};


/**
 * Set data in a form
 * @param (Form) form Formular to set data
 * @param {Map} data Data to set
 * @param {Map} mapping Mapping between html element id and data property (ex : {"name":"firstName", "age":"year"} )
 */
SweetDevRia.Mandatory.setFormData = function (form, data, mapping) {
	for (var i = 0; i <  form.elements.length; i++) {
		var elem = form.elements [i];
		var id = elem.id;
		if (id) {
			var dataProperty = SweetDevRia.Mandatory.getDataProperty (mapping, id);
			SweetDevRia.Control.setValue (elem, data[dataProperty]);
		}
	}
};

