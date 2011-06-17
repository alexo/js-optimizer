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
 * @class ClickToOpen.
 * @constructor
 * @param {String} id 	the id of the clickToOpen
 * @param {int} shiftX 	the number of pixels to shift the tooltip on X's from the link
 * @param {int} shiftY 	the number of pixels to shift the tooltip on Y's from the link
 */ 
SweetDevRia.ClickToOpen = function(id, shiftX, shiftY) {
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.ClickToOpen");
	superClass (this, SweetDevRia.Hookeable, id);
	superClass (this, SweetDevRia.Hooker, id);

    this.frame = SweetDevRia.DomHelper.get(id);
    this.shiftX = shiftX;
    this.shiftY = shiftY;
    this.opened = false;
    this.useFixedZIndex = false;
    this.zIndex = 0;

    /**
     * Do I need to harm the timer to check if referer link has moved ?
     */
    this.autoClose = true;

	/**
	 * Timer ID wich check if referer has moved.
	 * @type Timer
	 */
    this.refererTimerChecker = 0;
    
    /**
     * Initial referer X position.
     * @type int
     */
    this.refererPosX = null;

    /**
     * Initial referer Y position.
     * @type int
     */
    this.refererPosY = null;

    /* Assigning event on buttons and images */
    var closeLink = SweetDevRia.DomHelper.get('closeLinkCTO' + this.id);
    if (closeLink) {
	   	SweetDevRia.EventHelper.addListener(closeLink, "click", this.doClose, this);
	   	closeLink.onmouseover = function() {
            this.className = "ideo-cto-closeIconHover";
        };
        closeLink.onmouseout = function() {
            this.className = "ideo-cto-closeIcon";
        };
        closeLink.onmousedown = function() {
            this.className = "ideo-cto-closeIconDown";
        };
	}

    /* ************************* *
     * ******** IE HACK ******** *
     * ************************* *
     * Width problem if parent is a TD on IE, so changing parent.
     */
	if (browser.isNS) {
		if (this.frame.parentNode && this.frame.parentNode.nodeName) {
			var parentNode = this.frame.parentNode.nodeName;
			/* Warning : if parentNode is a FORM and parent is changed, IE can't open the page ! (fatal error) */
			if (parentNode == "TD") {
				var body = document.getElementsByTagName("BODY")[0];
				body.appendChild(this.frame);
			}
		}
	}
};

extendsClass(SweetDevRia.ClickToOpen, SweetDevRia.RiaComponent);
extendsClass(SweetDevRia.ClickToOpen, SweetDevRia.Hookeable);
extendsClass(SweetDevRia.ClickToOpen, SweetDevRia.Hooker);

/**
 * Open a ClickToOpen.
 * @param {String} aLink 	Refering link used to calculate position where open tooltip.
 * @return True if the element has been opened, false if it has been closed
 * @type boolean
 */
SweetDevRia.ClickToOpen.prototype.open = function(aLink) {
    if (this.opened) {
	    this.close();
        return false;
    }
    
    this.tryHooking(this.frame);
	
	this.referenceNode = document.createElement("input");
	this.referenceNode.id = this.frame.id+"_REF";
	this.referenceNode.type = 'hidden';
	this.frame.parentNode.insertBefore(this.referenceNode, this.frame);

	/**
	 * SRL : Hack for correct  
	 */
	if (this.frame.parentNode != document.body) {
		document.body.appendChild (this.frame);
	} 

    var top = parseInt(SweetDevRia.DomHelper.getY(aLink), 10);
    var left = parseInt(SweetDevRia.DomHelper.getX(aLink), 10);
    var topScroll = top - SweetDevRia.DomHelper.getScrolledTop();
    var leftScroll = left - SweetDevRia.DomHelper.getScrolledLeft();
    var smartPosition = true;

    if (!isNaN(this.shiftY) && (parseInt(this.shiftY, 10) !== 0)) {
        top += parseInt(this.shiftY, 10);
        smartPosition = false;
    }

    if (!isNaN(this.shiftX) && (parseInt(this.shiftX, 10) !== 0)) {
        left += parseInt(this.shiftX, 10);
        smartPosition = false;
    }
	
	// TT 287
	document.body.appendChild (this.frame);
	
    this.frame.style.display = 'block';
	
    if (smartPosition) {
        // Getting browser's width and height
        var frameWidth = YAHOO.util.Dom.getClientWidth();
        var frameHeight = YAHOO.util.Dom.getClientHeight();
        
        var tooltipWidth = parseInt(SweetDevRia.DomHelper.getWidth(this.frame), 10);
		var tooltipHeight = parseInt(SweetDevRia.DomHelper.getHeight(this.frame), 10);
        
        // Processing offsets
        var     offsetRight = frameWidth - (leftScroll + tooltipWidth),
                offsetLeft = (leftScroll + aLink.offsetWidth - tooltipWidth),
                offsetBottom = frameHeight - (topScroll + aLink.offsetHeight + tooltipHeight),
                offsetTop = (topScroll - tooltipHeight);

        // Align right (by default) or left
        if (offsetRight > 0) {
          null;
        } 
        else if (offsetLeft > offsetRight) {
            left -= tooltipWidth - aLink.scrollWidth;
        }

        // Align bottom (by default) or top
        if (offsetBottom > 0) {
            // If it's some space under the link
            top += aLink.scrollHeight + 2;
        } else if (offsetTop > offsetBottom){
            // If it's some space over the link
            top -= tooltipHeight;
        } else {
            // If it isnt some space, forcing under the link
            top += aLink.scrollHeight + 2;
        }
    }

	/** SRL ::  Mandatory for datagrid scrolling  */
	if (browser.isNS) {
		var parentScrollTop = 0;
		var parent = this.frame.parentNode;
		while (parent !== null && parent != document.body) {
			parentScrollTop += parent.scrollTop;
			parent=  parent.parentNode;
		}
	}

	SweetDevRia.DomHelper.setY(this.frame, top);
	SweetDevRia.DomHelper.setX(this.frame, left);

	//see if it works applying it up
    if (this.useFixedZIndex) {
      this.frame.style.zIndex = this.zIndex;
    } else {
		var zindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex (true);
		this.frame.style.zIndex = zindex;
    }

    this.setActive(true);
    this.opened = true;

    /* BUG FIX IE SELECT */
    /* On IE 5.5, hide all selects */
    SweetDevRia.LayoutManager.changeSelectVisibility(document, false);
    /* On IE 6, apply a transparent iframe on each window */
    SweetDevRia.LayoutManager.addMaskIFrame(this.id, this.frame);

	/* This is the only way to make it work in IE (and, of course, Firefox) */
	if (this.autoClose) {
	    this.refererTimerChecker = window.setInterval("checkReferer('"+this.id+"','"+aLink.id+"',"+parseInt(SweetDevRia.DomHelper.getY(aLink), 10)+","+parseInt(SweetDevRia.DomHelper.getX(aLink), 10)+")", 500);
	}

    return true;
};


