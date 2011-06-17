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
 
 /********************************************************************************************************************************************
 * 									Menu
********************************************************************************************************************************************/

/**
 * This is the Menu component class 
 * @param {String} id Identifiant of this Menu 
 * @constructor
 * @extends RiaComponent
 * @base RiaComponent
 */
SweetDevRia.Menu = function(id){
	if (id) {
		superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Menu");	

		this.items = [];
		this.parentMenu = this; 
	}
};

extendsClass(SweetDevRia.Menu, SweetDevRia.RiaComponent);

/**
 * Return the associated html element
 * @return the html element view associated wit this menu
 * @type HtmlElement
 * @private
 */
SweetDevRia.Menu.prototype.view = function(){
	return document.getElementById(this.id);
};

/**
 * Return the rendering string of subitems
 * @return  rendering string of subitems
 * @type String
 * @private
 */
SweetDevRia.Menu.prototype.getItems = function () {
	var str = "";
	for (var i = 0; i < this.items.length; i++) {
		str += TrimPath.processDOMTemplate(this.items[i].template, this.items[i]);
	}
	
	return str;
};

/**
 * Add an menuitem to this menu
 * @param {MenuItem} item MenuItem to add
 */
SweetDevRia.Menu.prototype.addItem = function (item) {
	item.parentMenu = this.parentMenu;

	this.items.push (item);
};

/**
 * Test if this menu has sub items
 * @return  true if this menu has sub items, else false
 * @type boolean
 * @private
 */
SweetDevRia.Menu.prototype.hasItems = function () {
	return this.items.length > 0;
};

/**
 * This method is called automatically by the framework at the page load.
 */
SweetDevRia.Menu.prototype.initialize = function(){
	menu_ieHover(this.id);
};


SweetDevRia.Menu.prototype.template = "\
<ul id=\"${id}\" class=\"ideo-mnu-main\">\
${getItems()}\
</ul>\
";

/********************************************************************************************************************************************
 * 									MenuBar
********************************************************************************************************************************************/


/**
 * This is the MenuBar component class 
 * @param {String} id Identifiant of this MenuBar 
 * @constructor
 * @extends Menu
 * @base Menu
 */
SweetDevRia.MenuBar = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.MenuBar");	
	superClass (this, SweetDevRia.Menu, id);	
};

extendsClass (SweetDevRia.MenuBar, SweetDevRia.RiaComponent, SweetDevRia.Menu);

/**
 * This method is called automatically by the framework at the page load.
 */
SweetDevRia.MenuBar.prototype.initialize = function(){
	menubar_ieHover(this.id);
};


/**
 * Return the rendering string of subitems
 * @return  rendering string of subitems
 * @type String
 * @private
 */
SweetDevRia.MenuBar.prototype.getItems = function () {
	var str = "";
	for (var i = 0; i < this.items.length; i++) {
		var item = this.items [i];

		str += TrimPath.processDOMTemplate(this.itemTemplate, item);
	}

	return str;
};

SweetDevRia.MenuBar.prototype.itemTemplate = "\
<li id=\"${id}\" class=\"ideo-mnb-main {if disabled == false && checked == true}ideo-mnu-check{/if}\" onclick=\"return SweetDevRia.$('${id}')._onclick(event)\"  style=\"{if disabled == true}color:gray{/if} {if image !== null}background-image : url(${image});background-repeat : no-repeat;{/if}\">\
	${label}\
	{if hasItems() == true}\
	<ul class=\"ideo-mnu-main ideo-mnb-root ideo-mnb-firstLevel\" >\
	${getItems()}\
	</ul>\
	{/if}\
</li>\
";


SweetDevRia.MenuBar.prototype.template = "\
<ul id=\"${id}\" class=\"ideo-mnb-main\" >\
	${getItems()}\
</ul>\
";


/********************************************************************************************************************************************
 * 									ContextMenu
********************************************************************************************************************************************/

/**
 * This is the ContextMenu component class 
 * @param {String} id Identifiant of this ContextMenu 
 * @constructor
 * @extends Menu
 * @base Menu
 */
SweetDevRia.ContextMenu = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.ContextMenu");	
	superClass (this, SweetDevRia.Menu, id);	

	this.containerId = this.id + "_container"; 
	this.str = null;

	this.targetId = null;
};

