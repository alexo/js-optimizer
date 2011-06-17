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

SweetDevRia.Coords = function(x,y,width,height){
	this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

/**
 * @class Window
 * @constructor
 * @param {String} 	id Identifier of the window
 * @param {int}		x Left position of the Window
 * @param {int} 	y Top position of the window
 * @param {int} 	width Width of the window
 * @param {int} 	height Height of the window
 * @param {int} 	minWidth Minimal width of the window
 * @param {int} 	minHeight Minimal height of the window 
 * @param {int} 	maxWidth Maximal width of the window
 * @param {int} 	maxHeight Maximal height of the window 
 * @param {String} 	url Url to display in the window
 * @param {boolean} modal Is the window modal  
 */ 
SweetDevRia.Window = function(id,x,y,width,height,minWidth,minHeight,maxWidth,maxHeight,url,modal, openAtStartup, loadAtStartup){

	superClass (this, SweetDevRia.RiaComponent, id, SweetDevRia.Window.prototype.className);
	superClass (this, SweetDevRia.Hookeable, id);
	superClass (this, SweetDevRia.Hooker, id);

	this.parentWindowId = this.parentComponentId;
	this.nestedIds = [];
	this.isNestedWindow = (this.parentWindowId != null);

	this.indexId = SweetDevRia.Window.prototype.indexIdCounter;
	SweetDevRia.Window.prototype.indexIdCounter = SweetDevRia.Window.prototype.indexIdCounter + 1;

	if (modal == null) {modal = false;}
	if (openAtStartup == null) {openAtStartup = false;}
	if (x == null) {x = -1;}
	if (y == null) {y = -1;}
	if (minWidth == null) {minWidth = 20;}
	if (minHeight == null) {minHeight = 20;}
	this.title = "  ";
	this.message = null;
	this.isResizable = true;
	this.canMaximize = true;
	this.canMinimize = true;
	this.canClose = true;

    this.coords = new SweetDevRia.Coords(x,y,width,height);
    this.minWidth = minWidth;
    this.minHeight = minHeight;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.url = url;
    this.modal = modal;
    this.isOpen = openAtStartup;
    this.isLoaded = loadAtStartup;

	this.showTitleIcon = true;
	this.showCorner = true;
	this.displayTitleBar = true;
	
	this.parent = document.body;
};

extendsClass(SweetDevRia.Window, SweetDevRia.RiaComponent);
extendsClass(SweetDevRia.Window, SweetDevRia.Hookeable);
extendsClass(SweetDevRia.Window, SweetDevRia.Hooker);

/**
 * Name of the class
 * @type String
 */
SweetDevRia.Window.prototype.className = "Window";
SweetDevRia.Window.prototype.dom = {};
SweetDevRia.Window.prototype.dom.title = "title";
SweetDevRia.Window.prototype.dom.panel = "panel";
SweetDevRia.Window.prototype.dom.state = "state";
SweetDevRia.Window.prototype.dom.minimize = "minimize";
SweetDevRia.Window.prototype.dom.maximize = "maximize";
SweetDevRia.Window.prototype.dom.close = "close";
SweetDevRia.Window.prototype.dom.menu = "menu";
SweetDevRia.Window.prototype.dom.corner = "corner";
SweetDevRia.Window.prototype.dom.titleLabel = "titleLabel";
SweetDevRia.Window.prototype.dom.stateLabel = "stateLabel";
SweetDevRia.Window.prototype.dom.borderN = "borderN";
SweetDevRia.Window.prototype.dom.borderS = "borderS";
SweetDevRia.Window.prototype.dom.borderE = "borderE";
SweetDevRia.Window.prototype.dom.borderW = "borderW";
SweetDevRia.Window.prototype.dom.borderNEH = "borderNEH";
SweetDevRia.Window.prototype.dom.borderNEV = "borderNEV";
SweetDevRia.Window.prototype.dom.borderNWH = "borderNWH";
SweetDevRia.Window.prototype.dom.borderNWV = "borderNWV";
SweetDevRia.Window.prototype.dom.borderSEH = "borderSEH";
SweetDevRia.Window.prototype.dom.borderSEV = "borderSEV";
SweetDevRia.Window.prototype.dom.borderSWH = "borderSWH";
SweetDevRia.Window.prototype.dom.borderSWV = "borderSWV";
SweetDevRia.Window.prototype.dom.invisiblePanel = "invisiblePanel";
SweetDevRia.Window.prototype.dom.invisibleWindow = "invisibleWindow";
SweetDevRia.Window.prototype.dom.invisibleWindowPanel = "invisibleWindowPanel";
SweetDevRia.Window.prototype.dom.dockingSpacer = "dockingSpacer";

SweetDevRia.Window.prototype.docked = false;
SweetDevRia.Window.prototype.dockedWidth = "99%";
SweetDevRia.Window.prototype.dockedPosition = "relative";
SweetDevRia.Window.prototype.dockedX = "0px";
SweetDevRia.Window.prototype.dockedY = "0px";

SweetDevRia.Window.prototype.modalWindow = null;

/**
 * Instance counter
 * @type int
 */
SweetDevRia.Window.prototype.indexIdCounter = 0;
/**
 * Width of the window when it's minimized (default : 100px)
 * @type int
 */
SweetDevRia.Window.prototype.minimizeWidth = 100;
/**
 * Maximum width of the Window (default : 800px)
 * @type int
 */
SweetDevRia.Window.prototype.maxWidth = -1;
/**
 * Maximum height of the Window (default : 800px)
 * @type int
 */
SweetDevRia.Window.prototype.maxHeight = -1;
/**
 * Is window maximized (default : false)
 * @type boolean
 */
SweetDevRia.Window.prototype.isMaximize = false;
/**
 * Is window minimized (default : false)
 * @type boolean
 */
SweetDevRia.Window.prototype.isMinimize = false;
/**
 * Is window open (default : true)
 * @type boolean
 */
SweetDevRia.Window.prototype.isOpen = true;
/**
 * Is statebar visible (default : true)
 * @type boolean
 */
SweetDevRia.Window.prototype.isStateBar = true;
SweetDevRia.Window.prototype.borderWidth = 0;
SweetDevRia.Window.prototype.borderHeight = 0;
/**
 * Is window resizable (default : true)
 * @type boolean
 */
SweetDevRia.Window.prototype.isResizable = true;
SweetDevRia.Window.prototype.active = null;
SweetDevRia.Window.prototype.zIndex = null;
/**
 * Is window modal (default : false)
 * @type boolean
 */
SweetDevRia.Window.prototype.modal = false;
SweetDevRia.Window.prototype.instanceByZIndex = {};
SweetDevRia.Window.prototype.baseZindex = null;

/**
 * Public APIs
 *
 */

/**
 * This method is called before opening a window
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Window.prototype.beforeOpen = function(){ return true; };

/**
 * This method is called after opening a window
 * To be overridden !!
 */
SweetDevRia.Window.prototype.afterOpen = function(){};


/**
 * This method is called before closing a window
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Window.prototype.beforeClose = function(){ return true; };

/**
 * This method is called after closing a window
 * To be overridden !!
 */
SweetDevRia.Window.prototype.afterClose = function(){};


/**
 * Return window dom fragment
 * @type Node
 */
SweetDevRia.Window.prototype.getView = function(){
    return document.getElementById(this.id);
};

/**
 * Return real window internal subElement name
 * @param {String} name 	Generic name of a subElement of the window (Example : SweetDevRia.Window.prototype.dom.menu)
 * @type String
 */
SweetDevRia.Window.prototype.getViewName = function(name){
    if(name === undefined){
		return this.id;
	}
    return this.id + "_" + name;
};

/**
 * Return window internal subElement dom
 * @param {String} id 	Generic name of a subElement of the window (Example : SweetDevRia.Window.prototype.dom.menu)
 * @type HTMLElement
 */
SweetDevRia.Window.prototype.getDomView = function(id){
    //return document.getElementById(SweetDevRia.Window.prototype.className + "_" + id + "@" + this.indexId);
	return document.getElementById(this.id + "_" + id);
};

/**
 * Maximize window
 */
SweetDevRia.Window.prototype.maximize = function(){
    this.isMaximize = !this.isMaximize;

    if(!this.isMaximize){
		this.updateServerModel ("state_maximize", this.isMaximize);
        this.restore();
        return;
    }
    if(!this.isMinimize){		
		this.saveCoords();
	}
    else{
		this.restore();
	}
    this.isMaximize = true;
    var maximizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.maximize);
    maximizeIcon.className = "ideo-win-maxRestoreIcon";
    this.hideBorders();
    this.moveTo(0,0);
    this.resizeTo(this.getMaxWidth(),this.getMaxHeight());
    this.renderPanelSize();
    YAHOO.util.Event.purgeElement(this.getView(),false,'mousedown');
    this.setStateBar(this.isStateBar);

	this.updateServerModel ("state_maximize", this.isMaximize);
	this.updateServerModel ("x", this.getCoordX());
	this.updateServerModel ("y", this.getCoordY());
	this.updateServerModel ("height", this.coords.height);
	this.updateServerModel ("width", this.coords.width);
};

