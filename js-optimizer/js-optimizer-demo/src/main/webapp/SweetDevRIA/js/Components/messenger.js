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

SweetDevRia.Messenger = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "Messenger");
	
	this.messageTypes = [];
};

extendsClass(SweetDevRia.Messenger, SweetDevRia.RiaComponent);

/**
 * Add a new message type to display
 * @param {String } messageType The new message type to display
 */
SweetDevRia.Messenger.prototype.addMessageType = function (messageType) {
	this.messageTypes.add (messageType);
};


/**
 * 
 * @param {Array} messageConf Error messages configuration as [[mesageType, message, displayIcon, displayMessage, applyErrorClass, applyLabelErrorClass], ...]. 
 * 					ex :[["loginMessage", null, true, false, true, true],  ["globalMessage", "Votre identifiant est inconnu !", true, true, true, true]]
 * @param {boolean} errorMode True if the component is in error, else false
 * @param {String} srcId Component identifiant on error
 */
SweetDevRia.Messenger.sendMessage = function (messageConf, errorMode, srcId) {
	if (messageConf) {
		for (var i = 0; i < messageConf.length; i++) {
			var messConf = messageConf [i];
			
			if (messConf) {
				var messageType = messConf [0];
				var message = messConf [1];
				var displayIcon = messConf [2];
				var displayMessage = messConf [3];
				var applyErrorClass = messConf [4];
				var applyLabelErrorClass = messConf [5];
				
				// find all mesage component that listen this message type
				var messengers = SweetDevRia.getInstances ("Messenger");
				for (var j = 0; j < messengers.length; j++) {
					var messenger = SweetDevRia.$(messengers [j]);
					if (messenger && messenger.messageTypes.contains (messageType)) {
						messenger.sendMessage (srcId, errorMode, message, displayIcon, displayMessage, applyErrorClass, applyLabelErrorClass);
					}
				}
			}
		}
	}
};

/**
 * Display an error message
 * @param {String} srcId Component identifiant on error
 * @param {boolean} errorMode True if the component is in error, else false
 * @param {String} message The error message to display
 * @param {boolean} displayIcon True to display error message icon, else false
 * @param {boolean} displayMessage True to display error message, else false
 * @param {boolean} applyErrorClass True to apply error css to error component, else false
 * @param {boolean} applyLabelErrorClass True to apply error css to error component label, else false
 * @private
 */
SweetDevRia.Messenger.prototype.sendMessage = function (srcId, errorMode, message, displayIcon, displayMessage, applyErrorClass, applyLabelErrorClass) {
	var messageZone = document.getElementById (this.id);

	if (messageZone) {
		if (errorMode == null) {
			messageZone.style.display = "none";
		}
		else {
			messageZone.style.display = "";

			if (displayIcon) {
				messageZone.innerHTML = "&nbsp;";
				if (errorMode) {
					SweetDevRia.DomHelper.addClassName(messageZone,"ideo-msg-iconError");
					SweetDevRia.DomHelper.removeClassName(messageZone,"ideo-msg-iconNotError");
				}
				else{
					SweetDevRia.DomHelper.addClassName(messageZone,"ideo-msg-iconNotError");
					SweetDevRia.DomHelper.removeClassName(messageZone,"ideo-msg-iconError");
				}
			}
	
			if (displayMessage) {
	
				messageZone.innerHTML = message;
	
				if (errorMode) {
					SweetDevRia.DomHelper.addClassName(messageZone,"ideo-msg-messageError");
					SweetDevRia.DomHelper.removeClassName(messageZone,"ideo-msg-messageNotError");
				}
				else{
					SweetDevRia.DomHelper.addClassName(messageZone,"ideo-msg-messageNotError");
					SweetDevRia.DomHelper.removeClassName(messageZone,"ideo-msg-messageError");
				}
			}
		}
	}
	
	this.applyErrorClasses (srcId, errorMode, applyErrorClass, applyLabelErrorClass);
};


/**
 * Apply or remove the component error class and the label error class
 * @param {String} srcId Component identifiant on error
 * @param {boolean} errorMode True to apply css classes, false to remove it
 * @param {boolean} applyErrorClass True to apply error css to error component, else false
 * @param {boolean} applyLabelErrorClass True to apply error css to error component label, else false
 */
SweetDevRia.Messenger.prototype.applyErrorClasses = function (srcId, errorMode, applyErrorClass, applyLabelErrorClass) {

	function getLabel (compId)  {
		var labels = document.getElementsByTagName ("label");
		for (var i = 0; i < labels.length; i++) {
			if (labels[i].getAttribute ("for") == compId || labels[i].getAttribute ("htmlFor") == compId) {
				return labels[i]; 
			}	
		}
		return null;
	}

	var comp = document.getElementById (srcId);

	if (comp) {
		if (applyErrorClass) {
			if (errorMode) {
				SweetDevRia.DomHelper.addClassName(comp,"ideo-msg-error");
			}
			else{
				SweetDevRia.DomHelper.removeClassName(comp,"ideo-msg-error");
			}
		}		

		if (applyLabelErrorClass) {
			var label = getLabel (srcId);
			if (label) {
				if (errorMode) {
					SweetDevRia.DomHelper.addClassName(label,"ideo-msg-labelError");
				}
				else{
					SweetDevRia.DomHelper.removeClassName(label,"ideo-msg-labelError");
				}
			}
		}		
	}
};