extendsClass (SweetDevRia.ContextMenu, SweetDevRia.RiaComponent, SweetDevRia.Menu);

/**
 * This method is called before Hide the context menu
 * To be overriden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.ContextMenu.prototype.beforeHide = function (){  /* override this */ return true;  };

/**
 * This method is called after Hide the context menu
 * To be overriden !!
 */
SweetDevRia.ContextMenu.prototype.afterHide = function (){  /* override this */ };

/**
 * This method is called before Show the context menu
 * To be overriden !!
 * @param {Event} e ContextMenu event (mouse right click)
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.ContextMenu.prototype.beforeShow = function (e){  /* override this */ return true;  };

/**
 * This method is called after Show the context menu
 * To be overriden !!
 */
SweetDevRia.ContextMenu.prototype.afterShow = function (){  /* override this */ };


/**
 * This method is called automatilly by the framework at the page load.
 */
SweetDevRia.ContextMenu.prototype.initialize = function(){
	var menu = this;

	var target = document.getElementById(this.targetId);
	if (target) {
		target.oncontextmenu = function(e){return menu.show(e); };
	}

	 YAHOO.util.Event.addListener(document, "click", menu.onHide, this);
};


SweetDevRia.ContextMenu.prototype.onHide = function(evt, menu){
	if (menu) {
		menu.hide ();
	}
};

/**
 * Hide the context menu
 */
SweetDevRia.ContextMenu.prototype.hide = function(){

	if (this.beforeHide ())  {

		var view = this.view();

		if (view) {

			// To correct a IE bug : subitems menu are already open at the context menu re-open 
			if (document.all) {
				var list = YAHOO.util.Dom.getElementsByClassName ("subItems", null, view);
				list.reverse();
				for (var i = 0; i < list.length; i++) {
					list [i].parentNode.onmouseout();
				}
			}			
		
			view.style.display = "none";
		}

		this.afterHide();
	}
};

/**
 * Show the context menu
 * @param {Event} e ContextMenu event (mouse right click)
 */
SweetDevRia.ContextMenu.prototype.show = function(e){

	if (this.beforeShow (e))  {
		var container = document.getElementById (this.containerId);
		if (container && this.strWrited != true) {
			container.innerHTML = "&nbsp;"+this.str;

			this.strWrited = true;

			menu_ieHover(this.id);
		}

		var evt = null;
		try{
			evt = event;
		}
		catch(exp){
			evt = e;
		}

		/**
		 * srevel : the ul list must be a body child. If not, we move it
		 */
		if (this.view().parentNode != document.body) {
			document.body.appendChild (this.view());
	
			var zindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex (true);
			this.view().style.zIndex = zindex;
		
			// srevel : obligatoire sinon une ligne apparait (le container vide) ds list.jsp lors de l ouverture du menu contextuel)
			if(container) {
				SweetDevRia.DomHelper.removeNode (container);
			}
		}

		this.view().style.display = "block";

	    var scrollX = SweetDevRia.DomHelper.getScrolledLeft();
		var scrollY = SweetDevRia.DomHelper.getScrolledTop();

		YAHOO.util.Dom.setX(this.view(), (evt.clientX-10 + scrollX));
		YAHOO.util.Dom.setY(this.view(), (evt.clientY-10 + scrollY));
		
		this.afterShow();
		
		return false;
	}
};

/**
 * Render this menu
 */
SweetDevRia.ContextMenu.prototype.render = function() {
	if (this.beforeRender ())  {
		var str =  TrimPath.processDOMTemplate(this.template, this);

		this.str = str;
	
		this.afterRender ();
	}
};

SweetDevRia.ContextMenu.prototype.template = "\
<ul id=\"${id}\" class=\"ideo-mnu-main\" style=\"display : none;\">\
${getItems()}\
</ul>\
";



/********************************************************************************************************************************************
 * 									MenuItem
********************************************************************************************************************************************/

/**
 * This is the MenuItem component class 
 * @param {String} id Identifiant of this MenuItem 
 * @constructor
 * @extends Menu
 * @base Menu
 */
SweetDevRia.MenuItem = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.MenuItem");

	this.id = id;
	this.items = [];	
	this.label = "";
};

extendsClass (SweetDevRia.MenuItem, SweetDevRia.Menu);