/**
 * Minimize window
 */
SweetDevRia.Window.prototype.minimize = function(){
    this.isMinimize = !this.isMinimize;
    if(!this.isMinimize){
	    this.updateServerModel ("state_minimize", this.isMinimize);
        this.restore();
        return;
    }
    if(!this.isMaximize){
		this.saveCoords();		
	}
    else{
		this.restore();
	}
    this.isMinimize = true;
    var minimizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.minimize);
    minimizeIcon.className = "ideo-win-minRestoreIcon";
    this.hideBorders();
    var nodeWindow = this.getView();
    var nodePanel = this.getDomView(SweetDevRia.Window.prototype.dom.panel);
    var nodeState = this.getDomView(SweetDevRia.Window.prototype.dom.state);
    var nodeTitle = this.getDomView(SweetDevRia.Window.prototype.dom.title);
    if(!this.docked){
	    nodeWindow.style.width = this.minimizeWidth + "px";
	}
	else{
		nodeWindow.style.width = SweetDevRia.Window.prototype.dockedWidth;
	}
    nodeWindow.style.height = nodeTitle.offsetHeight + "px";
    nodePanel.style.display = "none";
	if (nodeState) {
	    nodeState.style.display = "none";
	}
    YAHOO.util.Event.purgeElement(this.getView(),false,'mousedown');
    this.dragDrogFunction();
    this.updateServerModel ("state_minimize", this.isMinimize);
	this.updateServerModel ("x", this.getCoordX());
	this.updateServerModel ("y", this.getCoordY());
	this.updateServerModel ("height", this.coords.height);
	this.updateServerModel ("width", this.coords.width);
	
};

/**
 * Open window
 */
SweetDevRia.Window.prototype.open = function(){
	
	if(this.beforeOpen()){
	
		//lazy load
		if(!this.isLoaded){
			if(this.url!=undefined){
				this.setUrl(this.getUrl());
			}else{
				SweetDevRia.$(this.id+"_zone").callServer();
			}
			this.isLoaded = true;
		}
	
	    this.getView().style.display = "";
	    this.isOpen = true;
		
	    this.tryHooking(this.getView());
		
	    //this line place the window correctly 
	    this.moveTo(this.getX(),this.getY());
	
	    this.setActive();
	    this.renderPanelSize();
	    this.updateServerModel ("rendered", true);
	
		this.fireEventListener ("open");
		
		this.afterOpen();	
	}
};

/**
 * Close window
 */
SweetDevRia.Window.prototype.close = function(){
	if(this.beforeClose()){
	
		this.closeHooked();
	    SweetDevRia.Window.prototype.active = null;
	    this.getView().style.display = "none";
	
	    this.isOpen = false;
	    
	    if (this.isModal()) {
		   	var _modalPanel = SweetDevRia.ModalPanel.getInstance();
		 	_modalPanel.hide ();
			
			//replace the window
			if(this.referenceNode){
				this.referenceNode.parentNode.insertBefore(this.getView(), this.referenceNode);
				this.getView().parentNode.removeChild(this.referenceNode);
				this.referenceNode = undefined;
			}
		
		    var node = this.getView();
		    node.style.zIndex = this.zIndex;
		}
	    
	    SweetDevRia.Window.prototype.updateActiveWindow();
	    this.updateServerModel ("rendered", false);
	    
		this.fireEventListener ("close");
		
		this.afterClose();
	}
};

/**
 * Event call when user click on the menu button (abstract). Override this to have a custom behavior.
 */
SweetDevRia.Window.prototype.menu = function(){
    SweetDevRia.log.debug("Add your event !");
};    

/**
 * Restore the window (not maximized and not minimized)
 */
SweetDevRia.Window.prototype.restore = function(){
    this.isMinimize = false;
    this.isMaximize = false;
    var minimizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.minimize);
	if(minimizeIcon) {
	    minimizeIcon.className = "ideo-win-minIcon";
	}
    var maximizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.maximize);
	if(maximizeIcon) {
    	maximizeIcon.className = "ideo-win-maxIcon";
	}
    var nodeWindow = this.getView();
    var nodeTitle = this.getDomView(SweetDevRia.Window.prototype.dom.title);
    var nodePanel = this.getDomView(SweetDevRia.Window.prototype.dom.panel);
    var nodeState = this.getDomView(SweetDevRia.Window.prototype.dom.state);
    nodePanel.style.display = "";
    if (nodeState) {
		nodeState.style.display = "";	
	}
    if(!this.docked){
	    this.resizeTo(this.coords.width,this.coords.height);
		
	    this.moveTo(this.getCoordX(),this.getCoordY());
	}
	else{
		nodeWindow.style.position = SweetDevRia.Window.prototype.dockedPosition;
		this.setHeight(this.coords.height);		
	}
    this.renderPanelSize();
    if(this.isResizable){
		this.showBorders();
	}
    else{
		this.hideBorders();
	}
    this.dragDrogFunction();
    this.resizeFunction();
    this.updateForIE();
    this.setStateBar(this.isStateBar);
    //this.updateServerModel ("minimize", this.isMinimize);
    //this.updateServerModel ("maximize", this.isMaximize);
};

/**
 * Return if the window is resizable
 * @type boolean
 */
SweetDevRia.Window.prototype.getReziable = function(){
    return this.isResizable;
};

/**
 * Set if the window is resizable
 * @param {boolean} bool 	The new resizable type.
 */
SweetDevRia.Window.prototype.setReziable = function(bool){
    this.isResizable = bool;
};

/**
 * Show borders of the window for resize
 */
SweetDevRia.Window.prototype.showBorders = function(){
	var borderS = null;
	if(!this.docked){
	    var corner = this.getDomView(SweetDevRia.Window.prototype.dom.corner);
		if (corner) {
		    corner.className = "ideo-win-corner";
		}
	    var borderN = this.getDomView(SweetDevRia.Window.prototype.dom.borderN);
	    borderN.className = "borderN";
	    borderS = this.getDomView(SweetDevRia.Window.prototype.dom.borderS);
	    borderS.className = "borderS";
	    var borderE = this.getDomView(SweetDevRia.Window.prototype.dom.borderE);
	    borderE.className = "borderE";
	    var borderW = this.getDomView(SweetDevRia.Window.prototype.dom.borderW);
	    borderW.className = "borderW";
	    var borderNEH = this.getDomView(SweetDevRia.Window.prototype.dom.borderNEH);
	    borderNEH.className = "borderNEH";
	    var borderNEV = this.getDomView(SweetDevRia.Window.prototype.dom.borderNEV);
	    borderNEV.className = "borderNEV";
	    var borderNWH = this.getDomView(SweetDevRia.Window.prototype.dom.borderNWH);
	    borderNWH.className = "borderNWH";
	    var borderNWV = this.getDomView(SweetDevRia.Window.prototype.dom.borderNWV);
	    borderNWV.className = "borderNWV";
	    var borderSEH = this.getDomView(SweetDevRia.Window.prototype.dom.borderSEH);
	    borderSEH.className = "borderSEH";
	    var borderSEV = this.getDomView(SweetDevRia.Window.prototype.dom.borderSEV);
	    borderSEV.className = "borderSEV";
	    var borderSWH = this.getDomView(SweetDevRia.Window.prototype.dom.borderSWH);
	    borderSWH.className = "borderSWH";
	    var borderSWV = this.getDomView(SweetDevRia.Window.prototype.dom.borderSWV);
	    borderSWV.className = "borderSWV";
	}
	else{
	    borderS = this.getDomView(SweetDevRia.Window.prototype.dom.borderS);
	    borderS.className = "borderS";
	}
};
/**
 * Hide borders of the window for resize
 */
