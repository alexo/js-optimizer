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


function extendsClass (childClass) {
  var parents = arguments;
  for (var i = 1; i < parents.length; i++) {
    var parentClass = parents [i];
    var tmp = new parentClass;
    for (var j in tmp) {
      childClass.prototype [j] = tmp [j];
    }
  }
}


function superClass (child, parentClass) {
	var args = [];
	for (var i = 2; i < arguments.length; i++) {
		args [args.length] = arguments [i];
	}
	
	child.base = parentClass;
	  
	child.base.apply ( child, args);
}

SweetDevRia.get = SweetDevRia_get;
SweetDevRia.set = SweetDevRia_set;
SweetDevRia.register = SweetDevRia_register;
SweetDevRia.unregister = SweetDevRia_unregister;
SweetDevRia.getComponent = SweetDevRia_getComponent;
SweetDevRia.getUrlParams = SweetDevRia_getUrlParams;
SweetDevRia.addUrlParam = SweetDevRia_addUrlParam;

SweetDevRia.getInstances = SweetDevRia_getInstances;
SweetDevRia.setInstance = SweetDevRia_setInstance;
SweetDevRia.remove = SweetDevRia_remove;
SweetDevRia.removeInstance = SweetDevRia_removeInstance;
SweetDevRia.size = SweetDevRia_size;

SweetDevRia.dp = SweetDevRia_displayProperties;

if(SweetDevRia._instance == null){//JUM : allow double resourcesImport inclusion TT 383
	SweetDevRia._instance = new SweetDevRia();
}

SweetDevRia.getInstance = function () {
	return SweetDevRia._instance;
};

/**
  * Available values for log levels :
  *		_ Log.DEBUG
  *		_ Log.INFO
  *		_ Log.ERROR
  *		_ Log.FATAL
  *		_ Log.WARN
  *		_ Log.NONE
  * Available values for display :
  *		_ Log.popupLogger : shows logs on a popup.
  *		_ Log.consoleLogger : show logs in javascript console.
  *
  */
SweetDevRia.log = new SweetDevRiaLog(Log.ERROR, Log.consoleLogger);
SweetDevRia.errorLog = new SweetDevRiaLog(Log.ERROR, Log.consoleLogger);

SweetDevRia.CONTAINER_SUFFIXE = "_container";
SweetDevRia.COMPONENTS_REPOSITORY = "componentsRepository";
SweetDevRia.CLASSNAME_SUFFIXE = "_Instances";
  
/**
 * @see SweetDevRia_getComponent(componentId)
 */  
SweetDevRia.$= function (id){return SweetDevRia.getComponent(id);};

SweetDevRia.riaComponentParentIds=  [];

/** 
 * Init function triggered on the window onload
 * @static
 */
function SweetDevRia_init () {
	var proxy = SweetDevRiaProxy.getInstance();
	proxy.fireEvent (new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.INIT_TYPE, proxy.id));
	
	document.toInitialize = {};
	window.initialized = true;
}

/** 
 * Initializes all the SweetDEv RIA component in the page, even after a page load
 * @static
 */
function SweetDevRia_initCompNotInitialized () {
	var proxy = SweetDevRiaProxy.getInstance();
	var evt = new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.INIT_TYPE, proxy.id);
	
	if (document.toInitialize) {
		for (var id in document.toInitialize) {
			var comp = SweetDevRia.getComponent (id);
			if (comp) {
				proxy.sendEvent (comp, evt);
			}
		}
		document.toInitialize = {};
	}
}

/** 
 * Return all the instances for a specified className (Example : "SweetDevRia.Grid");
 * @static
 */
function SweetDevRia_getAllInstances (className) {
	var instance = SweetDevRia.getInstance ();
	var repository = instance.repository;

	var instancesRepo = repository [className+SweetDevRia.CLASSNAME_SUFFIXE];

	return instancesRepo;
}
SweetDevRia.getAllInstances = SweetDevRia_getAllInstances;


