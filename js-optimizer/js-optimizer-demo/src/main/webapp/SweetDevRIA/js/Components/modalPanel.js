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
 * @version 2.0
 * @author Ideo Technologies
 */
 

/**
 * @class Display a modal panel
 * @constructor
 * @param {String} id 	the id of the modal panel
 * @private
 */  
SweetDevRia.ModalPanel = function(id) {
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.ModalPanel");

	this.panel = null;
};

extendsClass (SweetDevRia.ModalPanel, SweetDevRia.RiaComponent);

/**
 * Event fired on modal panel show
 * @static
 * @type String
 */
SweetDevRia.ModalPanel.SHOW_EVENT = "modal_show";

/**
 * Event fired on modal panel hide
 * @static
 * @type String
 */
SweetDevRia.ModalPanel.HIDE_EVENT = "modal_show";


SweetDevRia.ModalPanel.MODAL_PANEL_ID = "__SweetDEV_modalPanel";

// creates the instance
SweetDevRia.ModalPanel._instance = new SweetDevRia.ModalPanel (SweetDevRia.ModalPanel.SWEETDEV_RIA_PROXY_ID);

SweetDevRia.ModalPanel.getInstance = function () {
	return SweetDevRia.ModalPanel._instance;
};


/**
 * Public APIS
 */
 
/**
 * This method is called before showing the modal panel 
 * To be overridden !!
 * @param {int} zindex Optional z index of the modal panel.
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.ModalPanel.beforeShowModalPanel = function(zindex){	return true; };

/**
 * This method is called after having turn the modalPanel to visible state 
 * To be overridden !!
 * @param {int} zindex Optional z index of the modal panel.
 */
SweetDevRia.ModalPanel.afterShowModalPanel = function(zindex){};

/**
 * This method is called before hidding the modal panel 
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.ModalPanel.beforeHideModalPanel = function(){	return true; };

/**
 * This method is called after having turn the modalPanel to hidden state 
 * To be overridden !!
 */
SweetDevRia.ModalPanel.afterHideModalPanel = function(){};


/**
 * Resize the modal panel on window resize
 * @private
 */
SweetDevRia.ModalPanel.prototype.resize  = function() {
	if(this.panel) {//TT 451
		this.panel.style.height = YAHOO.util.Dom.getDocumentHeight()+"px";
		this.panel.style.height = YAHOO.util.Dom.getDocumentHeight()+"px";//must be duplicated for IE...
		this.panel.style.width = YAHOO.util.Dom.getDocumentWidth()+"px";
		this.panel.style.width = YAHOO.util.Dom.getDocumentWidth()+"px";//must be duplicated for IE...
	}
};

/**
 * Show the modal panel
 * @param {int} zindex Optional z index of the modal panel.
 */
SweetDevRia.ModalPanel.showModalPanel = function(zindex){
	if(SweetDevRia.ModalPanel.beforeShowModalPanel(zindex)){
		SweetDevRia.ModalPanel.getInstance().show(zindex);
		
		SweetDevRia.ModalPanel.afterShowModalPanel(zindex);
	}
};

/**
 * Hide the modal panel
 */
SweetDevRia.ModalPanel.hideModalPanel = function(){
	if(SweetDevRia.ModalPanel.beforeHideModalPanel()){
		SweetDevRia.ModalPanel.getInstance().hide();
	
		SweetDevRia.ModalPanel.afterHideModalPanel();
	}
};


/**
 * Returns true if the modal panel is currently visible
 * @return true if the modal panel is currently visible
 * @type boolean
 */
SweetDevRia.ModalPanel.isVisible = function(){
	return SweetDevRia.ModalPanel.getInstance().isVisible();
};

/**
 * Show an instance of modal panel
 * @param {int} zindex the z index of the modal panel.
 * @private
 */
SweetDevRia.ModalPanel.prototype.show = function(zindex) {
	if(! this.panel) {
		this.create ();
	}
	
	if (zindex == null) {
		SweetDevRia.DisplayManager.getInstance()._getMaxZindex();
		zindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex ();
	}
	this.panel.style.zIndex = zindex;
	
	this.resize ();
	this.panel.style.display = "block";
	
	this.fireEventListener (SweetDevRia.ModalPanel.SHOW_EVENT);
};


/**
 * Returns true if the modal panel is currently visible
 * @return true if the modal panel is currently visible
 * @type boolean
 * @private
 */
SweetDevRia.ModalPanel.prototype.isVisible = function() {
	if (this.panel) {
		return (this.panel.style.display == "block");
	}
	return false;
};


/**
 * Hide the modal panel
 * @private
 */
SweetDevRia.ModalPanel.prototype.hide = function() {
	if(this.panel) {
		this.panel.style.display = "none";
	}
	this.fireEventListener (SweetDevRia.ModalPanel.HIDE_EVENT);
};

/**
 * Creates the grey panel 
 * @private
 */
SweetDevRia.ModalPanel.prototype.create = function() {
	this.panel = document.createElement("div");
	this.panel.style.position = "absolute";
	this.panel.style.top = "0px";
	this.panel.style.left = "0px";
	this.panel.style.zIndex = SweetDevRia.DisplayManager.getInstance().getMaxZindex()+1;

	var iframe = document.createElement("iframe");
	iframe.setAttribute("frameborder", 0);
	iframe.className = "ideo-mp-main";
	iframe.setAttribute("src", "");
	iframe.width = "100%";
	iframe.height = "100%";

	document.body.appendChild(this.panel);
	this.panel.appendChild(iframe);
	
	this.panel.className = "ideo-mp-main";

	
	var modalPanel = this;
	SweetDevRia.EventHelper.addListener (window, "resize", function () {
		modalPanel.resize ();
	});
};
