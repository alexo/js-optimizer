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
* @class Alert Message Component
* @constructor
* @param {String} id 		The id of the component
*/
SweetDevRia.Alert = function(id) {
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Alert");

	this.message = null;
	this.type = SweetDevRia.Alert.PLAIN; // plain, info, warn, error
	this.actionType = SweetDevRia.Alert.NONE; // none, ok, ok_cancel, yes_no, yes_no_cancel, close
	this.modal = false;
};

extendsClass (SweetDevRia.Alert, SweetDevRia.RiaComponent);

SweetDevRia.Alert.PLAIN = "plain";
SweetDevRia.Alert.INFO = "info";
SweetDevRia.Alert.WARN = "warn";
SweetDevRia.Alert.ERROR = "error";

SweetDevRia.Alert.NONE = "none";
SweetDevRia.Alert.OK = "ok";
SweetDevRia.Alert.OK_CANCEL = "ok_cancel";
SweetDevRia.Alert.YES_NO = "yes_no";
SweetDevRia.Alert.YES_NO_CANCEL = "yes_no_cancel";
SweetDevRia.Alert.CLOSE = "close";

/**
* Change the component's message
* @param {String} message the new message
*/
SweetDevRia.Alert.prototype.setMessage = function (message) {
	this.message = message;
};

/**
* Change the component's modal property
* @param {Boolean} message the new modal property
*/
SweetDevRia.Alert.prototype.setModal = function (modal) {
	this.modal = modal;
};

/**
* Change the component's type property. Possible values are SweetDevRia.Alert.PLAIN, SweetDevRia.Alert.INFO, SweetDevRia.Alert.WARN, SweetDevRia.Alert.ERROR
* @param {String} message the new type property
*/
SweetDevRia.Alert.prototype.setType = function (type) {
	this.type = type;
};

/**
* Change the component's actionType property. Possible values are SweetDevRia.Alert.NONE, SweetDevRia.Alert.OK, SweetDevRia.Alert.OK_CANCEL, SweetDevRia.Alert.YES_NO
* , SweetDevRia.Alert.YES_NO_CANCEL, SweetDevRia.Alert.CLOSE
* @param {String} message the new actionType property
*/
SweetDevRia.Alert.prototype.setActionType = function (actionType) {
	this.actionType = actionType;
};


SweetDevRia.Alert.prototype.getCssClass = function() {
	if (this.type == SweetDevRia.Alert.PLAIN) {
		return "ideo-alt-plain";
	}
	else if (this.type == SweetDevRia.Alert.INFO) {
		return "ideo-alt-info";
	}
	else if (this.type == SweetDevRia.Alert.WARN) {
		return "ideo-alt-warn";
	}
	else if (this.type == SweetDevRia.Alert.ERROR) {
		return "ideo-alt-error";
	}
	
	return "";
}

SweetDevRia.Alert.prototype.getCssIconClass = function() {
	return this.getCssClass()+"Icon";
}

SweetDevRia.Alert.prototype.onYes = function() {
 	alert("on Yes !!!")
}

SweetDevRia.Alert.prototype.onNo = function() {
 	alert("on No !!!")
}

SweetDevRia.Alert.prototype.onOk = function() {
 	alert("on Ok !!!")
}

SweetDevRia.Alert.prototype.onCancel = function() {
 	alert("on Cancel !!!")
}

SweetDevRia.Alert.prototype.onClose = function() {
 	alert("on Close !!!")
}


SweetDevRia.Alert.prototype.createButton = function(text, methodName) {
	var button = document.createElement("input");
    button.setAttribute('type', "button");
    button.setAttribute('value', text);
 	button.className = "ideo-alt-button";
    button.setAttribute('onclick', "SweetDevRia.$('"+this.id+"')."+methodName+"();SweetDevRia.$('"+this.id+"').hide();");
	return button;
}


/**
* Create the HTML render of the component 
* @return the HTML render of the element
* @type HTMLElement
* @private
*/
SweetDevRia.Alert.prototype.createAlertDiv = function() {
    var div = document.createElement("div");
	div.className = 'ideo-alt-zone '+this.getCssClass();
    div.setAttribute('id', this.id);

    var divButton = document.createElement("div");
 	divButton.className = "ideo-alt-buttonBar";
	

	if (this.actionType == SweetDevRia.Alert.OK) {
		divButton.appendChild (this.createButton (this.getMessage("buttonOk"), "onOk" ));
	}
	else if (this.actionType == SweetDevRia.Alert.OK_CANCEL) {
		divButton.appendChild (this.createButton (this.getMessage("buttonOk"), "onOk" ));
		divButton.appendChild (this.createButton (this.getMessage("buttonCancel"), "onCancel" ));
	}
	else if (this.actionType == SweetDevRia.Alert.YES_NO) {
		divButton.appendChild (this.createButton (this.getMessage("buttonYes"), "onYes" ));
		divButton.appendChild (this.createButton (this.getMessage("buttonNo"), "onNo" ));
	}
	else if (this.actionType == SweetDevRia.Alert.YES_NO_CANCEL) {
		divButton.appendChild (this.createButton (this.getMessage("buttonYes"), "onYes" ));
		divButton.appendChild (this.createButton (this.getMessage("buttonNo"), "onNo" ));
		divButton.appendChild (this.createButton (this.getMessage("buttonCancel"), "onCancel" ));
	}
	else if (this.actionType == SweetDevRia.Alert.CLOSE) {
		divButton.appendChild (this.createButton (this.getMessage("buttonClose"), "onClose" ));
	}

    var divMessage = document.getElementById(this.id+"_message");
 	divMessage.className = "ideo-alt-message";
	divMessage.style.display = "";

    var divIcon = document.createElement("div");
 	divIcon.className = "ideo-alt-icon "+this.getCssIconClass();
    divIcon.innerHTML = "&nbsp;";
	
	div.appendChild (divIcon);
	div.appendChild (divMessage);
	div.appendChild (divButton);
	
	document.body.appendChild(div)

    return div;
};

/**
* Show the waiting message
*/
SweetDevRia.Alert.prototype.show = function() {
	var div = document.getElementById (this.id);
	if (div == null) {
		div = this.createAlertDiv ();
	}

	if (div) {

		if (this.modal) {
			SweetDevRia.ModalPanel.getInstance ().show ();
		}
		div.style.display = "block";

		var clientHeight = SweetDevRia.DomHelper.getClientHeight();
		var height = parseInt(SweetDevRia.DomHelper.getHeight(div), 10);
		div.style.top =  SweetDevRia.DomHelper.getScrolledTop() + ((clientHeight - height) /2) + "px";

		var clientWidth = SweetDevRia.DomHelper.getClientWidth();
		var width =parseInt(SweetDevRia.DomHelper.getWidth(div), 10);
		div.style.left =  SweetDevRia.DomHelper.getScrolledLeft() + ((clientWidth - width) /2) + "px";

		var zindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex ();
		div.style.zIndex = zindex;
	}

};	

/**
* Hide the waiting message
*/
SweetDevRia.Alert.prototype.hide = function() {

	var div = document.getElementById (this.id);
	if (div) {
		div.style.display = "none";

		if (this.modal) {
			SweetDevRia.ModalPanel.getInstance ().hide ();
		}
	}
};


