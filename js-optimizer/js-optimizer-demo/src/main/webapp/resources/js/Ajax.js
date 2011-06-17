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
 *        email : Sweetdev_ria_sales@ideotechnologies.com
 *
 *
 * @version 2.2-SNAPSHOT
 * @author Ideo Technologies
 */

/**
 * Create object DOMParser for browsers who does not have this object (IE and Safari).
 */
if (typeof DOMParser == "undefined") {
   DOMParser = function () {null;};

   DOMParser.prototype.parseFromString = function (str, contentType) {
      if (typeof ActiveXObject != "undefined") {
         var d = getMsXmlObject("DomDocument");
         d.loadXML(str);
         return d;
      } else if (typeof XMLHttpRequest != "undefined") {
         var req = new XMLHttpRequest;
         req.open("GET", "data:" + (contentType || "application/xml") +
                         ";charset=utf-8," + encodeURIComponent(str), false);
         if (req.overrideMimeType) {
            req.overrideMimeType(contentType);
         }
         req.send(null);
         return req.responseXML;
      }
   };
}

/**
 * @class Ajax utility class
 * @constructor
 * @private
 */ 
function Ajax (id) {
	this.id = id;

	/** Register */
	Ajax.repository [id] = this;

	this.xmlhttp = null;
	this.status = null;
	this.responseText = null;
	this.responseXML = null;
	this.callback = null;
	this.readyState = null;
}

Ajax.prototype.send = Ajax_send;
Ajax.prototype.post = Ajax_post;
Ajax.prototype.get = Ajax_get;
Ajax.prototype.reset = Ajax_reset;
Ajax.prototype.getResponseText = Ajax_getResponseText;
Ajax.prototype.getResponseXML = Ajax_getResponseXML;
Ajax.prototype.getStatus = Ajax_getStatus;
Ajax.prototype.getReadyState = Ajax_getReadyState;
Ajax.prototype.getCallback = Ajax_getCallback;
Ajax.prototype.setCallback = Ajax_setCallback;
Ajax.prototype.bindCallback = Ajax_bindCallback;

Ajax.repository = {};
Ajax.getInstance = function (id) {
	return Ajax.repository [id];
};


/**
 * reinitialize Ajax
 */
function Ajax_reset () {
	this.xmlhttp = null;
	this.status = null;
	this.responseText = null;
	this.responseXML = null;
	this.callback = null;
	this.readyState = null;
}

/** 
 * Get Microsoft's XmlHttpRequest
 */
function getMsXmlHttp () {
	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var xmlHttp;
	for (var i = 0; i < prefixes.length; i++) {
		try {
			// try to create the objects
			xmlHttp = new ActiveXObject(prefixes[i] + ".XmlHttp");
			return xmlHttp;
		}
		catch (ex) {
			null;			
		}
	}
	
	throw new Error("Could not find an installed XML parser");
}

/** 
 * Get Microsoft's XmlHttpRequest
 */
function getMsXmlObject (object) {
	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var xmlHttp;
	for (var i = 0; i < prefixes.length; i++) {
		try {
			// try to create the objects
			xmlHttp = new ActiveXObject(prefixes[i] + "." + object);
			return xmlHttp;
		}
		catch (ex) {
		}
	}
	
	throw new Error("Could not find an installed XML parser");
}

/**
 * Get XmlHttpRequest
 */
function Ajax_getXmlHttpRequest () {
	var xmlhttp = null;

	if (typeof ActiveXObject != "undefined") {
		xmlhttp = getMsXmlObject ("XmlHttp");
	} else {
		xmlhttp = new XMLHttpRequest();
	}

	return xmlhttp;
}

/** 
 * Get an Ajax request
 * @param {String} "POST" or "GET" method
 * @param {String} request url 
 * @param {String} parameters to send to request (will be concated to URL)
 */
function Ajax_send (method, url, param, callback) {
	/** On construit un objet XmlHttpRequest */
	this.xmlhttp = Ajax_getXmlHttpRequest ();
  
    this.xmlhttp.open(method,url, true);

	this.xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

	this.xmlhttp.onreadystatechange = 
		new Function ("Ajax.getInstance (\""+this.id+"\").bindCallback();");

    this.xmlhttp.send(param);
}

/** 
 * Send a POST Ajax request
 * @param {String} request URL
 * @param {String} parameters to send to request (will be concated to URL)
 */
function Ajax_post (url, param) {
	return this.send ("POST", url, param);
}

/** 
 * Send a GET Ajax request
 * @param {String} request URL
 * @param {String} parameters to send to request (will be concated to URL)
 */
function Ajax_get (url) {
	return this.send ("GET", url, "");
}

/**
 * Add a header field
 * @param {String} field name
 * @param {String} fiel value
 */
function Ajax_setRequestHeader (name, value) {
	if (this.xmlhttp) {
		this.xmlhttp.setRequestHeader(name, value);
	}
}

/**
 * Get the text request's response
 */
function Ajax_getResponseText () {
	return this.responseText;
}

/**
 * Get the XML request's response
 */
function Ajax_getResponseXML () {
	return this.responseXML;
}

/**
 * Retourne le status de la requ?te
 */
function Ajax_getStatus () {
	return this.status;
}

/**
 * Set the function to call when response is coming back
 * @param {Function} callback JavaScript function to execute when response is coming back
 */
function Ajax_setCallback (callback) {
	this.callback = callback;
}

/**
 * Get the callback function
 * @type {Function} callback function
 */
function Ajax_getCallback () {
	return this.callback;
}

/**
 * Get the state of the request
 * @type {integer} ready state
 */
function Ajax_getReadyState () {
	return this.readyState;
}

/**
 * Generic call
 * @private
 */
function Ajax_bindCallback () {
	if (this.xmlhttp) {
		this.readyState = this.xmlhttp.readyState;
		if (this.readyState == 4) {

			this.responseText = this.xmlhttp.responseText;
			this.responseXML = this.xmlhttp.responseXML;

			try {
				var xmlParser = new DOMParser();
				this.responseXML = xmlParser.parseFromString(this.responseText, 'text/xml');
				this.responseXML.normalize(); 
			}
			catch (e) {
				this.responseXML.loadXML(this.responseText);
			}

			this.status = this.xmlhttp.status;

			if (this.callback) {
				this.callback ();
			}
		}
	}
}



