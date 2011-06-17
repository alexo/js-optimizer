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
 * @class Communication class between browser and server. Singleton
 * @constructor
 * @private
 */ 
SweetDevRia.ComHelper = function() {
	
	/** Callback repository */
	this.callbackRepository = {};
};

/**
 * Unique instance of the ComHelper
 * @type ComHelper
 */
SweetDevRia.ComHelper._instance = new SweetDevRia.ComHelper ();

/**
 * Return the instance of the ComHelper
 * @type ComHelper
 * @return the instance of the ComHelper
 * @private
 */
SweetDevRia.ComHelper.getInstance = function () {
	return SweetDevRia.ComHelper._instance;
};

/**
 * JavaScript var containing the page id.
 * @type String
 * @static
 */
SweetDevRia.ComHelper.ID_PAGE = "__RiaPageId";

/**
 * JavaScript post var containing the params.
 * @type String
 * @static
 */
SweetDevRia.ComHelper.EVENT_XML_PARAM = "eventXml";

/**
 * SweetDEV RIA server entry point.
 * @type String
 * @static
 * @private
 */
SweetDevRia.ComHelper.PROXY_URL = SweetDevRIAPath + "/RiaController";

/**
 * JSF page marker
 * @type String
 * @static
 * @private
 */
SweetDevRia.ComHelper.JSF_VIEW_ID = "com.sun.faces.VIEW";


/**
 * Return true if we are in a JSF context. //TODO next version.
 * @type boolean
 * @return true if we are in a JSF context, false otherwise
 * @private
 */
SweetDevRia.ComHelper.isJsfPage = function()  {
	return (document.getElementById (SweetDevRia.ComHelper.JSF_VIEW_ID) != null);
};

/**
 * Parses an XML String, cross browser.
 * @param {String} xmlStr the String to parse
 * @type DOMObject
 * @return a DOMObject resulting of the xml string parsed
 */
SweetDevRia.ComHelper.parseXml = function(xmlStr) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(xmlStr, "text/xml");
	return doc;
};

/**
 * Fires an event to a server model
 * @param {RiaEvent} evt the event to send
 * @param {Function} callback a callback function to execute on server response
 */
SweetDevRia.ComHelper.fireEvent  = function(evt, callback) {
	var comHelper = SweetDevRia.ComHelper.getInstance ();
	
	/** Get an Ajax instance */
	var ajax = SweetDevRia.AjaxPooler.getInstance ();

	/** set Ajax generic callback */
	ajax.setCallback (SweetDevRia.ComHelper.callback);

	/** Register specific callback */
	comHelper.callbackRepository [ajax.id] = callback;

	/** pass parameters */
	var eventAsJson = evt.toJson ();

	var paramStr = SweetDevRia.ComHelper.ID_PAGE+"="+window [SweetDevRia.ComHelper.ID_PAGE]+"&"+SweetDevRia.ComHelper.EVENT_XML_PARAM + "=" + encodeURIComponent(eventAsJson);

	if (evt.action != null) {
		paramStr = "action="+evt.action+"&"+paramStr;
	}

	var jsfViewIdComp = document.getElementById (SweetDevRia.ComHelper.JSF_VIEW_ID);
	if (jsfViewIdComp != null) {
		paramStr += "&"+SweetDevRia.ComHelper.JSF_VIEW_ID+"="+jsfViewIdComp.value;
	}

	/** Ajax call */
	var url = SweetDevRia.ComHelper.PROXY_URL;
	if (SweetDevRia.ComHelper.isJsfPage()){
		url = window.location.href;
	}

	ajax.post (url, paramStr, evt.params[SweetDevRia.Ajax.SYNCHRO_CALL]);
};

/**
 * Call a specific URL, through Ajax, and return the instance used
 * @param {String} url Url to call
 * @param {Object} args Object which contains parameter to send
 * @param {Function} callback the callback function
 * @return the instance used
 * @type XMLHttpRequest
 */
SweetDevRia.ComHelper.call  = function(url, args, callback) {
	var comHelper = SweetDevRia.ComHelper.getInstance ();
	
	var ajax = SweetDevRia.AjaxPooler.getInstance ();

	ajax.setCallback (SweetDevRia.ComHelper.callback);
	
	comHelper.callbackRepository [ajax.id] = callback;
	
	/** Set parameters */
	var argsStr = null;
	if (typeof(args) == "string") {
		argsStr = args;
	}
	else {
		argsStr = "";
		var first = true;
		for (var i in args) {
			if (i != SweetDevRia.Ajax.SYNCHRO_CALL) {
				if (! first) {
					argsStr += 	"&";
				}
				argsStr += 	i + "=" + args [i];
				first = false;
			}
		}	
	}

	/** Ajax call */
	return ajax.post (url, argsStr, args[SweetDevRia.Ajax.SYNCHRO_CALL]);
};

/**
 * Fires a bunch of events described into a jsonString
 * @param {String} json a Json String containing the events
 * @private
 */
SweetDevRia.ComHelper.fireEvents  = function(json) {
	if (json) {
		var eventsTab;
		try{
			eventsTab = json.parseJSON ();
		}catch(e){
			return;
		}
		var proxy = SweetDevRiaProxy.getInstance ();
 		for (var i = 0; i < eventsTab.length; i++) {
			var eventMap = eventsTab [i];

			var evt = new SweetDevRia.RiaEvent (eventMap["type"],eventMap["idSrc"], eventMap["params"]);
		 	proxy.fireEvent (evt);
		}
	}
};
					


/**
 * Generic ComHelper callback function
 * @private
 */
SweetDevRia.ComHelper.callback  = function() {

	var comHelper = SweetDevRia.ComHelper.getInstance ();

	/** Manage optionnal Javascript invoke */
	SweetDevRia.ComHelper.fireEvents (this.responseText);
			
	/** call callbacks */
	var callback = comHelper.callbackRepository [this.id];

	if (callback) {
		callback.call (this);
	}
};

	