SweetDevRia.MenuItem.prototype.checkbox = false;
SweetDevRia.MenuItem.prototype.checked = false;
SweetDevRia.MenuItem.prototype.disabled = false;
SweetDevRia.MenuItem.prototype.image = null;
SweetDevRia.MenuItem.prototype.onclick = function(){};
SweetDevRia.MenuItem.prototype.oncheck = function(){};
SweetDevRia.MenuItem.prototype.onuncheck = function(){};

/**
 * This method is called before Action execute when the user click on an item
 * To be overriden !!
 * @param {Event} e mouse left click event
 * @private
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeClick = function (e){  /* override this */ return true;  };

/**
 * This method is called after Action execute when the user click on an item
 * To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterClick = function (){  /* override this */ };
	
/**
 * This method is called before Set the MenuItem disabled property
 * To be overriden !!
 * @param {boolean} disabled the new disabled property value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeSetDisabled = function (disabled){  /* override this */ return true;  };

/**
 * This method is called after Set the MenuItem disabled property
 * To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterSetDisabled = function (){  /* override this */ };
	
/**
 * This method is called before Set the MenuItem checked property
 * To be overriden !!
 * @param {boolean} checked the new checked property value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeSetChecked = function (checked){  /* override this */ return true;  };

/**
 * This method is called after Set the MenuItem checked property
 * To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterSetChecked = function (){  /* override this */ };	
		
/**
 * This method is called before Set the MenuItem image property
 * To be overriden !!
 * @param {boolean} bool the new image property value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeSetImage = function (image){  /* override this */ return true;  };

/**
 * This method is called after Set the MenuItem image property
 * To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterSetImage = function (){  /* override this */ };
	
/**
 * Action execute when the user click on an item
 * @param {Event} e mouse left click event
 * @private
 */
SweetDevRia.MenuItem.prototype._onclick = function(e){
	if (this.beforeClick (e))  {
		if(this.disabled) {
			SweetDevRia.EventHelper.stopPropagation(e);
			return false;	
		}

		if (! this.hasItems()) {
	
			if(this.checkbox){
				this.setChecked (!this.checked);
				SweetDevRia.EventHelper.stopPropagation(e);
				return false;
			}
			
			this.onclick();
			
			// If it's an item inside a contextmenu, we close the contextmenu
			if (this.parentMenu && this.parentMenu.hide) {
				this.parentMenu.hide ();
			}
		}		
		
		SweetDevRia.EventHelper.stopPropagation(e);

		this.afterClick ();

		return false;	
	}
};

/**
 * Set the MenuItem disabled property
 * @param {boolean} disabled the new disabled property value
 */
SweetDevRia.MenuItem.prototype.setDisabled = function(disabled){
	if (this.beforeSetDisabled (disabled))  {
		this.disabled = disabled;
		if(this.disabled){
			this.view().style.color = "gray"; 
		}
		else{
			this.view().style.color = ""; 		
		}
		
		this.afterSetDisabled ();
	}
};

/**
 * Set the MenuItem checked property
 * @param {boolean} checked the new checked property value
 */
SweetDevRia.MenuItem.prototype.setChecked = function(checked){
	if (this.beforeSetChecked (checked))  {

		this.checked = checked;

	    if(this.checked) {
			SweetDevRia.DomHelper.addClassName(this.view(),"ideo-mnu-check");
	        /*@cc_on
			SweetDevRia.DomHelper.addClassName(this.view(),"ideo-mnu-checkover");
	        @*/
			this.oncheck();
	    }
	    else{
			SweetDevRia.DomHelper.removeClassName(this.view(),"ideo-mnu-check");
	        /*@cc_on
			SweetDevRia.DomHelper.removeClassName(this.view(),"ideo-mnu-checkover");
	        @*/
			this.onuncheck();
	    }

		
		this.afterSetChecked ();
	}
};

/**
 * Set the MenuItem image property
 * @param {boolean} bool the new image property value
 */
SweetDevRia.MenuItem.prototype.setImage = function(image){
	if (this.beforeSetImage (image))  {
				
		this.image = image;
		this.view().style.backgroundImage =  "url(" + this.image + ")"; 
		
		this.afterSetImage ();
	}
};