SweetDevRia.Window.prototype.hideBorders = function(){
    var corner = this.getDomView(SweetDevRia.Window.prototype.dom.corner);
	if(corner) {
	    corner.className = "ideo-win-cornerDisabled";
	}
    var borderN = this.getDomView(SweetDevRia.Window.prototype.dom.borderN);
    borderN.className = "borderDisabled";
    var borderS = this.getDomView(SweetDevRia.Window.prototype.dom.borderS);
    borderS.className = "borderDisabled";
    var borderE = this.getDomView(SweetDevRia.Window.prototype.dom.borderE);
    borderE.className = "borderDisabled";
    var borderW = this.getDomView(SweetDevRia.Window.prototype.dom.borderW);
    borderW.className = "borderDisabled";
    var borderNEH = this.getDomView(SweetDevRia.Window.prototype.dom.borderNEH);
    borderNEH.className = "borderDisabled";
    var borderNEV = this.getDomView(SweetDevRia.Window.prototype.dom.borderNEV);
    borderNEV.className = "borderDisabled";
    var borderNWH = this.getDomView(SweetDevRia.Window.prototype.dom.borderNWH);
    borderNWH.className = "borderDisabled";
    var borderNWV = this.getDomView(SweetDevRia.Window.prototype.dom.borderNWV);
    borderNWV.className = "borderDisabled";
    var borderSEH = this.getDomView(SweetDevRia.Window.prototype.dom.borderSEH);
    borderSEH.className = "borderDisabled";
    var borderSEV = this.getDomView(SweetDevRia.Window.prototype.dom.borderSEV);
    borderSEV.className = "borderDisabled";
    var borderSWH = this.getDomView(SweetDevRia.Window.prototype.dom.borderSWH);
    borderSWH.className = "borderDisabled";
    var borderSWV = this.getDomView(SweetDevRia.Window.prototype.dom.borderSWV);
    borderSWV.className = "borderDisabled";
};

/**
 * Save window's coordinates and size
 */
SweetDevRia.Window.prototype.saveCoords = function(){
    var node = this.getView();
    this.coords.x = parseInt(node.style.left, 10);
    this.coords.y = parseInt(node.style.top, 10);
    this.coords.width = parseInt(SweetDevRia.DomHelper.parsePx(SweetDevRia.DomHelper.getStyle(node, "width")), 10);
    this.coords.height = parseInt(SweetDevRia.DomHelper.parsePx(SweetDevRia.DomHelper.getStyle(node, "height")), 10);
};

/**
 * Render good panel size
 */
SweetDevRia.Window.prototype.renderPanelSize = function(){
    var nodeWindow = this.getView();
    var nodeTitle = this.getDomView(SweetDevRia.Window.prototype.dom.title);
    var nodeState = this.getDomView(SweetDevRia.Window.prototype.dom.state);
    var nodePanel = this.getDomView(SweetDevRia.Window.prototype.dom.panel);
	var stateHeight = 0;
	if (nodeState) {
		stateHeight = parseInt(nodeState.offsetHeight, 10);
	}

	var newHeight = nodeWindow.offsetHeight - (parseInt(nodeTitle.offsetHeight, 10) + stateHeight + this.borderHeight);
	if (newHeight < 0) {newHeight = 0;}

   nodePanel.style.height = newHeight + "px";

};

/**
 * @private
 */
SweetDevRia.Window.prototype.initialize = function(){
	if (this.parentComponent == null && this.parentComponentId != null) {
		this.parentComponent = SweetDevRia.$ (this.parentComponentId);
	}

	if (this.parentComponent != null) {
		this.parentComponent.nestedIds.add (this.id);
	}

	if (this.parentComponent != null && this.parentComponent.isInitialized != true) {
		this.parent =  document.getElementById (this.parentComponent.id+"_panel");
		
		this.parentComponent.nestedComponent = this;

		return;
	}

	if (this.parent == null) {
		this.parent = document.body;
	}

	var panel;
	if (this.url == null) {
		if (this.content) {
			panel = document.getElementById (this.id+"_panel");
			panel.innerHTML =  this.content;
		}
		else {
			var content = document.getElementById (this.id+"_content");
			panel = document.getElementById (this.id+"_panel");

			panel.appendChild(content);
		}
	}
	
	if (this.isMinimize){ this.minimize(); }
	else if (this.isMaximize){ this.maximize(); }

	this.restore();

	this.init();

	this.isInitialized = true;

	if (document.all && this.nestedComponent != null) {
		this.nestedComponent.initialize ();
	}
};

/**
 * Set good borders size, invisible panel and good z-index for the window at startup
 */
SweetDevRia.Window.prototype.init = function() {
    this.borderWidth = 2;
    this.borderHeight = 2;
    this.getDomView(SweetDevRia.Window.prototype.dom.invisiblePanel).style.display = "none";
    this.initZIndex();

	this.setInactive();

    if(this.modal && this.isOpen){
        SweetDevRia.Window.prototype.modalWindow = this;
	}
	
	//TT 355
    if(this.indexId == (SweetDevRia.Window.prototype.indexIdCounter-1)){
    	SweetDevRia.Window.prototype.updateActiveWindow();
    	if (SweetDevRia.Window.prototype.modalWindow != null) {
        	SweetDevRia.Window.prototype.modalWindow.setActive();
        }
    }

	this.moveTo(this.getCoordX(),this.getCoordY());
};

/**
* Return the last saved X coordinate of the window
* @return the last saved X coordinate of the window
* @type int
*/
SweetDevRia.Window.prototype.getCoordX = function(){
	if (!this.docked && this.coords.x == -1) {
		var clientWidth = SweetDevRia.DomHelper.getClientWidth();
		if(clientWidth < this.coords.width) {
			clientWidth = this.coords.width;
		}

		return (SweetDevRia.DomHelper.getScrolledLeft() + ((clientWidth - this.coords.width) /2));
//TODO		return (((clientWidth - this.coords.width) /2));
	}
	
    return this.coords.x;
};

/**
* Return the last saved Y coordinate of the window
* @return the last saved Y coordinate of the window
* @type int
*/
SweetDevRia.Window.prototype.getCoordY = function(){
	if (!this.docked && this.coords.y == -1) {

		var clientHeight = SweetDevRia.DomHelper.getClientHeight();
		if(clientHeight < this.coords.height) {
			clientHeight = this.coords.height;
		}

		return (SweetDevRia.DomHelper.getScrolledTop() + ((clientHeight - this.coords.height) /2));
	}
    return this.coords.y;
};

/**
 * Init drag drop events for moving the window at startup
 * @private
 */