/**
 * Compare old and new position from HTML referer (link).
 * Different positions means that the referer has moved from initial position and that the tooltip is no more well set on page.
 * And so, we must close it.
 * @param {String} tooltip Tooltip JavaScript object Id.
 * @param {String} refererLink HTML referer link Id to calculate new position.
 * @param {String} oldTop Old HTML referer link Y position.
 * @param {String} oldLeft Old HTML referer link X position.
 */
function checkReferer (tooltip, refererLink, oldTop, oldLeft) {
    var top = parseInt(SweetDevRia.DomHelper.getY(refererLink), 10);
    var left = parseInt(SweetDevRia.DomHelper.getX(refererLink), 10);

	if (oldTop != top || oldLeft != left) {
		SweetDevRia.getComponent(tooltip).close();
	}
}

/**
 * Closing callback function called by EventHelper.addListener.
 * @param {Event} e event.
 * @param {Object} tooltip Click to open tooltip.
 */
SweetDevRia.ClickToOpen.prototype.doClose = function(e, tooltip) {
	tooltip.close();
	return false;
};

/**
 * Closing function.
 */
SweetDevRia.ClickToOpen.prototype.close = function() {
	this.closeHooked();
    this.frame.style.zIndex = 0;
    this.frame.style.display = 'none';
    this.opened = false;

   	this.setActive (false);

    // Bug on Firefox 1.0.7
    if (navigator.userAgent.indexOf("Firefox/1.0") != -1) {
        SweetDevRia.DomHelper.get('closeLinkCTO' + this.id).onmouseout();
    }

    /** BUG FIX IE SELECT */
//    if (SweetDevRia.size(this.className) === 0) {
        /* On IE 5.5, show all select boxes precedently hidden */
        SweetDevRia.LayoutManager.changeSelectVisibility(document, true);
//    }
    /* On IE 6, remove IFRAME */
    SweetDevRia.LayoutManager.removeTransparentIFrame(this.id, this.frame);

	if (this.autoClose) {
		window.clearInterval(this.refererTimerChecker);
		this.refererTimerChecker = 0;
	}

	if(this.referenceNode){ // it has been popup, we must close it and replace it into the page.
		this.referenceNode.parentNode.insertBefore(this.frame, this.referenceNode);
		this.frame.parentNode.removeChild(this.referenceNode);
		this.referenceNode = undefined;
	}
	
    return true;
};

/**
 * Set a fixed z index on tooltip.
 * @param {int} zIndex Z-Index to set on tooltip.
 */
SweetDevRia.ClickToOpen.prototype.setFixedZIndex = function(zIndex) {
    this.useFixedZIndex = true;
    this.zIndex = zIndex;
};

/**
 * Handle keyboard event.
 * @param {Event} evt Event.
 * @return {boolean} true if event is not active, false if component was closed.
 */
SweetDevRia.ClickToOpen.prototype.handleEvent = function(evt) {
	if (!this.isActive()) {
		return true;
	}

	if (evt && evt.type) {
		if (evt.type == SweetDevRia.RiaEvent.KEYBOARD_TYPE) {
			if (evt.keyCode == SweetDevRia.KeyListener.ESCAPE_KEY) {
				this.close();
				SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
				SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
				return false;
			}
		}
	}
};
