
/**
 * TODO
 *
 * Sort par drag drop des items
 * update server
 * 
 */


/** ------------------------------------
 * SweetDEV RIA library
 * Copyright [2006] [Ideo Technologies]
 * ------------------------------------
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * For more information, please contact us at:
 * Ideo Technologies S.A
 * 124 rue de Verdun
 * 92800 Puteaux - France
 *
 * France & Europe Phone : +33 1.46.25.09.60
 * USA & Canada Phone : (201) 984-7514
 *
 * web : http://www.ideotechnologies.com
 * email : Sweetdev_ria_sales@ideotechnologies.com
 *
 *
 * @version 2.2-SNAPSHOT
 * @author Ideo Technologies
 */

SweetDevRia.List = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "List");

	this.modifiedItemIndex = null;
	
	this.list = null;
	this.width = null;
	this.height = null;
	
	this.mapping = null;
};

extendsClass(SweetDevRia.List, SweetDevRia.RiaComponent);

/**
 * This method is called before set size. 
 * To be overridden !!
 * @param {int} width The new list width
 * @param {int} height The new list height
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.List.prototype.beforeSetSize  = function(width, height){  /* override this */ return true;  };

/**
 * This method is called after set size. 
 * To be overridden !!
 * @param {int} width The new list width
 * @param {int} height The new list height
 */
SweetDevRia.List.prototype.afterSetSize = function(width, height){  /* override this */ };

/**
 * This method is called before Add a new list item. 
 * To be overridden !!
 * @param {Object} data The new data value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.List.prototype.beforeAddData  = function (data){  /* override this */ return true;  };

/**
 * This method is called after Add a new list item. 
 * To be overridden !!
 * @param {Object} data The new data value
 */
SweetDevRia.List.prototype.afterAddData = function(data){  /* override this */ };

/**
 * This method is called before Modify a list item value. 
 * To be overridden !!
 * @param {int} index Index of item to modify
 * @param {Object} data The new data value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.List.prototype.beforeModifyData  = function(index, data){  /* override this */ return true;  };

/**
 * This method is called after Modify a list item value. 
 * To be overridden !!
 * @param {int} index Index of item to modify
 * @param {Object} data The new data value
 */
SweetDevRia.List.prototype.afterModifyData = function(index, data){  /* override this */ };

/**
 * This method is called before Delete a data. 
 * To be overridden !!
 * @param {int} index Data index to delete
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.List.prototype.beforeDeleteData  = function(index){  /* override this */ return true;  };

/**
 * This method is called after Delete a data. 
 * To be overridden !!
 * @param {int} index Data index to delete
 */
SweetDevRia.List.prototype.afterDeleteData = function(index){  /* override this */ };



/**
 * This method is automatically called at the page load
 * @private
 */
SweetDevRia.List.prototype.initialize = function () {
	this.generateWindow (this.windowWidth, this.windowHeight);

	this.generateMenu();
	if (this.canResize) {
	    this.resizer = new YAHOO.util.DD(this.id+"_resizer");
	    this.resizer.onMouseUp = this.resizerOnMouseUp(this);
	    this.resizer.onMouseDown = this.resizerOnMouseDown(this);
	
		var resizer = document.getElementById(this.id+"_resizer");
	
		resizer.style.bottom = "auto";
		resizer.style.top = "";
		resizer.style.left = "";
	
		this.resizer.resetConstraints ();
	}
};


/**
 * This method is called at the list resizer drop
 * @param {list} list list component associated wit this resizer
 * @private
 */
SweetDevRia.List.prototype.resizerOnMouseUp = function(list){
	return function(e){
        var node = this.getEl();

		var listElem = document.getElementById (list.id+"_list");

        var listHeight = listElem.offsetHeight;
        var listWidth = listElem.offsetWidth;
		var listCoord = SweetDevRia.DomHelper.getXY (listElem);

		var nodeCoord = SweetDevRia.DomHelper.getXY (node);
		
		var top = parseInt(node.style.top,10);
		var left = parseInt(node.style.left,10);

		list.setSize (left, top);


		var resizer = document.getElementById(list.id+"_resizer");
	
		resizer.style.bottom = "auto";
		resizer.style.top = "";
		resizer.style.left = "";
	
		list.resizer.resetConstraints ();

	};
};

/**
 * Modify the list size
 * @param {int} width The new list width
 * @param {int} height The new list height
 */