SweetDevRia.Window.prototype.dragDrogFunction = function() {

    var move = new YAHOO.util.DD(this.id,"paneldrag");
    move.setHandleElId(this.getViewName(SweetDevRia.Window.prototype.dom.titleLabel));
    this.addInvalidHandlersMove(move);
	
	var obj = this;

    move.onMouseDown = function(e){
        this.resetConstraints();
		
    	SweetDevRia.DomHelper.setCursor('move');
        obj.setActive();
        obj.renderInvisiblePanelSize();

		SweetDevRia.EventHelper.stopPropagation(e);
		SweetDevRia.EventHelper.preventDefault(e);
    };
	
    move.onMouseUp = function(e){
    	SweetDevRia.DomHelper.setCursor('default');
        obj.hideInvisiblePanel();
        obj.setX(obj.getX());
        obj.setY( (obj.getY()<0)?0:obj.getY() );


   	 	var node = obj.getView();
	    obj.coords.x = parseInt(node.style.left, 10);
	    obj.coords.y = parseInt(node.style.top, 10);
	
		
		SweetDevRia.EventHelper.stopPropagation(e);
		SweetDevRia.EventHelper.preventDefault(e);
    };
	
    move.onDragDrop = function(e,id){
        var winNode = null;
        var bodyHeight = null;

    	if(obj.docked){
    		if(id == obj.id){
    			return;
    		}
    		var node = document.getElementById(id);
    		if(node.className == "dockingSpacer"){
    			node = node.parentNode;
    		}

    		if(node.className == "ideo-win-main"){
        		winNode = obj.getView();
    		    var y = SweetDevRia.DomHelper.getEventY(e);
    		    var nodeY = SweetDevRia.DomHelper.getY(node);
    		    var height = node.offsetHeight;
    		    y = y - nodeY;
    		    if(y>(height/2)){
    		    	if(node.nextSibling!==null){
        		    	node = node.nextSibling;
        		    	if(node != winNode){
            				node.parentNode.insertBefore(winNode.parentNode.removeChild(winNode),node);
            			}
            		}
            		else{
	            		node.parentNode.appendChild(winNode.parentNode.removeChild(winNode));
            		}
    		    }
    		    else{
        			node.parentNode.insertBefore(winNode.parentNode.removeChild(winNode),node);
    		    }            		    
        		winNode.style.top = "0px";
        		winNode.style.left = "0px";
        		this.resetConstraints(true);
        		e.garbaged = true;
				
        		bodyHeight = parent.clientHeight;
        		for(var i=0;i<obj.docking.columns.length;i++){
        			document.getElementById(obj.docking.columns[i]).style.height = bodyHeight + "px";
        		}
        		for(var i2=0;i2<obj.docking.spliters.length;i2++){
        			if(document.getElementById(obj.docking.spliters[i2])){
            			document.getElementById(obj.docking.spliters[i2]).style.height = bodyHeight + "px";
            		}
        		}
        		bodyHeight = parent.scrollHeight - 16;
        		for(var i3=0;i3<obj.docking.columns.length;i3++){
        			document.getElementById(obj.docking.columns[i3]).style.height = bodyHeight + "px";
        		}
        		for(var i4=0;i4<obj.docking.spliters.length;i4++){
        			if(document.getElementById(obj.docking.spliters[i4])){
            			document.getElementById(obj.docking.spliters[i4]).style.height = bodyHeight + "px";
            		}
        		}
    		}
    		else if(!e.garbaged){
        		winNode = obj.getView();
        		node.appendChild(winNode.parentNode.removeChild(winNode));
        		winNode.style.top = "0px";
        		winNode.style.left = "0px";
        		this.resetConstraints(true);
        		bodyHeight = parent.clientHeight;
        		for(var i5=0;i5<obj.docking.columns.length;i5++){
        			document.getElementById(obj.docking.columns[i5]).style.height = bodyHeight + "px";
        		}
        		for(var i6=0;i6<obj.docking.spliters.length;i6++){
        			if(document.getElementById(obj.docking.spliters[i6])) {
            			document.getElementById(obj.docking.spliters[i6]).style.height = bodyHeight + "px";
            		}
        		}
        		bodyHeight =parent.scrollHeight - 16;
        		for(var i7=0;i7<obj.docking.columns.length;i7++){
        			document.getElementById(obj.docking.columns[i7]).style.height = bodyHeight + "px";
        		}
        		for(var i8=0;i8<obj.docking.spliters.length;i8++){
        			if(document.getElementById(obj.docking.spliters[i8])) {
            			document.getElementById(obj.docking.spliters[i8]).style.height = bodyHeight + "px";
            		}
        		}
    		}
    	}
    };
};

/**
 * Init drag drop events for resize the window at startup
 * @private
 */
SweetDevRia.Window.prototype.resizeFunction = function() {
    var resizeSE = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.corner), "panelresize", SweetDevRia.Window.prototype.orientations.SE);
    this.addInvalidHandlersResize(resizeSE,SweetDevRia.Window.prototype.dom.corner);
    var resizeBorderSEH = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderSEH), "panelresize", SweetDevRia.Window.prototype.orientations.SE);
    this.addInvalidHandlersResize(resizeBorderSEH,SweetDevRia.Window.prototype.dom.borderSEH);
    var resizeBorderSEV = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderSEV), "panelresize", SweetDevRia.Window.prototype.orientations.SE);
    this.addInvalidHandlersResize(resizeBorderSEV,SweetDevRia.Window.prototype.dom.borderSEV);
    var resizeBorderNEH = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderNEH), "panelresize", SweetDevRia.Window.prototype.orientations.NE);
    this.addInvalidHandlersResize(resizeBorderNEH,SweetDevRia.Window.prototype.dom.borderNEH);
    var resizeBorderNEV = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderNEV), "panelresize", SweetDevRia.Window.prototype.orientations.NE);
    this.addInvalidHandlersResize(resizeBorderNEV,SweetDevRia.Window.prototype.dom.borderNEV);
    var resizeBorderNWH = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderNWH), "panelresize", SweetDevRia.Window.prototype.orientations.NW);
    this.addInvalidHandlersResize(resizeBorderNWH,SweetDevRia.Window.prototype.dom.borderNWH);
    var resizeBorderNWV = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderNWV), "panelresize", SweetDevRia.Window.prototype.orientations.NW);
    this.addInvalidHandlersResize(resizeBorderNWV,SweetDevRia.Window.prototype.dom.borderNWV);            
    var resizeBorderSWH = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderSWH), "panelresize", SweetDevRia.Window.prototype.orientations.SW);
    this.addInvalidHandlersResize(resizeBorderSWH,SweetDevRia.Window.prototype.dom.borderSWH);
    var resizeBorderSWV = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderSWV), "panelresize", SweetDevRia.Window.prototype.orientations.SW);
    this.addInvalidHandlersResize(resizeBorderSWV,SweetDevRia.Window.prototype.dom.borderSWV);
    var resizeE = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderE), "panelresize", SweetDevRia.Window.prototype.orientations.E);
    this.addInvalidHandlersResize(resizeE,SweetDevRia.Window.prototype.dom.borderE);
    var resizeS = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderS), "panelresize", SweetDevRia.Window.prototype.orientations.S);
    this.addInvalidHandlersResize(resizeS,SweetDevRia.Window.prototype.dom.borderS);
    var resizeN = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderN), "panelresize", SweetDevRia.Window.prototype.orientations.N);
    this.addInvalidHandlersResize(resizeN,SweetDevRia.Window.prototype.dom.borderN);
    var resizeW = new this.DDResize(this,this.id,this.getViewName(SweetDevRia.Window.prototype.dom.borderW), "panelresize", SweetDevRia.Window.prototype.orientations.W);
    this.addInvalidHandlersResize(resizeW,SweetDevRia.Window.prototype.dom.borderW);
};
/**
 * Invalid Handlers for drag drop and moving window
 * @private
 */
SweetDevRia.Window.prototype.addInvalidHandlersMove = function(obj){
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.title));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.minimize));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.maximize));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.close));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.menu));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.corner));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderN));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderS));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderE));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderW));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderNEH));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderNEV));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderNWH));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderNWV));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderSEH));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderSEV));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderSWH));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderSWV));
};
/**
 * Invalid Handlers for drag drop and resizing window
 * @private
 */
