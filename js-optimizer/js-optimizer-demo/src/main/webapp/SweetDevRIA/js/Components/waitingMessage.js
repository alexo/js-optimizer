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
* @class Waiting Message Component
* @constructor
* @param {String} id 		The id of the component
* @param {String} message 	The message to display
* @param {String} css 		A additional css class for this component
* @param {boolean} modal 	Deprecated
*/
SweetDevRia.WaitingMessage = function(id, message, css, modal) {
	if (modal == null){
		modal = true;
	} 
	if (message == null){
		message = "";
	} 
	if (css == null){
		css = "";
	} 

	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.WaitingMessage");
	
	this.message = message;
	this.css = css;
	this.modal = false;
};

extendsClass (SweetDevRia.WaitingMessage, SweetDevRia.RiaComponent);

SweetDevRia.WaitingMessage.UNIQUE_ID = "SweetDevRia_WaitMessage";




/**
* Change the component's message
* @param {String} message the new message
*/
SweetDevRia.WaitingMessage.prototype.setMessage = function (message) {
	this.message = message;
};

/**
* Create the HTML render of the component 
* @return the HTML render of the element
* @type HTMLElement
* @private
*/
SweetDevRia.WaitingMessage.prototype.createMessageDiv = function() {
    var div = document.createElement("div");
    div.setAttribute('id', this.id);
    div.setAttribute('class', 'ideo-ndg-waitingMessage '+this.css);
    return document.body.appendChild(div);
};

/**
* Show the waiting message
*/
SweetDevRia.WaitingMessage.prototype.show = function() {
	var div = document.getElementById (this.id);
	if (div == null) {
		div = this.createMessageDiv ();
	}

	if (div) {
	    div.setAttribute('class', 'ideo-ndg-waitingMessage '+this.css);
		div.style.position="absolute";

	    div.innerHTML = '<img src="' + SweetDevRIAImagesPath + '/spinner.gif" align="absmiddle"> ' + this.message;

		if (this.modal) {
			SweetDevRia.ModalPanel.getInstance ().show ();
		}

		var x = SweetDevRia.DomHelper.getScrolledLeft() + ((document.body.clientWidth - div.offsetWidth) /2);
		var y = SweetDevRia.DomHelper.getScrolledTop() + ((document.body.clientHeight - div.offsetHeight) /2);

		div.style.left = x;
		div.style.top = y;

		var zindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex ();
		div.style.zIndex = zindex;

		div.style.display = "block";
	}

};	

/**
* Hide the waiting message
*/
SweetDevRia.WaitingMessage.prototype.hide = function() {

	var div = document.getElementById (this.id);
	if (div) {
		div.style.display = "none";

		if (this.modal) {
			SweetDevRia.ModalPanel.getInstance ().hide ();
		}
	}
};


SweetDevRia.showWaitingMessage = function(message, cssClass, modal) {
	var waitingMessage = SweetDevRia.$(SweetDevRia.WaitingMessage.UNIQUE_ID);
	if  (waitingMessage == null) {
		waitingMessage = new SweetDevRia.WaitingMessage (SweetDevRia.WaitingMessage.UNIQUE_ID, message, cssClass, modal);
	}
	else {
		waitingMessage.message = message;
		waitingMessage.css = cssClass;
		waitingMessage.modal = modal;
	}
	
	waitingMessage.show ();
};

SweetDevRia.centerWaitingMessage = function(element){
	var x = SweetDevRia.DomHelper.getX(element);
	var y = SweetDevRia.DomHelper.getY(element);
	
	var width = SweetDevRia.DomHelper.getWidth(element);
	var height = SweetDevRia.DomHelper.getHeight(element);
	
	var waitingMessage = SweetDevRia.$(SweetDevRia.WaitingMessage.UNIQUE_ID);
	if  (waitingMessage) {
		var waitingDiv = SweetDevRia.DomHelper.get(waitingMessage.id);
		SweetDevRia.DomHelper.setX(waitingDiv, x+width/2-SweetDevRia.DomHelper.getWidth(waitingDiv)/2);
		SweetDevRia.DomHelper.setY(waitingDiv, y+height/2-SweetDevRia.DomHelper.getHeight(waitingDiv)/2);		
	}
};

SweetDevRia.hideWaitingMessage = function() {
	var waitingMessage = SweetDevRia.$(SweetDevRia.WaitingMessage.UNIQUE_ID);
	if  (waitingMessage) {
		waitingMessage.hide ();
	}
};