SweetDevRia.List.prototype.setSize= function(width, height){
	if (this.beforeSetSize (width, height)) {
		if (this.canResize) {
			var listElem = document.getElementById (this.id+"_container");
			listElem.style.width = width+"px";
			listElem.style.height = height+"px";
		
			var listElem = document.getElementById (this.id+"_list");
			listElem.style.width = width+"px";
			listElem.style.height = height+"px";
		}
		
		this.afterSetSize (width, height);
	}
};


/**
 * This method is called before the list resizer drag
 * @param {list} list list component associated wit this resizer
 * @private
 */
SweetDevRia.List.prototype.resizerOnMouseDown = function(list){
	return function(e){
		list.resizer.resetConstraints ();
	};
};

/**
 * Generate the list context menu that allow to the user to add, delete or modify items.
 * @private
 */
SweetDevRia.List.prototype.generateMenu = function () {
	if (! this.canAdd && ! this.canModify && ! this.canDelete) {
		return;
	}

	var menu = new SweetDevRia.ContextMenu (this.id + "Menu");
	menu.targetId = this.id+"_ul";

	var list = this;

	menu.beforeShow = function (e){
		e = SweetDevRia.EventHelper.getEvent (e);

		var src = e.src;
		
		while (! SweetDevRia.DomHelper.hasClassName(src, "ideo-lst-item") && src != document.body) {
			src = src.parentNode;
		}
		
		var srcId = src.id;
		menu.clickedItem = parseInt (srcId.substring ((list.id+"_").length), 10);

		SweetDevRia.EventHelper.stopPropagation(e);
		
		return true;  
	};
	
	if (this.canAdd) {
		var menuAddItem = new SweetDevRia.MenuItem(this.id + "menuAddItem");
		menuAddItem.label = this.getMessage ("addItem");
		menuAddItem.checkbox = false;
		menuAddItem.checked = false;
		menuAddItem.disabled = false;
		menuAddItem.image = null ;
		menuAddItem.onclick = function(){list.addItem();};
		menuAddItem.oncheck = function(){};
		menuAddItem.onuncheck = function(){};
	
		menu.addItem(menuAddItem);
	}

	if (this.canModify) {
		var menuModifyItem = new SweetDevRia.MenuItem(this.id + "menuModifyItem");
		menuModifyItem.label = this.getMessage ("modifyItem");
		menuModifyItem.checkbox = false;
		menuModifyItem.checked = false;
		menuModifyItem.disabled = false;
		menuModifyItem.image = null ;
		menuModifyItem.onclick = function(){list.modifyItem(menu.clickedItem);};
		menuModifyItem.oncheck = function(){};
		menuModifyItem.onuncheck = function(){};
	
		menu.addItem(menuModifyItem);
	}

	if (this.canDelete) {
		var menuDeleteItem = new SweetDevRia.MenuItem(this.id + "menuDeleteItem");
		menuDeleteItem.label = this.getMessage ("deleteItem");
		menuDeleteItem.checkbox = false;
		menuDeleteItem.checked = false;
		menuDeleteItem.disabled = false;
		menuDeleteItem.image = null ;
		menuDeleteItem.onclick = function(){if (confirm (list.getMessage("deleteConfirmation"))) {list.deleteItem(menu.clickedItem);}};
		menuDeleteItem.oncheck = function(){};
		menuDeleteItem.onuncheck = function(){};
	
		menu.addItem(menuDeleteItem);
	}

	// create menu !
	menu.render ();

	menu.initialize ();


	if (this.canAdd) {
		var menu = new SweetDevRia.ContextMenu (this.id + "AddMenu");
		menu.targetId = this.id+"_list";

		var list = this;
	
		var menuAddItem = new SweetDevRia.MenuItem(this.id + "menuAddItem_only");
		menuAddItem.label = this.getMessage ("addItem");
		menuAddItem.checkbox = false;
		menuAddItem.checked = false;
		menuAddItem.disabled = false;
		menuAddItem.image = null ;
		menuAddItem.onclick = function(){list.addItem();};
		menuAddItem.oncheck = function(){};
		menuAddItem.onuncheck = function(){};
	
		menu.addItem(menuAddItem);

		// create menu !
		menu.render ();
	
		menu.initialize ();
	}

};