SweetDevRia.Window.prototype.addInvalidHandlersResize = function(obj,domName){
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.title));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.minimize));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.maximize));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.close));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.menu));
    obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.titleLabel));
    if(domName != SweetDevRia.Window.prototype.dom.corner){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.corner));}
    if(domName != SweetDevRia.Window.prototype.dom.borderN){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderN));}
    if(domName != SweetDevRia.Window.prototype.dom.borderS){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderS));}
    if(domName != SweetDevRia.Window.prototype.dom.borderW){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderW));}
    if(domName != SweetDevRia.Window.prototype.dom.borderE){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderE));}
    if(domName != SweetDevRia.Window.prototype.dom.borderNEH){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderNEH));}
    if(domName != SweetDevRia.Window.prototype.dom.borderNEV){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderNEV));}
    if(domName != SweetDevRia.Window.prototype.dom.borderNWH){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderNWH));}
    if(domName != SweetDevRia.Window.prototype.dom.borderNWV){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderNWV));}
    if(domName != SweetDevRia.Window.prototype.dom.borderSEH){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderSEH));}
    if(domName != SweetDevRia.Window.prototype.dom.borderSEV){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderSEV));}
    if(domName != SweetDevRia.Window.prototype.dom.borderSWH){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderSWH));}
    if(domName != SweetDevRia.Window.prototype.dom.borderSWV){ obj.addInvalidHandleId(this.getViewName(SweetDevRia.Window.prototype.dom.borderSWV));}
};
/**
 * Return width of the window
 * @type int
 */
SweetDevRia.Window.prototype.getWidth = function(){
    var nodeWindow = this.getView();
    return parseInt(nodeWindow.offsetWidth, 10);
};

/**
 * Set width of the window
 * @param {int} width 	New width of the window
 */
SweetDevRia.Window.prototype.setWidth = function(width){
    var nodeWindow = this.getView();

    if(width<this.minWidth){
    	nodeWindow.style.width = this.minWidth + "px";
    }
    else{
    	if(width>this.getMaxWidth()){
    		nodeWindow.style.width = this.getMaxWidth() + "px";
    	}
    	else{
    		nodeWindow.style.width = width + "px";
    	}
    }
    this.renderPanelSize();
	this.updateServerModel ("width", width);
};

/**
 * Return height of the window
 * @type int
 */
SweetDevRia.Window.prototype.getHeight = function(){
    var nodeWindow = this.getView();
    return parseInt(nodeWindow.offsetHeight, 10);
};

/**
 * Set height of the window
 * @param {int} height New height of the window
 */
SweetDevRia.Window.prototype.setHeight = function(height){
    var nodeWindow = this.getView();
    if(height<this.minHeight){
    	nodeWindow.style.height = this.minHeight + "px";
    }
    else{
    	if(height>this.getMaxHeight()){
    		nodeWindow.style.height = this.getMaxHeight() + "px";
    	}
    	else{
    		nodeWindow.style.height = height + "px";
    	}
    }
    this.renderPanelSize();
	this.updateServerModel ("height", height);
};
/**
 * Return X position of the window
 * @type int
 */
SweetDevRia.Window.prototype.getX = function(){
    var nodeWindow = this.getView();
    return parseInt(nodeWindow.style.left, 10);
};
/**
 * Set X position of the window
 * @param {int} x 	New X position of the window
 */
SweetDevRia.Window.prototype.setX = function(x){
    var nodeWindow = this.getView();
    nodeWindow.style.left = x + "px";
	this.updateServerModel ("x", x);
};
/**
 * Return Y position of the window
 * @type int
 */
SweetDevRia.Window.prototype.getY = function(){
    var nodeWindow = this.getView();
    return parseInt(nodeWindow.style.top, 10);
};
/**
 * Set Y position of the window
 * @param {int} y 	New Y position of the window
 */
SweetDevRia.Window.prototype.setY = function(y){
    var nodeWindow = this.getView();
    nodeWindow.style.top = y + "px";
	this.updateServerModel ("y", y);
};
/**
 * Resize window to a new size
 * @param {int} width 	New width of the window
 * @param {int} height 	New height of the window
 */
SweetDevRia.Window.prototype.resizeTo = function(width,height){
    var nodeWindow = this.getView();
    if(width>this.minWidth){
    	nodeWindow.style.width = width + "px";
    }
    else{
    	nodeWindow.style.width = this.minWidth + "px";
    }
    if(height>this.minHeight){
    	nodeWindow.style.height = height + "px";
    }
    else{
    	nodeWindow.style.height = this.minHeight + "px";
    }
    this.renderPanelSize();
	this.updateServerModel ("width", parseInt(width, 10));
	this.updateServerModel ("height", height);
};

/**
 * Move window to a new position
 * @param {int} x 	New X position of the window
 * @param {int} y 	New Y position of the window
 */
SweetDevRia.Window.prototype.moveTo = function(x,y){
    var nodeWindow = this.getView();

    nodeWindow.style.top = y + "px";
    nodeWindow.style.left = x + "px";

	this.updateServerModel ("x", x);
	this.updateServerModel ("y", y);
};
/**
 * Return smallest width that the window can be
 * @type int
 */
SweetDevRia.Window.prototype.getMinWidth = function(){
    return this.minWidth;
};
/**
 * Set smallest width that the window can be
 * @param {int} width 	New smallest width
 */
SweetDevRia.Window.prototype.setMinWidth = function(width){
    this.minWidth = width;
    if(this.minWidth>this.getWidth()){
    	this.setWidth(this.minWidth);
    }
	this.updateServerModel ("minWidth", width);
};
/**
 * Return smallest height that the window can be
 * @type int
 */
SweetDevRia.Window.prototype.getMinHeight = function(){
    return this.minHeight;
};
/**
 * Set smallest height that the window can be
 * @param {int} height 	New smallest height
 */
SweetDevRia.Window.prototype.setMinHeight = function(height){
    this.minHeight = height;
    if(this.minHeight>this.getHeight()){
    	this.setHeight(this.minHeight);
    }
	this.updateServerModel ("minHeight", height);
};

/**
 * Return greatest width that the window can be
 * @type int
 */
SweetDevRia.Window.prototype.getMaxWidth = function(){
	if (this.maxWidth == -1){
		if (this.isNestedWindow) {
			var parentPanel = SweetDevRia.DomHelper.get(this.parentWindowId+"_panel");
			return SweetDevRia.DomHelper.getWidth (parentPanel);
		}
		else {
			return YAHOO.util.Dom.getViewportWidth()-3;
		}
	}
    return this.maxWidth;
};
/**
 * Set greatest width that the window can be
 * @param {int} width 	New greatest width
 */
SweetDevRia.Window.prototype.setMaxWidth = function(width){
    this.maxWidth = width;
    if(this.maxWidth<this.getWidth()){
    	this.setWidth(this.maxWidth);
    }
	this.updateServerModel ("maxWidth", width);
};
/**
 * Return greatest height that the window can be
 * @type int
 */
SweetDevRia.Window.prototype.getMaxHeight = function(){
	if (this.maxHeight == -1){
		if (this.isNestedWindow) {
			var parentPanel = SweetDevRia.DomHelper.get(this.parentWindowId+"_panel");
			return SweetDevRia.DomHelper.getHeight (parentPanel);
		}
		else {
			return YAHOO.util.Dom.getViewportHeight()-3;
		}
	}
    return this.maxHeight;
};
/**
 * Set greatest height that the window can be
 * @param {int} height 	New greatest height
 */
SweetDevRia.Window.prototype.setMaxHeight = function(height){
    this.maxHeight = height;
    if(this.maxHeight<this.getHeight()){
    	this.setHeight(this.maxHeight);
    }
	this.updateServerModel ("maxHeight", height);
};
/**
 * Return width of the window when it's minimized
 * @type int
 */