SweetDevRia.MenuItem.prototype.template = "\
<li id=\"${id}\" onclick=\"return SweetDevRia.$('${id}')._onclick(event)\" {if disabled == false && checked == true}class=\"ideo-mnu-check\"{/if} style=\"{if disabled == true}color:gray{/if} {if image !== null}background-image : url(${image});background-repeat : no-repeat;{/if}\">\
	${label}\
	{if hasItems() == true}\
	<div>&nbsp;</div>\
	<ul id=\"${id}_subItems\" class=\"subItems\" >\
	${getItems()}\
	</ul>\
	{/if}\
</li>\
";


/********************************************************************************************************************************************
 * 									Internet Explorer hover hack 
********************************************************************************************************************************************/

function menu_ieHover(id) {}
function menubar_ieHover(id) {}

/*@cc_on
     function menu_ieHover(id) {
     	if (! document.getElementById(id)) return;
       var sfEls = document.getElementById(id).getElementsByTagName("LI");

       for (var i=0; i<sfEls.length; i++) {
            sfEls[i].onmouseover=function() {
                for (var j=0; j<this.childNodes.length;j++) {
					if (this.childNodes[j].nodeType != 3) {
						SweetDevRia.DomHelper.addClassName (this.childNodes[j], "iehover");
					}
				}

				SweetDevRia.DomHelper.addClassName (this, "iehover");

              	if(SweetDevRia.DomHelper.hasClassName ("ideo-mnu-check") || SweetDevRia.DomHelper.hasClassName ("ideo-mnu-checkover")){
					SweetDevRia.DomHelper.addClassName (this, "ideo-mnu-checkover");
				}
            }
            
            sfEls[i].onmouseout=function() {
 
                
                for (var j=0; j<this.childNodes.length;j++) {
					if (this.childNodes[j].nodeType != 3) {
						SweetDevRia.DomHelper.removeClassName (this.childNodes[j], "iehover");
					}
				}

                
				SweetDevRia.DomHelper.removeClassName (this, "iehover");
				SweetDevRia.DomHelper.removeClassName (this, "ideo-mnu-checkover");
            }
        }
    }
	function menubar_ieHover(id) {
        var menubar = document.getElementById(id);
    	if (! menubar) return;

        for (var i=0; i<menubar.childNodes.length; i++) {

            if(menubar.childNodes[i].nodeType === 1){
                var sfEls = menubar.childNodes[i].getElementsByTagName("LI");

                for (var j=0; j<sfEls.length; j++) {
                
                    sfEls[j].onmouseover=function() {
		                for (var j=0; j<this.childNodes.length;j++) {
							if (this.childNodes[j].nodeType != 3) {
								SweetDevRia.DomHelper.addClassName (this.childNodes[j], "iehover");
							}
						}
						
						SweetDevRia.DomHelper.addClassName (this, "iehover");
                        if((this.className.indexOf("ideo-mnu-check")!=-1)&&(this.className.indexOf("ideo-mnu-checkover")==-1)){
							SweetDevRia.DomHelper.addClassName (this, "ideo-mnu-checkover");
                        }
                    }
                    sfEls[j].onmouseout=function() {
		                for (var j=0; j<this.childNodes.length;j++) {
							if (this.childNodes[j].nodeType != 3) {
								SweetDevRia.DomHelper.removeClassName (this.childNodes[j], "iehover");
							}
						}
						
						SweetDevRia.DomHelper.removeClassName (this, "iehover");
                        if(this.className.indexOf(" ideo-mnu-checkover")!=-1){
							SweetDevRia.DomHelper.removeClassName (this, "ideo-mnu-checkover");
                        }
                    }
                }
                
                for(var j=0;j<menubar.childNodes[i].childNodes.length;j++){
                    if(menubar.childNodes[i].childNodes[j].nodeType === 1){
                        menubar.childNodes[i].childNodes[j].style.top = menubar.offsetHeight + "px";
                    }
                }
            }                
        }                
        var sfEls = document.getElementById(id);
        for (var i=0; i<sfEls.childNodes.length; i++) {
            if(sfEls.childNodes[i].nodeType === 1){
                sfEls.childNodes[i].onmouseover=function() {
					SweetDevRia.DomHelper.addClassName (this, "iehovermenubar");
                }
                sfEls.childNodes[i].onmouseout=function() {
					SweetDevRia.DomHelper.removeClassName (this, "iehovermenubar");
                }
            }
        }
    }
@*/