/**
 * Register a new component in the repository
 * @param {Object} the component to register. This component must extends SweetDevRia.RiaComponent
 * @static
 * @private
 */
function SweetDevRia_register (component) {
	SweetDevRia.set (component.id, SweetDevRia.COMPONENTS_REPOSITORY, component);
	SweetDevRia.setInstance (component.className, component.id);
}

/**
 * Unregister a component in the repository
 * @param {Object} the component to unregister. This component must extends SweetDevRia.RiaComponent
 * @static
 * @private
 */
function SweetDevRia_unregister (component) {
	SweetDevRia.remove (component.id, SweetDevRia.COMPONENTS_REPOSITORY);
	SweetDevRia.removeInstance (component.className, component.id);
}

/**
 * Return a SweetDevRia instance according to its id
 * @param {String} componentId the id of the component to return.
 * @return a registered SweetDevRia instance according to its id
 * @type Object
 * @static
 */
function SweetDevRia_getComponent (componentId) {
	return SweetDevRia.get (componentId, SweetDevRia.COMPONENTS_REPOSITORY);
}

/** 
 *  Retourne la valeur d'une variable stock?e
 * 	@param {String} key nom de la variable ? retourner
 * 	@param {String} repositoryKey nom d'une r?f?rentiel ou est stock?
 * 					la variable ? retourner
 * 	@return la valeur d'une variable stock?e
 * 	@type Object
 */
function SweetDevRia_get (key, repositoryKey) {
	var instance = SweetDevRia.getInstance ();
	var repository = instance.repository;

	if ((repositoryKey !== null) && (repositoryKey !== undefined)) {
		repository = instance.repository [repositoryKey];
	}

	if (repository) {
		/** On retourne la valeur ayant la @key comme cl? */	
		return repository [key];
	}
	else {
		/** Le r?f?rentiel recherch? n'existe pas, on retourne null */
		return null;
	}
}

/** 
 *  Enregistre une valeur d'une variable stock?e
 * 	@param {String} key nom de la variable ? sauvebarder ou modifier
 * 	@param {String} repositoryKey nom d'une r?f?rentiel ou est stock?
 * 					la variable ? sauvegarder ou modifier
 * 	@param {Object} value nouvelle valeur de la variable stock?e
 */
function SweetDevRia_set (key, repositoryKey, value) {
	var instance = SweetDevRia.getInstance ();
	var repository = instance.repository;
	
	if (repositoryKey !== null) {
		repository = instance.repository [repositoryKey];
		
		/** Si le r?f?rentiel recherch? n'existe pas, on le cr?e */
		if ((repository === null) || (repository == undefined)) {
			instance.repository [repositoryKey] = {};
			repository = instance.repository [repositoryKey];
		}
	}

	/** On enregistre la valeur */	
	repository [key] = value;
}

/** 
 *  Delete value 
 * 	@param {String} key nom de la variable ? sauvebarder ou modifier
 * 	@param {String} repositoryKey nom d'une r?f?rentiel ou est stock?
 * 					la variable ? sauvegarder ou modifier
 */
function SweetDevRia_remove (key, repositoryKey) {
	var instance = SweetDevRia.getInstance ();
	var repository = instance.repository;
	
	if (repositoryKey !== null) {
		repository = instance.repository [repositoryKey];
	}

	if (repository !== null) {
		/** On enregistre la valeur */	
		repository [key] = null;
	}
}

function SweetDevRia_getInstance (className, id) {
	var repository = SweetDevRia.getInstance ().repository;
	var instancesRepo = repository [className+SweetDevRia.CLASSNAME_SUFFIXE];

	if ((instancesRepo !== null) && (instancesRepo != undefined)) {
		for (var i = 0; i < instancesRepo.length; i++) {
			if (instancesRepo [i] == id) {
				return instancesRepo [i];
			}	
		}
	}
	
	return null;
}

function SweetDevRia_getInstances (className) {
	var repository = SweetDevRia.getInstance ().repository;
	return repository [className+SweetDevRia.CLASSNAME_SUFFIXE];
}