SweetDevRia.Window.prototype.getMinimizeWidth = function(){
    return this.minimizeWidth;
};
/**
 * Set width of the window when it's minimized
 * @param {int} width 	New width of the window when it's minimized
 */
SweetDevRia.Window.prototype.setMinimizeWidth = function(width){
    this.minimizeWidth = width;
	this.updateServerModel ("minimizeWidth", width);
};
/**
 * Return title of the window
 * @type String
 */
SweetDevRia.Window.prototype.getTitle = function(){
    return this.getDomView(SweetDevRia.Window.prototype.dom.titleLabel).innerHTML;
};
/**
 * Set title of the window
 * @param {String} label 	New title of the window
 */
SweetDevRia.Window.prototype.setTitle = function(label){
    this.getDomView(SweetDevRia.Window.prototype.dom.titleLabel).innerHTML = label;
	this.updateServerModel ("title", label);
};
/**
 * Return message of the statebar
 * @type String
 */
SweetDevRia.Window.prototype.getMessage = function(){
    return this.getDomView(SweetDevRia.Window.prototype.dom.stateLabel).innerHTML;
};
/**
 * Set message of the state bar
 * @param {String} label 	New message of the state bar
 */
SweetDevRia.Window.prototype.setMessage = function(label){
    this.getDomView(SweetDevRia.Window.prototype.dom.stateLabel).innerHTML = label;
	this.updateServerModel ("message", label);
};
/**
 * Return if the state bar is visible
 * @type boolean
 */
SweetDevRia.Window.prototype.isStateBar = function(){
    return this.isStateBar;
};
/**
 * Set if the state bar is visible
 * @param {boolean} bool New state bar visibility
 */
SweetDevRia.Window.prototype.setStateBar = function(bool){
    if(bool){
    	this.showStateBar();
    }
    else{
    	this.hideStateBar();
    }
};
/**
 * Show the state bar
 */
SweetDevRia.Window.prototype.showStateBar = function(){
    this.isStateBar = true;
    var state = this.getDomView(SweetDevRia.Window.prototype.dom.state);
	if (state) {
		state.style.display = "";
	}
	
    this.renderPanelSize();            
};
/**
 * Hide the state bar
 */
SweetDevRia.Window.prototype.hideStateBar = function(){
    this.isStateBar = false;
    this.getDomView(SweetDevRia.Window.prototype.dom.state).style.display = "none";
    this.renderPanelSize();            
};
/**
 * Drag & Drop object for resize
 * @private
 */
SweetDevRia.Window.prototype.DDResize = function(obj, panelElId, handleElId, sGroup, orientation ,config) {
    if (panelElId) {
        this.init(panelElId, sGroup, config);
        this.handleElId = handleElId;
        this.setHandleElId(handleElId);
        this.logger = this.logger || YAHOO;
        this.obj = obj;
        this.orientation = orientation;
    }
};
SweetDevRia.Window.prototype.orientations = new Object();
SweetDevRia.Window.prototype.orientations.N = "N";
SweetDevRia.Window.prototype.orientations.S = "S";
SweetDevRia.Window.prototype.orientations.E = "E";
SweetDevRia.Window.prototype.orientations.W = "W";
SweetDevRia.Window.prototype.orientations.NE = "NE";
SweetDevRia.Window.prototype.orientations.NW = "NW";
SweetDevRia.Window.prototype.orientations.SE = "SE";
SweetDevRia.Window.prototype.orientations.SW = "SW";
/**
 * IE Hack for positioning
 * @private
 */
SweetDevRia.Window.prototype.updateForIE = function(){
	if(this.isOpen){//TT 354
    var window = this.getView();

	//JUM : Does not work on IE 7 !!
 	/*   
 	window.style.width = (parseInt(SweetDevRia.DomHelper.parsePx(window.offsetWidth), 10)-3) + "px";
    window.style.width = (parseInt(SweetDevRia.DomHelper.parsePx(window.offsetWidth), 10)-1) + "px";
   */
    if(this.docked){
		window.style.width = SweetDevRia.Window.prototype.dockedWidth;
    }
    }
};

YAHOO.extend(SweetDevRia.Window.prototype.DDResize, YAHOO.util.DragDrop);
/**
 * Drag & Drop onmousedown for resize
 * @private
 */
SweetDevRia.Window.prototype.DDResize.prototype.onMouseDown = function(e) {
    this.obj.setActive();
    this.obj.renderInvisiblePanelSize();
    var panel = this.getEl();
    this.startWidth = panel.offsetWidth;
    this.startHeight = panel.offsetHeight;
    this.panelStartX = parseInt(panel.offsetLeft, 10);
    this.panelStartY = parseInt(panel.offsetTop, 10);    
    this.startPos = [SweetDevRia.DomHelper.getEventX(e),
                     SweetDevRia.DomHelper.getEventY(e)];
					 
    this.deltaX = this.startPos[0] - this.panelStartX;
    this.deltaY = this.startPos[1] - this.panelStartY;

    document.body.style.cursor = this.orientation + "-resize";
};
/**
 * Drag & Drop ondrag for resize
 * @private
 */
SweetDevRia.Window.prototype.DDResize.prototype.onDrag = function(e) {
    var newPos = [SweetDevRia.DomHelper.getEventX(e),
                  SweetDevRia.DomHelper.getEventY(e)];

    var offsetX = newPos[0] - this.startPos[0];
    var offsetY = newPos[1] - this.startPos[1];
    var newWidth = Math.max(this.startWidth + offsetX, 10);
    var newHeight = Math.max(this.startHeight + offsetY, 10);

    if((this.orientation == SweetDevRia.Window.prototype.orientations.E)||(this.orientation == SweetDevRia.Window.prototype.orientations.NE)||(this.orientation == SweetDevRia.Window.prototype.orientations.SE)){
        this.obj.setWidth(newWidth);
    }
    if((this.orientation == SweetDevRia.Window.prototype.orientations.S)||(this.orientation == SweetDevRia.Window.prototype.orientations.SE)||(this.orientation == SweetDevRia.Window.prototype.orientations.SW)){
        this.obj.setHeight(newHeight);
    }
    if((this.orientation == SweetDevRia.Window.prototype.orientations.N)||(this.orientation == SweetDevRia.Window.prototype.orientations.NE)||(this.orientation == SweetDevRia.Window.prototype.orientations.NW)){
        var newHeightN = this.startHeight - offsetY - this.obj.borderHeight - this.deltaY;
        if((newHeightN>this.obj.getMinHeight())&&(newHeightN<this.obj.getMaxHeight())) {
            this.obj.setY(newPos[1]);
            this.obj.setHeight(newHeightN);
        }
    }
    if((this.orientation == SweetDevRia.Window.prototype.orientations.W)||(this.orientation == SweetDevRia.Window.prototype.orientations.NW)||(this.orientation == SweetDevRia.Window.prototype.orientations.SW)){
        var newWidthW = this.startWidth - offsetX - this.obj.borderWidth  - this.deltaX;
        if((newWidthW>this.obj.getMinWidth())&&(newWidthW<this.obj.getMaxWidth())){
            this.obj.setX(newPos[0]);
            this.obj.setWidth(newWidthW);
        }
    }
    //this.obj.renderPanelSize(); => deja fait ds les setWidth et setHeight
    this.obj.renderInvisiblePanelSize();
};
/**
 * Drag & Drop resizepanel for resize
 * @private
 */
SweetDevRia.Window.prototype.DDResize.prototype.resizePanel= function (){
    var window = this.getEl();
    var windowTitle = this.obj.getDomView(SweetDevRia.Window.prototype.dom.title);
    var windowPanel = this.obj.getDomView(SweetDevRia.Window.prototype.dom.panel);
    var windowInvisiblePanel = this.obj.getDomView(SweetDevRia.Window.prototype.dom.invisiblePanel);
    var stateBar = this.obj.getDomView(SweetDevRia.Window.prototype.dom.state);
    windowPanel.style.height = (parseInt(window.offsetHeight, 10) - (parseInt(windowTitle.offsetHeight, 10) + parseInt(stateBar.offsetHeight, 10) + this.obj.borderHeight)) + "px";
    windowInvisiblePanel.style.height = parseInt(windowPanel.style.height, 10) + "px";
};
/**
 * Drag & Drop onmouseup for resize
 * @private
 */
