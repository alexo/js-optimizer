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
 * @class Events utility class
 * @constructor
 */ 
SweetDevRia.EventHelper = function() {
	null;
};

/** Static methods */

SweetDevRia.EventHelper.MOUSE_LEFT		= 1;
SweetDevRia.EventHelper.MOUSE_RIGHT		= 2;
SweetDevRia.EventHelper.MOUSE_MIDDLE	= 3;

/**
 * Add an event handler.
 * @param {HtmlElement} element DOM object
 * @param   {String} type Event type (i.e. "mousedown")
 * @param {function} handler Function to call when event is detected
 * @param {boolean}  bOverride If true, the obj passed in becomes the execution scope of the listener
 * @return {boolean} True if the action was successful or defered, false if one or more of the elements could not have the event bound to it.
 */
SweetDevRia.EventHelper.addListener = function(element, type, handler, oScope, bOverride) {
	
	return YAHOO.util.Event.addListener(element, type, handler, oScope, bOverride);
};
      
/**
 * Remove an event handler.
 * @param {HtmlElement}  element DOM object
 * @param   {String} type Event type (i.e. "mousedown")
 * @param {function} handler Function to remove when event is detected
 * @param {Function} fn the method the event invokes
 * @return {boolean} true if the unbind was successful, false 
 */  
SweetDevRia.EventHelper.removeListener = function(element, type, handler, index) {
	return YAHOO.util.Event.removeListener(element, type, handler, index);
};

/**
 * Return a cross browser and standard event
 * @param {event} evt Origin event
 * @return Standard event
 * @type event   
 */ 
SweetDevRia.EventHelper.getEvent = function(evt) {
    /** IE case */
    if (!evt) {
    	evt = window.event;
    }

    /** Get the event */
    evt.src = evt.target;
    if (! evt.src) {
    	evt.src = evt.srcElement;
    }

	/* Detection of the mouse button
	 *				L M R
	 * IE,KON		1 4 2  event.button
	 * NS,OP8,FF	0 1 2  e.button
	 * OP7 			1 3 2  e.button
	 * NS,OP8,FF	1 2 3  e.which
	*/
	if (evt.button) {
		evt.clickedButton = evt.button;
		if (evt.clickedButton === 0) {
			evt.clickedButton = SweetDevRia.EventHelper.MOUSE_LEFT;
		}
		if (evt.clickedButton === 4) {
			evt.clickedButton = SweetDevRia.EventHelper.MOUSE_MIDDLE;
		}
	} else if (evt.which !== null && evt.which !== undefined) {
		evt.clickedButton = evt.which;
		if (evt.clickedButton === 3) {
			evt.clickedButton = SweetDevRia.EventHelper.MOUSE_RIGHT;
		} else if (evt.clickedButton === 2) {
			evt.clickedButton = SweetDevRia.EventHelper.MOUSE_MIDDLE;
		}
	}

	evt.leftButton = (evt.clickedButton == SweetDevRia.EventHelper.MOUSE_LEFT);
	evt.rightButton = (evt.clickedButton == SweetDevRia.EventHelper.MOUSE_RIGHT);
	evt.middleButton = (evt.clickedButton == SweetDevRia.EventHelper.MOUSE_MIDDLE);
    
    return evt;
};


/** 
 * Create a specific event
 * @param {String} Event type
 * @param {Object} src Source object
 * @return event
 * @type CustomEvent
 */
SweetDevRia.EventHelper.customEvent = function(type, src) {
	return new YAHOO.util.CustomEvent(type, src);
};


/**
 * Generate a mouse event
 * @param {HTMLElement} DOM Object where generate mouse click
 * @param {String} eventType Event type (i.e. 'mousedown', 'mouseup', etc)
 * @param {int} 	x 		X position where click
 * @param {int} 	y 		Y position where click
 * @param {int} 	button	Mouse button
 */
SweetDevRia.EventHelper.fireMouseEvent = function(element, eventType, x, y, button) {
	if (button === null) {
		button = 1;
	}

	var evObj = null;
   	if( document.createEvent ) {
	  evObj = document.createEvent('MouseEvents');
	  evObj.initMouseEvent( eventType, true, false, window, 0, x,y,x,y, false, false, false, false, button, element );
	  element.dispatchEvent(evObj);
	} else if( document.createEventObject ) {
	  evObj = document.createEventObject();
	  evObj.clientX = x;
	  evObj.clientY = y;
	  
	  evObj.button = button;
	  element.fireEvent('on'+eventType,evObj);
	}
};

/**
 * Stop event propagation.
 * @param {event} event.
 */
SweetDevRia.EventHelper.stopPropagation = function(event) {
	if (!event){
		event = window.event;
	}
	YAHOO.util.Event.stopPropagation(event);
};

SweetDevRia.EventHelper.preventDefault = function(evt) {
	if (!evt){
		evt = window.event;
	}
	if (evt) {
		if (evt.preventDefault) {
			evt.preventDefault ();
		}
		else {
			evt.returnValue = false;
		}
	}
};