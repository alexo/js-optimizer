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
 * RIA Zone
 * @constructor
 * @param {String}	id				The id of the zone element defined in the page
 * @param {boolean}	loadAtStartup	Whether the zone will be initiated loaded or not
 * @param {String}	url				The url of this zone. undefined for none (body content).
 * @param {int}		refreshDelay	The delay of refresh of this zone, in millis. 0 for no refresh delay.
 * @param {String}	addInputs	A list of comma separated input name to submit.
 */
SweetDevRia.Zone = function(id,loadAtStartup, url, refreshDelay, addInputs){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Zone");
	this.id = id;
	this.loadAtStartup = loadAtStartup;
	this.url = url;
	this.refreshDelay = refreshDelay;
	this.addInputs = addInputs;
	
	this.timeout = undefined;
	
	if(this.refreshDelay != 0){
		SweetDevRia.Zone.launchTimer( this );
	}	
};

extendsClass(SweetDevRia.Zone, SweetDevRia.RiaComponent);

/**
 * This event type is fire when the zone is refreshed
 */
SweetDevRia.Zone.REFRESH_EVENT = "refresh"; 


/**
 * Public APIS
 */

/**
 * This method is called before processing a call to the server for this zone content
 * To be overridden !!
 * @param {String} newUrl	an optional new url to set on the zone
* @param {Map} params parameter map to send to server, optional
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Zone.prototype.beforeCallServer = function(newUrl, params){ return true; };  

/**
 * This method is called after having processed a call to the server for this zone content
 * To be overridden !!
 * @param {String} newUrl	an optional new url to set on the zone
* @param {Map} params parameter map to send to server, optional
 */
SweetDevRia.Zone.prototype.afterCallServer  = function(newUrl, params){  /* override this */ };


/**
 * This method is called before processing the server response
 * To be overridden !!
 * @param {RiaEvent} evt Event containing the new zone content 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Zone.prototype.beforeOnCallServer = function(evt){ return true; };  

/**
 * This method is called after processing the server response
 * @param {RiaEvent} evt Event containing the new zone content 
 * To be overridden !!
 */
SweetDevRia.Zone.prototype.afterOnCallServer  = function(evt){  /* override this */ };


/**
* Launch a timer for the specified zone
* @param {Zone} zone 	the zone to start a timer on. 
* @static
*/
SweetDevRia.Zone.launchTimer = function(zone){
	zone.timeout = window.setTimeout( "SweetDevRia.Zone.timerRefresh('"+zone.id+"');", zone.refreshDelay ); 
};

/**
* Function automatically called when the delay ends to trigger the server call.
* @private
* @static
*/
SweetDevRia.Zone.timerRefresh = function(zoneId){
	SweetDevRia.getComponent(zoneId).callServer();
};

/**
* Cancel the timer on the zone
*/
SweetDevRia.Zone.prototype.cancelTimer = function(){
	if(this.timeout != undefined){
		window.clearTimeout(this.timeout);
	}
	this.timeout = undefined;
};
/**
* Starts the timer on the zone
*/
SweetDevRia.Zone.prototype.restartTimer = function(){
	if(this.timeout == undefined){
		SweetDevRia.Zone.launchTimer(this);
	}
};

/**
* Changes the url of the zone
* Do NOT reload the zone
* @param {String} url	the new url targetted by the zone 
*/
SweetDevRia.Zone.prototype.setUrl = function(url){
	this.url = url;
	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("updateUrl", this.id, {"sendServer":true , "url":this.url}));
};

/**
* Returns the url of the zone
* @return 	the url targetted by the zone
* @type		{String}
*/
SweetDevRia.Zone.prototype.getUrl = function(){
	return this.url;
};

/**
* Changes the refresh delay of the zone
* Do NOT launch the timer
* @param {int} newDelay		the new refresh delay of the zone
*/
SweetDevRia.Zone.prototype.setRefreshDelay = function(newDelay){
	this.refreshDelay = newDelay;
	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("updateDelay", this.id, {"sendServer":true , "delay":this.refreshDelay}));
};

/**
* Returns the refresh delay of the zone
* @return 	the refresh delay of the zone
* @type		{int}
*/
SweetDevRia.Zone.prototype.getRefreshDelay = function(){
	return this.refreshDelay ;
};


