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
SweetDevRia.Ajax = function(id) {
	this.id = id;

	/** Register */
	SweetDevRia.Ajax.repository [id] = this;

	this.xmlhttp = null;
	this.status = null;
	this.responseText = null;
	this.responseXML = null;
	this.callback = null;
	this.readyState = null;
};

/**
 * Constant defining the synchronization state to send as param
 * @private 
 * @type String
 */ 
SweetDevRia.Ajax.SYNCHRO_CALL = "synchroCall";

SweetDevRia.Ajax.repository = {};


/**
 * Get an Ajax instance from its id 
 * @param {String} id the instance id to get
 * @return an Ajax instance according to the required id
 * @type Ajax
 * @private
 * @static 
 */ 
SweetDevRia.Ajax.getInstance = function (id) {
	return SweetDevRia.Ajax.repository [id];
};


/**
 * Reinitialize the Ajax object
 */
SweetDevRia.Ajax.prototype.reset = function() {
	this.xmlhttp = null;
	this.status = null;
	this.responseText = null;
	this.responseXML = null;
	this.callback = null;
	this.readyState = null;
};

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
 * Return an XmlHttpRequest object, cross browser support.
 * @type XMLHttpRequest
 * @return an XmlHttpRequest object, cross browser support.
 * @private
 */
SweetDevRia.Ajax_getXmlHttpRequest = function() {
	var xmlhttp = null;

	if (typeof ActiveXObject != "undefined") {
		xmlhttp = getMsXmlObject ("XmlHttp");
	} else {
		xmlhttp = new XMLHttpRequest();
	}

	return xmlhttp;
};

/** 
 * Send an Ajax request
 * @param {String} method "POST" or "GET" method
 * @param {String} url the url to call
 * @param {Array} param the parameters to send to request (will be concatenated to URL)
 * @param {boolean} synchroCall whether the call must be synchrone or not
 * @private
 */
SweetDevRia.Ajax.prototype.send = function(method, url, param, synchroCall) {
	if (synchroCall == null) {synchroCall = false;}

	/** On construit un objet XmlHttpRequest */
	this.xmlhttp = SweetDevRia.Ajax_getXmlHttpRequest ();

    this.xmlhttp.open(method,url, ! synchroCall);

	this.xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

	this.xmlhttp.onreadystatechange =  
		new Function ("SweetDevRia.Ajax.getInstance (\""+this.id+"\").bindCallback();");
	
    this.xmlhttp.send(param);
	
	return this.xmlhttp;
};

/** 
 * Send a POST Ajax request
 * @param {String} request URL
 * @param {String} parameters to send to request (will be concatenated to URL)
 * @param {boolean} synchroCall True for a synchrone server call, else false
 */
SweetDevRia.Ajax.prototype.post = function(url, param, synchroCall) {
	return this.send ("POST", url, param, synchroCall);
};

/** 
 * Send a GET Ajax request
 * @param {String} request URL
 * @param {boolean} synchroCall True for a synchrone server call, else false
 */
SweetDevRia.Ajax.prototype.get = function(url, synchroCall) {
	return this.send ("GET", url, "", synchroCall);
};

/**
 * Add a header field to the Ajax object requester
 * @param {String} field name
 * @param {String} field value
 */
SweetDevRia.Ajax.prototype.setRequestHeader = function(name, value) {
	if (this.xmlhttp) {
		this.xmlhttp.setRequestHeader(name, value);
	}
};

/**
 * Get the text request's response
 * @type String
 * @return the response text for this Ajax object
 */
SweetDevRia.Ajax.prototype.getResponseText = function() {
	return this.responseText;
};

/**
 * Get the XML request's response
 * @type String
 * @return the response XML for this Ajax object
 */
SweetDevRia.Ajax.prototype.getResponseXML = function() {
	return this.responseXML;
};

/**
 * Return the status of the request
 * @type int
 * @return the status of the request 
 */
SweetDevRia.Ajax.prototype.getStatus = function() {
	return this.status;
};

/**
 * Set the function to call when response is coming back
 * @param {Function} callback JavaScript function to execute when response is coming back
 */
SweetDevRia.Ajax.prototype.setCallback = function(callback) {
	this.callback = callback;
};

/**
 * Get the callback function
 * @return {Function} callback function
 */
SweetDevRia.Ajax.prototype.getCallback = function() {
	return this.callback;
};

/**
 * Get the state of the request
 * @return {int} ready state
 */
SweetDevRia.Ajax.prototype.getReadyState = function() {
	return this.readyState;
};


/**
 * Generic callback
 * Call onServerUnreachable() on server error.
 * @private
 */
SweetDevRia.Ajax.prototype.bindCallback = function() {
	if (this.xmlhttp) {
		this.readyState = this.xmlhttp.readyState;
		if (this.readyState == 4) {
			this.responseText = this.xmlhttp.responseText;
			this.responseXML = this.xmlhttp.responseXML;

			try{
				this.status = this.xmlhttp.status;
			}catch(ex){ //Firefox error
				this.onServerUnreachable(ex);
				return;
			}
			
			if( this.status == 12002 || //timeout  
				this.status == 12029 ||//Dropped connection 
				this.status == 12030 ||//Dropped connection 
				this.status == 12031 ||//Dropped connection 
				this.status == 12152){ //Connection closed by server
					this.onServerUnreachable(null, this.status);
			} 

			if (this.callback) {
				this.callback ();
			}
		}
	}
};


/**
 * Function called if the server cannot be reached
 * @param {Exception} ex the JavaScript native exception caught (Firefox)
 * @param {errorCode} errorCode the error code (Internet Explorer)
 * @see http://groups.google.com/group/prototype-core/msg/3e0fe68dd1da9c1e
 */
SweetDevRia.Ajax.prototype.onServerUnreachable = function(ex, errorCode) {
	SweetDevRia.log.error("The server is not responding. Exception thrown : "+ex+". Error Code : "+errorCode);
};