/**
 * Default format method
 * To be overridden !!
 * @param {Object} data Data to format for list display
 * @return the formatted data to display in the list
 * @type String
 */
SweetDevRia.List.prototype.formatData = function (data) {
	return data;
};


/**
 * Action to open the window for add item. Reset the window form.
 * @private
 */
SweetDevRia.List.prototype.addItem = function () {
	if (this.canAdd) {
		this.resetForm ();
		
		var win = SweetDevRia.$(this.id+"_win");
		win.setTitle (this.getMessage ("addWindowHeader"));
		
		document.getElementById (this.id+"_win_addButton").style.display = "";
		document.getElementById (this.id+"_win_modifyButton").style.display = "none";
		
		this.openWindow ();
	}
};

/**
 * Action to open the window for modify. Set the window form with the data to modify.
 * @param {int} itemIndex Index of the item to modify
 * @private
 */
SweetDevRia.List.prototype.modifyItem = function (itemIndex) {
	if (this.canModify) {
		this.resetForm ();
	
		var data = this.list [itemIndex];
	
		var form = document.getElementById (this.formId); 
		SweetDevRia.Mandatory.setFormData (form, data, this.mapping);
		
		this.modifiedItemIndex = itemIndex;

		var win = SweetDevRia.$(this.id+"_win");
		win.setTitle (this.getMessage ("modifyWindowHeader"));

		document.getElementById (this.id+"_win_addButton").style.display = "none";
		document.getElementById (this.id+"_win_modifyButton").style.display = "";
		
		this.openWindow ();
	}
};

/**
 * Action to delete an item.
 * @param {int} itemIndex Index of the item to delete
 * @private
 */
SweetDevRia.List.prototype.deleteItem = function (itemIndex) {
	if (this.canDelete) {
		this.deleteData (itemIndex);
		
		var li = document.getElementById (this.id+"_item_"+itemIndex);
		SweetDevRia.DomHelper.removeNode (li);
	
		for (var i = itemIndex +1; i <= this.list.length; i ++) {
			// REename les li et les a
			var li = document.getElementById (this.id+"_item_"+i);
			li.setAttribute ("id", this.id+"_item_"+(i - 1));

			var taga = document.getElementById (this.id+"_"+i); 
			taga.setAttribute ("id", this.id+"_"+(i - 1));
		}
	}
};

/**
 * Modify action, call the modifyData method after have get modified value inside form data
 * @private
 */
SweetDevRia.List.prototype.modifyDataAction = function (evt) {
	if (this.canModify) {
		if (this.modifiedItemIndex != null) {
			var form = document.getElementById (this.formId); 
		
			var res = SweetDevRia.Mandatory.testFormMandatory (this.formId);
		
			if (res) {
				var modifiedData = SweetDevRia.Mandatory.getFormData (form, this.mapping);
			
				this.modifyData (this.modifiedItemIndex, modifiedData);
				
				this.modifiedItemIndex = null;

				return this.closeWindow (evt);
			}	
		}
	}
};

/**
 * Modify a list item value
 * @param {int} index Index of item to modify
 * @param {Object} data The new data value
 */
SweetDevRia.List.prototype.modifyData = function (index, data) {
	if (this.beforeModifyData (index, data)) {
		if (this.canModify) {
			var taga = document.getElementById (this.id+"_"+index); 
			var format = this.formatData (data);
			taga.innerHTML = format;
		
			this.list [index] = data;
		}
		
		this.afterModifyData (index, data);
	}
};

/**
 * Add a new list item
 * @param {Object} data The new data value
 */
SweetDevRia.List.prototype.addData = function (data) {
	if (this.beforeAddData (data)) {
		if (this.canAdd) {
			var taga = document.createElement ("a");
		
			var format = this.formatData (data);
			taga.innerHTML = format;
	
			taga.setAttribute ("id", this.id+"_"+this.list.length); 
			taga.setAttribute ("href", "#"); 
	
			var li = document.createElement ("li");
			li.setAttribute ("id", this.id+"_item_"+this.list.length); 
		
			li.appendChild (taga);
		
			var ul = document.getElementById (this.id+"_ul");
			ul.appendChild (li);
	
			SweetDevRia.DomHelper.addClassName(taga, "ideo-lst-item");
		
			this.list.add (data);
		}
		
		this.afterAddData (data);
	}
};