SweetDevRia.Window.prototype.DDResize.prototype.onMouseUp = function(e) {
    this.obj.hideInvisiblePanel();
    document.body.style.cursor = "";
    this.obj.updateForIE();
};
/**
 * Render the invisible panel size
 * @private
 */
SweetDevRia.Window.prototype.renderInvisiblePanelSize = function(){
    var nodeInvisiblePanel = this.getDomView(SweetDevRia.Window.prototype.dom.invisiblePanel);
    nodeInvisiblePanel.style.display = "";
    var nodePanel = this.getDomView(SweetDevRia.Window.prototype.dom.panel);
    //nodeInvisiblePanel.style.height = parseInt(nodePanel.style.height) + "px";
    nodeInvisiblePanel.style.height = parseInt(nodePanel.offsetHeight, 10) + "px";
};
/**
 * Hide the invisible panel
 * @private
 */
SweetDevRia.Window.prototype.hideInvisiblePanel = function(){
    var nodeInvisiblePanel = this.getDomView(SweetDevRia.Window.prototype.dom.invisiblePanel);
    nodeInvisiblePanel.style.display = "none";
};
/**
 * Set the window inactive
 */
SweetDevRia.Window.prototype.setInactive = function(newActiveId){

	if (newActiveId && this.nestedIds.contains (newActiveId)) {
		return;
	}
	if (newActiveId && this.isNestedWindow && (newActiveId == this.parentWindowId)) {
		return;
	}

	for (var i = 0; i < this.nestedIds.length; i ++) {
		var nested = SweetDevRia.$ (this.nestedIds[i]);
		if (nested) {
			nested.setInactive();
		}
	}
	
	this.closeHooked();
    this.getView().className = "ideo-win-main ideo-win-inactive";
//TODO    
	this.renderInvisiblePanelSize();
    
	
	this.hideBorders();
};
/**
 * Set window z-index
 * @param {int} zIndex 	New z-index for the window
 */
SweetDevRia.Window.prototype.setZindex = function(zIndex){
    this.zIndex = zIndex;
    var node = this.getView();
    node.style.zIndex = this.zIndex;
};
/**
 * Return window z-index
 * @type int
 */
SweetDevRia.Window.prototype.getZindex = function(){
    return this.zIndex;
};
/**
 * Update window z-index
 * @param {Window} obj 	Window to update
 * @private
 */
SweetDevRia.Window.prototype.updateZIndex = function(obj){
    if((SweetDevRia.Window.prototype.instanceByZIndex[obj.getZindex()]===undefined)||((SweetDevRia.Window.prototype.instanceByZIndex[obj.getZindex()]===null))){
        SweetDevRia.Window.prototype.instanceByZIndex[obj.getZindex()] = obj;
        obj.setZindex(obj.getZindex());
        return;
    }
    var oldObj = SweetDevRia.Window.prototype.instanceByZIndex[obj.getZindex()];
    oldObj.zIndex = oldObj.zIndex - 4;
    SweetDevRia.Window.prototype.updateZIndex(oldObj);

    SweetDevRia.Window.prototype.instanceByZIndex[obj.getZindex()] = obj;
    obj.setZindex(obj.getZindex());
};
/**
 * Return if the window is modal
 * @type boolean
 */
SweetDevRia.Window.prototype.isModal = function(){
    return this.modal;
};
/**
 * Set if the window is modal
 * @param {boolean} bool Set if the window is modal
 */
SweetDevRia.Window.prototype.setModal = function(bool){
    this.modal = bool;
};
/**
 * Return if the window is active
 * @type boolean
 */
SweetDevRia.Window.prototype.isActiveWindow = function(){
    return (SweetDevRia.Window.prototype.getActiveWindow() == this);
};
/**
 * Return the active window.
 * @static
 * @type boolean
 */
SweetDevRia.Window.prototype.getActiveWindow = function(){
    return SweetDevRia.Window.prototype.active;
};
/**
 * Set the window active
 */
SweetDevRia.Window.prototype.setActive = function(evt){

    if(this.isActiveWindow()){
    	return;
    }
    if(SweetDevRia.Window.prototype.isModalActiveWindow()){
    	return;
    }

    SweetDevRia.Window.prototype.instanceByZIndex[this.zIndex] = null;
    this.zIndex = SweetDevRia.Window.prototype.baseZindex + (SweetDevRia.Window.prototype.indexIdCounter)*4;
    SweetDevRia.Window.prototype.updateZIndex(this);
    var active = SweetDevRia.Window.prototype.getActiveWindow();
    if(active!==null) {
    	active.setInactive(this.id);
   	    SweetDevRia.Window.prototype.active.updateServerModel ("active", false);
    }

	//on 'desactive' les soeurs
	if (this.isNestedWindow) {
		var parent = SweetDevRia.$(this.parentWindowId);
		for (var i = 0; i < parent.nestedIds.length; i++) {
			var nestedId = parent.nestedIds[i];
			if (nestedId != this.id) {
				var sister = SweetDevRia.$(nestedId);
				sister.setInactive(this.id);
				
				SweetDevRia.DomHelper.removeClassName(sister.getView(), "ideo-win-active");
			}	
		}
	}

    SweetDevRia.Window.prototype.active = this;
    this.updateServerModel ("active", true);
    this.getView().className = "ideo-win-main ideo-win-active";
    this.hideInvisiblePanel();
    if(this.isResizable){
		this.showBorders();
	}
    else{
		this.hideBorders();
	}

    this.hideInvisibleWindowPanel();

    this.isOpen = true;
    if(this.isModal()){
        for(var i in SweetDevRia.Window.prototype.instanceByZIndex){
            if(i != "toJSONString" &&(SweetDevRia.Window.prototype.instanceByZIndex[i]!==null)&&(SweetDevRia.Window.prototype.instanceByZIndex[i] != this)){ 
				SweetDevRia.Window.prototype.instanceByZIndex[i].showInvisibleWindowPanel();
			}
        }

		//move the window into the body, and replace it by a marking div
		this.referenceNode = document.createElement("div");
		this.referenceNode.id = this.getViewName()+"_REF";
		this.referenceNode.style.display = 'none';
		this.getView().parentNode.insertBefore(this.referenceNode, this.getView());

       	var _modalPanel = SweetDevRia.ModalPanel.getInstance();

	    var node = this.getView();
	    node.style.zIndex = this.zIndex + 1;
       	_modalPanel.show (this.zIndex);
    }

	// with firefox, when you move a iframe, this iframe is reload, you lose its content.
	// So we can't move the window as a body child in a url case.
	if (! this.isNestedWindow && this.getView().parentNode !=  this.parent) {
		this.parent.appendChild(this.getView());
	}
	

};

/**
 * Init z-index
 * @private
 */
SweetDevRia.Window.prototype.initZIndex = function(){
	if (this.zIndex != null){ return;}

	if(SweetDevRia.Window.prototype.baseZindex===null){ 
		SweetDevRia.Window.prototype.baseZindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex (true);
	}
    var zIndex = SweetDevRia.Window.prototype.baseZindex + (this.indexId+1)*4;

    SweetDevRia.Window.prototype.instanceByZIndex[zIndex] = this;
    this.setZindex(zIndex);
};
/**
 * Return if is a modal window active
 * @type boolean
 */
SweetDevRia.Window.prototype.isModalActiveWindow = function(){
    var activeWindow = SweetDevRia.Window.prototype.getActiveWindow();
    return ((activeWindow!==null)&&(activeWindow.isOpen)&&(activeWindow.isModal()));
};
/**
 * Show the invisibleWindowPanel
 * @private
 */
