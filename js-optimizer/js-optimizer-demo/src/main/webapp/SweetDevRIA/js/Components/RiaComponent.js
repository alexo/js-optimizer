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
 * @class parent class of SweetDevRia components
 * @constructor
 * @private
 */ 
SweetDevRia.RiaComponent = function(id, className) {

	if (id) {
		this.id = id;
		this.className = className;

		this.baseRiaComponent = SweetDevRia.EventManager;
		this.baseRiaComponent ();
	
		/** components repository register */
		SweetDevRia.register (this);
		
		/** subcribe to keyListener events */
		SweetDevRia.KeyListener.getInstance().addEventListener (this);
		
		var sweetDevRiaProxy = SweetDevRiaProxy.getInstance ();
		this.addEventListener (sweetDevRiaProxy);
		
		sweetDevRiaProxy.addEventListener (this);
/*
		var backHelper = SweetDevRia.BackHelper.getInstance ();
		backHelper.addEventListener (this);
*/

		// Si je suis ds une iframe
		this.parentComponent = null;
		if (window.parent && window != window.parent) {
			
			var parent = window.parent; 	
			
			for (var i = 0; i < parent.frames.length; i++) {
				var frame = parent.frames [i];
				
				if (frame.location == document.location) {
					var parentComponentId = frame.name;
					
					if (parentComponentId.indexOf ("_panel") == parentComponentId.length - "_panel".length) {
						parentComponentId = name.substring (0, "_panel".length);
						
						this.parentComponent = parent.SweetDevRia.$ (parentComponentId);
					}
				}
			}
		}
		else if (SweetDevRia.riaComponentParentIds && SweetDevRia.riaComponentParentIds.length) {
			this.parentComponentId = SweetDevRia.riaComponentParentIds [SweetDevRia.riaComponentParentIds.length - 1];
		}
		
		this.isRiaComponent = true;

		if (window.initialized) {
			document.toInitialize [id] = true;
		}
		this.load ();
	}
};


SweetDevRia.RiaComponent.prototype = new SweetDevRia.EventManager;

SweetDevRia.RiaComponent.prototype.setActive = function (active) {
	if (active) {
		SweetDevRia.ActiveManager.setActiveComponent (this);
	} else {
		SweetDevRia.ActiveManager.removeComponent (this);
	}
};

SweetDevRia.RiaComponent.prototype.load = function () {
	null;
};

SweetDevRia.RiaComponent.prototype.isActive = function () {
	var activeComp = SweetDevRia.ActiveManager.getActiveComponent ();
	if (activeComp && (activeComp.id == this.id)) {
		return true;
	}
	return false;
};

SweetDevRia.RiaComponent.prototype.toString = function () {
	return this.id+" [ "+this.className+" ]";
};

SweetDevRia.RiaComponent.prototype.addHash = function (hash) {
//	SweetDevRia.BackHelper.addHash (this.id, hash);
};


SweetDevRia.RiaComponent.prototype.priorityHandleEvent = function (evt) {
	if (evt.type == SweetDevRia.RiaEvent.INIT_TYPE) {
		var res = true;
		if (this.initialize) {
			res = this.initialize ();
		}
		this.initialized = true;
		return res;
	}
	else if (evt.idSrc == this.id) {
		var type = evt.type;

		if (type && type.length) {
			var functionName = "on"+type.substring(0, 1).toUpperCase() + type.substring(1, type.length);

			if (this [functionName]) {
				return 	this[functionName].call (this, evt);
			}
		}
	}
	
	return true;
};


SweetDevRia.RiaComponent.prototype.updateServerModel = function (attrName, attrValue) {
	if (! SweetDevRia.ComHelper.isJsfPage ()){
		return;
	}
	var evt = new SweetDevRia.RiaEvent (SweetDevRia.RiaEvent.SETTER_TYPE, this.id, {"name":attrName, "value":attrValue, "sendServer": true});
	this.fireEvent(evt);
};


SweetDevRia.RiaComponent.prototype.updateServerModelStatic = function (srcId, attrName, attrValue) {
	if (! SweetDevRia.ComHelper.isJsfPage ()){
		return;
	}
	
	var evt = new SweetDevRia.RiaEvent (SweetDevRia.RiaEvent.SETTER_TYPE, srcId, {"name":attrName, "value":attrValue, "sendServer": true});

	var sweetDevRiaProxy = SweetDevRiaProxy.getInstance ();
	sweetDevRiaProxy.handleEvent(evt);
};



/**
 * This method is called before Render this menu
 * To be overriden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.RiaComponent.prototype.beforeRender = function (){  /* override this */ return true;  };

/**
 * This method is called after Render this menu
 * To be overriden !!
 */
SweetDevRia.RiaComponent.prototype.afterRender = function (){  /* override this */ };


/**
 * Render this component if exist a template
 * @param {String} containerId It's the container id which will contain this component. Default value is this.id+"_container".
 * @private
 */
SweetDevRia.RiaComponent.prototype.render = function(containerId){
	if (this.beforeRender ())  {
		if (containerId == null){
			containerId = this.id+"_container";
		}

		if (this.template) {
			if (containerId != null) {
				var container = document.getElementById (containerId);
				if (container) {
					
					if (this.bodyContent == null) {
						this.bodyContent = container.innerHTML;
					}
					
					var str =  this.getRenderString (this.template);

					container.innerHTML = str;
				}
				else {
					SweetDevRia.log.error("RiaComponent render : container is null !");
				}
			}
		}
	
		this.afterRender ();
	}	

};


SweetDevRia.RiaComponent.prototype.getRenderString = function(template){
	if (this.template) {
		var str =  TrimPath.processDOMTemplate(template, this);
		return str;
	}
	
	return null;
};



/**
 * Return a message contained in the i18n map from a key
 * @param {String} key The message key inside the i18n map
 * @private
 */
SweetDevRia.RiaComponent.prototype.getMessage =  function (key) {
	if (this.i18n) {
		return this.i18n  [key];
	}
	
	return null;
};


SweetDevRia.RiaComponent.prototype.fireEventListener =  function (eventType) {
	var ria = SweetDevRia.getInstance ();
	
	if (ria.listeners [this.id] && ria.listeners [this.id][eventType]) {
		var listeners = ria.listeners [this.id][eventType];

		for (var i = 0; i < listeners.length; i++) {
			var listener = listeners [i];
			var handler = listener [0];
			var param = listener [1];
			
			handler.call (this, param);
		}
	}			
};