function SweetDevRia_setInstance (className, id) {
	var repository = SweetDevRia.getInstance ().repository;
	var instancesRepo = repository [className+SweetDevRia.CLASSNAME_SUFFIXE];

	if ((instancesRepo === null) || (instancesRepo == undefined)) {
		repository [className+SweetDevRia.CLASSNAME_SUFFIXE] = [];
		instancesRepo = repository [className+SweetDevRia.CLASSNAME_SUFFIXE];
	}
	
	instancesRepo [instancesRepo.length] = id;
}

function SweetDevRia_removeInstance (className, id) {
	var repository = SweetDevRia.getInstance ().repository;
	var instancesRepo = repository [className+SweetDevRia.CLASSNAME_SUFFIXE];

	if ((instancesRepo !== null) && (instancesRepo !== undefined)) {
		var tmp = [];
		for (var i = 0; i < instancesRepo.length; i++) {
			if (instancesRepo [i] != id) {
				tmp [tmp.length] = instancesRepo [i];
			}
		}
		
		instancesRepo = tmp;
	}
}

function SweetDevRia_size (className) {
	var repository = SweetDevRia.getInstance ().repository;
	var instancesRepo = repository [className+SweetDevRia.CLASSNAME_SUFFIXE];

	if ((instancesRepo !== null) && (instancesRepo !== undefined)) {
		return instancesRepo.length;
	}
	
	return 0;
}



/** 
 * Retourne un toString d'un objet
 * @param {Object} objet dont on souhaite le toString
 * @return une chaine contenant les diff?rentes valeurs de l'objet
 * @type String
 */
function SweetDevRia_displayProperties (obj) {
	var rep = "";
	
	for (var i in obj) {
		if (typeof (i)== "function"){
			rep += i + " :: (function)\n";		
		}
		else{
			rep += i + " :: "+obj [i]+"\n";
		}		
	}
	
	return rep;
}

function SweetDevRia_getUrlParams () {
	var params = {};
	var location = window.location+"";
	var index = location.indexOf ("?");
	if (index > 0) {
		location = location.substring (index+1);
		var tab = location.split ("&");
		for (var i = 0; i < tab.length; i++) {
			var equalIndex = tab[i].indexOf ("=");
			if (equalIndex > 0) {
				var name = tab[i].substring (0, equalIndex);
				var value = tab[i].substring (equalIndex + 1);
				params [name] = value;
			}
		}
	}
	
	return params;
}

function SweetDevRia_addUrlParam (name, value) {
	var location = window.location+"";
	var index = location.indexOf ("?");
	if (index > 0) {
		location += "&";
	}
	else {
		location += "?";
	}
	
	location += name + "=" + value;
	window.location = location;
}

/**
 * Add a listener on a SweetDevRia component event.
 * These events are triggered on some components main action (window opening...). 
 * @param {Object} comp the SweetDevRia component we are listening an event on
 * @param {String} eventType the type of the event
 * @param {function} handler A function handling the event.
 * @param {Object} param some parameters to pass to the function
 */
SweetDevRia.addListener =  function (comp, eventType, handler, param) {
	if (comp.isRiaComponent) {
		var id = comp.id;	
		var ria = SweetDevRia.getInstance ();
		
		if (! ria.listeners [id]) {
			ria.listeners [id] = {};
		}
		if (! ria.listeners [id][eventType]) {
			ria.listeners [id][eventType] = [];
		}				

		ria.listeners [id][eventType].add ([handler, param]);
				
		return true;
	}
	
	return false;
};

SweetDevRia.removeListener =  function (comp, eventType) {
	if (comp.isRiaComponent) {
		var id = comp.id;	
		var ria = SweetDevRia.getInstance ();
		
		if (ria.listeners [id]) {
			ria.listeners [id][eventType] = [];
		}				
				
		return true;
	}
	
	return false;
};


SweetDevRia.EventHelper.addListener (window, "load", SweetDevRia_init);