SweetDevRia.Window.prototype.showInvisibleWindowPanel = function(){
    this.getDomView(SweetDevRia.Window.prototype.dom.invisibleWindowPanel).style.display = "block";
};
/**
 * Hide the invisibleWindowPanel
 * @private 
 */
SweetDevRia.Window.prototype.hideInvisibleWindowPanel = function(){
    this.getDomView(SweetDevRia.Window.prototype.dom.invisibleWindowPanel).style.display = "none";
};
/**
 * Update the z-index of the windows
 * @private
 */
SweetDevRia.Window.prototype.updateActiveWindow = function(){
	var zindexes = SweetDevRia.Window.prototype.instanceByZIndex;
	
    var array = new Array();
    for(var j in zindexes){
		if(j != "toJSONString") {
	        array.push(parseInt(j, 10));
		} 
    }
    array = array.sort(function(a,b){return b-a;});
    for(var i=0;i<array.length;i++){
        var windowNode = zindexes[array[i]];
        if(windowNode.isOpen){
            windowNode.setActive();
            if(windowNode.isModal()){
                for(var ind in zindexes){//TT 355
                    if(ind!= "toJSONString" &&(zindexes[ind]!==null)&&(zindexes[ind] != windowNode)){ zindexes[ind].showInvisibleWindowPanel();}
                }
            }
            else{
                for(var ind2 in zindexes){//TT 355
                    if(ind2 != "toJSONString" &&(zindexes[ind2]!==null)&&(zindexes[ind2] != windowNode)){ zindexes[ind2].hideInvisibleWindowPanel();}
                }
            }
			break;
        }
    }
};

/**
 * Handle keyboard events.
 * @param Event evt Event.
 * @return {boolean} true if event is not active, false if component was closed.
 * @private
 */
SweetDevRia.Window.prototype.handleEvent = function(evt) {
	if (!this.isActiveWindow()) {
		return true;
	}
	if (evt && evt.type) {
		if (evt.type == SweetDevRia.RiaEvent.CLOSE_WINDOW_TYPE) {
			this.close();
			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			return false;
		}
		else if (evt.type == SweetDevRia.RiaEvent.MAXIMIZE_WINDOW_TYPE) {
			this.maximize();
			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			return false;
		}
		else if (evt.type == SweetDevRia.RiaEvent.MINIMIZE_WINDOW_TYPE) {
			this.minimize();
			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			return false;
		}
		else if (evt.type == SweetDevRia.RiaEvent.RESTORE_WINDOW_TYPE) {
			this.restore();
			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			return false;
		}
	}
	
	return true;
};

/**
* Dock a window (docking layout)
* @private
*/
SweetDevRia.Window.prototype.dock = function(){
	
	this.docked = true;
	this.restore();
	var spacer = this.getDomView(SweetDevRia.Window.prototype.dom.dockingSpacer);
	spacer.style.display = "block";
	this.getView().style.marginTop = "10px";
	var spacerName = this.getViewName(SweetDevRia.Window.prototype.dom.dockingSpacer);
	spacerZone = new YAHOO.util.DragDrop(spacerName,"paneldrag");
};

/**
* Show the borders on docking
* @private
*/
SweetDevRia.Window.prototype.showBordersDocking = function(){
    var borderS = this.getDomView(SweetDevRia.Window.prototype.dom.borderS);
    borderS.className = "borderS";
};

/**
* Return the url of the window
* @return the url of the window
* @type String
*/
SweetDevRia.Window.prototype.getUrl = function(){
	return this.url;
};

/**
* Set the url of the window
* @param {String} url	the new url
*/
SweetDevRia.Window.prototype.setUrl = function(url){
	this.url = url;
	this.getDomView(SweetDevRia.Window.prototype.dom.panel).src = url;
	this.updateServerModel ("url", url);	
};


SweetDevRia.Window.prototype.template = "\
<div class=\"ideo-win-main\" id=\"${id}\" onclick=\"SweetDevRia.$('${id}').setActive(event);\" {if isOpen==false} style=\"display:none\" {/if} >\
	<div class=\"ideo-win-dockingSpacer\" id=\"${id}_dockingSpacer\"></div>\
	<div class=\"ideo-win-invWndPanel\" id=\"${id}_invisibleWindowPanel\"></div>\
	<iframe name=\"${id}_invisibleWindow\" class=\"ideo-win-invWnd\" src=\"about:blank\" id=\"${id}_invisibleWindow\"></iframe>\
	<div class=\"borderN\" id=\"${id}_borderN\"></div>\
	<div class=\"borderS\" id=\"${id}_borderS\"></div>\
	<div class=\"borderE\" id=\"${id}_borderE\"></div>\
	<div class=\"borderW\" id=\"${id}_borderW\"></div>\
	<div class=\"borderNWH\" id=\"${id}_borderNWH\"></div>\
	<div class=\"borderNWV\" id=\"${id}_borderNWV\"></div>\
	<div class=\"borderNEH\" id=\"${id}_borderNEH\"></div>\
	<div class=\"borderNEV\" id=\"${id}_borderNEV\"></div>\
	<div class=\"borderSWH\" id=\"${id}_borderSWH\"></div>\
	<div class=\"borderSWV\" id=\"${id}_borderSWV\"></div>\
	<div class=\"borderSEH\" id=\"${id}_borderSEH\"></div>\
	<div class=\"borderSEV\" id=\"${id}_borderSEV\"></div>\
	{if displayTitleBar}\
	<div class=\"ideo-win-title\" id=\"${id}_title\">\
		{if showTitleIcon}\
		<div class=\"ideo-win-menuIcon\" id=\"${id}_menu\" onclick=\"SweetDevRia.$('${id}').menu()\" ondblclick=\"event.cancelBubble = true;\"></div>\
		{/if}\
		<div class=\"ideo-win-titleLabel\" id=\"${id}_titleLabel\" {if canMaximize} ondblclick=\"SweetDevRia.$('${id}').maximize()\" {/if}>${title}</div>\
		<div class=\"ideo-win-minIcon\" id=\"${id}_minimize\"  {if canMinimize == false}style=\"display:none;\"{/if} onclick=\"SweetDevRia.$('${id}').minimize()\" ondblclick=\"event.cancelBubble = true;\"></div>\
		<div class=\"ideo-win-maxIcon\" id=\"${id}_maximize\" {if canMaximize == false}style=\"display:none;\"{/if} onclick=\"SweetDevRia.$('${id}').maximize()\" ondblclick=\"event.cancelBubble = true;\"></div>\
		<div class=\"ideo-win-closeIcon\" id=\"${id}_close\" {if canClose == false}style=\"display:none;\"{/if} onclick=\"SweetDevRia.$('${id}').close();event.cancelBubble = true;\" ondblclick=\"event.cancelBubble = true;\"></div>\
	</div>\
	{else}\
	<div id=\"${id}_title\"/>\
	{/if}\
	<div class=\"ideo-win-invPanel\" id=\"${id}_invisiblePanel\"></div>\
{if url != null}\
	<iframe style=\"border : 0px;\" src=\"{if isLoaded}${url}{/if}\" class=\"ideo-win-panel\" name=\"${id}_panel\" id=\"${id}_panel\">\
{else}\
	<div style=\"border : 0px;\" class=\"ideo-win-panel\" id=\"${id}_panel\">\
{/if}\
{if url != null}\
	</iframe>\
{else}\
	</div>\
{/if}\
	{if message != null}\
		<div class=\"ideo-win-stateBar\" id=\"${id}_state\">\
			<div class=\"ideo-win-stateBarLabel\" id=\"${id}_stateLabel\">${message}</div>\
			{if showCorner}\
				<div class=\"ideo-win-corner\" id=\"${id}_corner\"></div>\
			{/if}\
		</div>\
	{else}\
		{if showCorner}\
			<div class=\"ideo-win-corner\" id=\"${id}_corner\"></div>\
		{/if}\
	{/if}\
</div>\
";