/**
* Set a list of inputs name to submit
* @param {String} addInputs	the list of inputs name to submit, comma separated
*/
SweetDevRia.Zone.prototype.setAddInputs = function(addInputs){
	this.addInputs = addInputs;
};

/**
* Returns the submit inputs name sent additionally to the request, comma separated
* @return the submit inputs name sent additionally to the request, comma separated
* @type	{String}
*/
SweetDevRia.Zone.prototype.getAddInputs = function(){
	return this.addInputs ;
};


/**
* Call the server
* @param {String} newUrl	an optional new url to set on the zone
* @param {Map} params parameter map to send to server, optional
*/
SweetDevRia.Zone.prototype.callServer = function(newUrl, params){		

	if(this.beforeCallServer(newUrl, params)){
	
		if(newUrl != undefined){
			this.url = newUrl;
		}
			
		if(!document.getElementById(this.id)){
			throw new Error("This zone no longer exists in the page :"+this.id);
		}
		
		if (params == null) {
			params = {};
		}
		params ["sendServer"] = true;
		params ["url"] = this.formatUrl(this.url);
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("callServer", this.id, params));
	
		this.afterCallServer(newUrl, params);
	}
	
};

/**
* Callback method for a zone refresh
* @param {RiaEvent} evt Event containing the new zone content 
* @private
*/
SweetDevRia.Zone.prototype.onCallServer = function(evt) {

	if(this.beforeOnCallServer(evt)){
		document.getElementById(this.id).innerHTML = evt.data;
		SweetDevRia_Zone_evalJS( document.getElementById(this.id) );
		
		SweetDevRia_initCompNotInitialized ();
		
		SweetDevRia.Zone.garbageCollector();
		
		this.fireEventListener (SweetDevRia.Zone.REFRESH_EVENT);

		this.afterOnCallServer(evt);
		
		if(this.refreshDelay != 0){
			SweetDevRia.Zone.launchTimer( this );
		}
	}
	//TODO quoi qd l id de la zone n existe pas ?
	return true;
};

/**
* Format the URL according to the addInputs value
* @type String
* @return the url appended with the addInputs parameters
* @private
*/
SweetDevRia.Zone.prototype.formatUrl = function(url){
	if(this.addInputs == null || this.addInputs == ""){
		return url;
	}

	var nextSeparator = '';
	if(url.indexOf('?') == -1){
		nextSeparator = '?';
	}else{
		nextSeparator = '&';
	}

 	var inputs = this.addInputs.split(",");
 	for(var i=0;i<inputs.length;++i){
		url = url+nextSeparator+inputs[i]+'='+SweetDevRia.Form.getValue(inputs[i]);
		nextSeparator = '&';
	}
	return url;
};

/**
* Destroy a zone and free all of its resources
* @private
*/
SweetDevRia.Zone.prototype.destroy = function(){
	this.cancelTimer();
};

/**
* Evaluates the javascript of a zone on a server callback
* @private
* @static
*/
function SweetDevRia_Zone_evalJS(zone){
	var scripts = zone.getElementsByTagName("script");
	var strExec;
	var bSaf = (navigator.userAgent.indexOf('Safari') != -1);
	var bOpera = (navigator.userAgent.indexOf('Opera') != -1);
	var bMoz = (navigator.appName == 'Netscape');
	for(var i=0; i<scripts.length; i++){
	    if (bSaf) {
	      strExec = scripts[i].innerHTML;
	    }
	    else if (bOpera) {
	      strExec = scripts[i].text;
	    }
	    else if (bMoz) {
	      strExec = scripts[i].textContent;
	    }
	    else {
	      strExec = scripts[i].text;
	    }
	    try {
	      window.eval(strExec);
	    } catch(e) {
	      throw "Script evaluation failed :\n"+strExec;
	    }
	}
}

/**
* Free every zones that are not contained in the page anymore.
* Called after a zone refresh. (free nested zones)
* @private
*/
SweetDevRia.Zone.garbageCollector = function (){
	var zones = SweetDevRia.getAllInstances("SweetDevRia.Zone");
	for(var i=0;i<zones.length;++i){
		if(!document.getElementById( zones[i] )){
			try{
			SweetDevRia.getComponent(zones[i]).destroy();
			}catch(e){
			//TODO comment est-ce possible ?
			SweetDevRia.unregister( SweetDevRia.getComponent(zones[i]) );
			}
		}
	}
};