/**
 * Add action, call the addData method after have get new value inside form data
 * @private
 */
SweetDevRia.List.prototype.addDataAction = function (evt) {
	if (this.canAdd) {
		var form = document.getElementById (this.formId); 
	
		var res = SweetDevRia.Mandatory.testFormMandatory (this.formId);
	
		if (res) {
			var data = SweetDevRia.Mandatory.getFormData (form,  this.mapping);
	
			this.addData (data);		

			return this.closeWindow (evt);
		}

	}

};

/**
 * Delete a data
 * @param {int} index Data index to delete
 */
SweetDevRia.List.prototype.deleteData = function (index) {
	if (this.beforeDeleteData (index)) {
		if (this.canDelete) {
			this.list.splice (index, 1);
		}
		
		this.afterDeleteData (index);
	}
};

/**
 * Reset form data
 * @private
 */
SweetDevRia.List.prototype.resetForm = function () {
	var form = document.getElementById (this.formId); 
	for (var i = 0; i <  form.elements.length; i++) {
		var elem = form.elements [i];
		var id = elem.id;
		if (id) {
			SweetDevRia.Control.resetComponent (elem);
		}
	}
};


/**
 * Return the list content
 * @private
 */
SweetDevRia.List.prototype.getListContent = function () {
	return TrimPath.processDOMTemplate(this.templateList, this);
};

/**
 * Generate the window containing input form.
 * @param {int} width Window width
 * @param {int} height Window height
 * @private
 */
SweetDevRia.List.prototype.generateWindow = function (width, height) {
	
	var win = new SweetDevRia.Window(this.id+"_win", -1, -1, width, height);
	win.content = TrimPath.processDOMTemplate(this.templateWindow, this);

	win.title = this.getMessage ("addWindowHeader");	
	win.modal = true;	
	win.canMaximize = false;
	win.canMinimize = false;
	win.showTitleIcon = false;
	win.isResizable = false;

	win.render ();
	win.initialize ();

};

/**
 * Close the window containing input form
 * @param {Event} evt Mouse event
 * @private
 */
SweetDevRia.List.prototype.closeWindow = function (evt) {
	SweetDevRia.$(this.id+'_win').close ();	
	SweetDevRia.EventHelper.stopPropagation(evt);
	return false;
};

/**
 * Open the window containing input form
 * @private
 */
SweetDevRia.List.prototype.openWindow = function () {
	var win = SweetDevRia.$(this.id+"_win");
	var content = document.getElementById (win.id+"_content");
	var panel = document.getElementById (win.id+"_form");
	if(content.parentNode != panel) {
		panel.appendChild(content);
		content.style.display = "block";
	}
	
	SweetDevRia.$(this.id+'_win').open ();	
};

SweetDevRia.List.prototype.templateWindow = 
"\
<div id=\"${id}_win_form\"></div>\
<button onclick=\"return SweetDevRia.$('${id}').closeWindow (event)\">${i18n.cancelButton}</button>\
<button type=\"submit\" id=\"${id}_win_addButton\" onclick=\"return SweetDevRia.$('${id}').addDataAction (event);\">${i18n.addButton}</button>\
<button type=\"submit\" id=\"${id}_win_modifyButton\" onclick=\"return SweetDevRia.$('${id}').modifyDataAction (event);\">${i18n.modifyButton}</button>\
";


//test menu
SweetDevRia.List.prototype.templateList = 
"\
<ul id=\"${id}_ul\"  class=\"ideo-lst-ul\">\
	{for data in list}\
		<li id=\"${id}_item_${data_index}\" class=\"ideo-lst-li\" ><a id=\"${id}_${data_index}\" href=\"#\" class=\"ideo-lst-item\">${formatData (data)}</a></li> \
	{/for}\
</ul>\
<br/>\
";



SweetDevRia.List.prototype.template = 
"\
<div id=\"${id}_container\" class=\"ideo-ndg-table\" style=\"{if width}width : ${width}px;{/if}{if height}height : ${height}px;{/if}\">\
	<div id=\"${id}_list\" class=\"ideo-lst-list\" style=\"{if width}width : ${width}px;{/if}{if height}height : ${height}px;{/if}\">\
		${getListContent(true)}\
	</div>\
	{if canResize}<div id=\"${id}_resizer\" class=\"ideo-ndg-resizer\">&nbsp;</div>{/if}\
</div>\
";




