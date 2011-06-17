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
* @class Treeview
* @constructor
* @param {String} id	The id of the treeview
*/
SweetDevRia.RiaTreeview = function(id) {
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.RiaTreeview");
	superClass (this, YAHOO.widget.TreeView, id);

	this.selectedNodes = [];
	this.lastSelectedNode = null;

	this.multiSelect = false;
	
	this.copiedNodes = [];
	this.cuttedNodes = [];
	this.hoverNode = null;
	
	this.foundNodes = [];
	
};

extendsClass (SweetDevRia.RiaTreeview, SweetDevRia.RiaComponent, YAHOO.widget.TreeView);

SweetDevRia.RiaTreeview.NODE_MARGING = 2;

/**
* Initialize this treeview.
* @param {String} id	The id to initialize
*/
SweetDevRia.RiaTreeview.prototype.init = function(id) {
	YAHOO.widget.TreeView.prototype.init.call (this, id);

	this.root = new SweetDevRia.RootNode(this);
	
	this.regNode (this.root);
};

/**
* Handles events
* @private
*/
SweetDevRia.RiaTreeview.prototype.handleEvent = function(evt) {
	if (evt.type == SweetDevRia.RiaEvent.INIT_TYPE) {

		this.initializeNodes ();

		return true;
	}
/*
	else if (evt.type == SweetDevRia.RiaEvent.HASH_TYPE) {
		if (evt.hashId == this.id && evt.hashValue && evt.hashValue != "") {
			var nodeIndex = evt.hashValue;
			var selection = this.getNodeByIndex (nodeIndex);
			if (selection && selection.index) {
				selection.labelAction ();
			 }
		}
	}
*/
	else if (this.isActive ()) {
		var compId = null;
		var elem = null;
		var dragdrop = null;

		if (evt.type == SweetDevRia.RiaEvent.CHANGE_VALUE_TYPE) {
			this.modify (evt.idSrc, evt.oldValue, evt.newValue);	
		}
		else if (evt.type == SweetDevRia.RiaEvent.OPEN_EDIT_TYPE) {
			compId = evt.compId;
			if (compId == this.id) {
				this.editMode = true;

				elem = SweetDevRia.DomHelper.get (evt.elemId);
				dragdrop = SweetDevRia.getComponent (SweetDevRia.Node.DIV_PREF+elem.node.index);
				dragdrop.setLock (true);
			}
		}
		else if (evt.type == SweetDevRia.RiaEvent.CLOSE_EDIT_TYPE) {
			compId = evt.compId;
			if (compId == this.id) {
				this.editMode = false;

				elem = SweetDevRia.DomHelper.get (evt.elemId);
				dragdrop = SweetDevRia.getComponent (SweetDevRia.Node.DIV_PREF+elem.node.index);
				dragdrop.setLock (false);
			}
		}

		if (! this.editMode) {
			if (evt.type == SweetDevRia.RiaEvent.KEYBOARD_TYPE) {
				var keyCode = evt.keyCode;
				var selection = null;
				switch(keyCode) {
					case SweetDevRia.KeyListener.ESCAPE_KEY:
						this.setActive(false);
						for (var i = 0 ; i < this.selectedNodes.length; i ++) {
							selection = this.getNodeByIndex (this.selectedNodes [i]);
							if (selection !== null) {
								selection.unselect();
							}
						}
						break;
					case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
					case SweetDevRia.KeyListener.MINUS_KEY:
						selection = this.getNodeByIndex (this.lastSelectedNode);	
						selection.collapse();
						break;
					case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
					case SweetDevRia.KeyListener.PLUS_KEY:
						selection = this.getNodeByIndex (this.lastSelectedNode);	
						selection.expand();
						break;
					case SweetDevRia.KeyListener.ARROW_UP_KEY:
					case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
						this.changeSelection (keyCode);
						break;
					case SweetDevRia.KeyListener.STAR_KEY:
						selection = this.getNodeByIndex (this.lastSelectedNode);	
						selection.expandAll();
				        selection.expand();
						break;
					case SweetDevRia.KeyListener.DELETE_KEY:
						this.deleteNode ();
						break;
					case SweetDevRia.KeyListener.INSERT_KEY:
						this.add ();
						break;
					case SweetDevRia.KeyListener.F2_KEY:
						this.edit ();
						break;
					default:
						break;
				}
			}
			else if (evt.type == SweetDevRia.RiaEvent.COPY_TYPE) {
				this.copiedNodes = this.selectedNodes;
			}
			else if (evt.type == SweetDevRia.RiaEvent.CUT_TYPE) {
				this.cuttedNodes = this.selectedNodes;
			}
			else if (evt.type == SweetDevRia.RiaEvent.PASTE_TYPE) {
				this.pasteNode ();
			}

			if (evt.srcEvent !== null && evt.srcEvent !== undefined) {
				SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
				SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			}
		}
		
		return true;
	}
	else {
		return true;
	}
};


/**
 * return false if copyCutNode is similar with targetNode or if it
 * is one of these children
 */
SweetDevRia.RiaTreeview.testPaste = function(copyCutNode, targetNode, dragdrop) {
	if (targetNode != null ) {
		if (copyCutNode.index == targetNode.index) {
			return false;
		}
		else {
			return SweetDevRia.RiaTreeview.testPaste (copyCutNode, targetNode.parent);
		}
	}
	
	return true;
};


SweetDevRia.RiaTreeview.prototype.pasteNode = function(parentNode, beforeNode, dragdrop) {
	if (parentNode == null) {
		return;
	}

	var nodeIds = null;
	var mode = null;

	if (this.copiedNodes !== null && this.copiedNodes.length)  {
		nodeIds = this.copiedNodes;
		mode = "copy";
	}
	else if (this.cuttedNodes !== null && this.cuttedNodes.length)  {
		nodeIds = this.cuttedNodes;
		mode = "cut";
	}

	var nodeDataIds = [];
	for (var i = 0; i < nodeIds.length; i++)  {
		var node = this.getNodeByIndex (nodeIds [i]);
		if (SweetDevRia.RiaTreeview.testPaste (node, parentNode, dragdrop)) {
			nodeDataIds [nodeDataIds.length] = node.data.id;
		}
	}

	var beforeNodeId = null;
	if(beforeNode) 	{
		beforeNodeId = beforeNode.data.id;
	}

	if (nodeDataIds && nodeDataIds.length && parentNode) {
		/** If this node is not final and droppable if dragdrop is true */
		if (! parentNode.finalNode && (!dragdrop || parentNode.droppable)) {
			SweetDevRia.ComHelper.fireEvent (
				new SweetDevRia.RiaEvent ("pasteNode", this.id, 
									{	"nodeIds":nodeDataIds,
										"parentId":parentNode.data.id,
										"beforeNodeId":beforeNodeId, 
										"typePaste":mode,
										"all":(! parentNode.childrenRendered), 
										"sendServer":true}));
			parentNode.expand ();
		}
	}

	this.copiedNodes = [];
	this.cuttedNodes = [];
};

SweetDevRia.RiaTreeview.prototype.onPasteNode = function(evt) {
	var parent = this.root.findChild (evt.parentId);
	
	if (evt.typePaste == "cut") {
		/**
		 * If it's a cut, I delete old node, firstly in the nodes array
		 * and secondly, the node div 
		 */
		for (var i = 0; i < evt.nodeIds.length; i++) {

			var cuttedNodes = this.root.findChild (evt.nodeIds [i]);
			var cuttedParent = cuttedNodes.parent;
	
			cuttedParent.removeChild (cuttedNodes);
			
			var el = cuttedNodes.getEl();
			el.parentNode.removeChild (el);
		}
	}		

	var beforeNode = null;
	if (evt.beforeNodeId) {
		beforeNode = this.root.findChild (evt.beforeNodeId);
	}

	this.addNodes(parent, beforeNode, SweetDevRia.ComHelper.parseXml(evt.xml));

	this.root.refreshChildren(true);

	//this.updateIcons ();

	return true;
};

//SweetDevRia.RiaTreeview.prototype.updateIcons = function(node) {
//	if (node === null || node === undefined)  {
//		node = this.root;
//	}
//		
//	if (node.updateIcon) {
//		node.updateIcon ();
//	}
//
//	var nextNode = this.getNextNode (node);
//	if (nextNode != null && nextNode.index !== node.index) {
//		this.updateIcons (nextNode);
//	}
//};	


SweetDevRia.RiaTreeview.prototype.selectNode = function(nodeIndex) {
	if (this.multiSelect) {
		if (this.selectedNodes.contains(nodeIndex)){
			var selection = this.getNodeByIndex (this.index);	
			if (selection) {
				selection.unselect ();
			}
			return;
		}
		this.selectedNodes [this.selectedNodes.length] = nodeIndex;
	}
	else {
		this.selectedNodes = [nodeIndex];
	}

	if (! this.multiSelect && this.lastSelectedNode) {
		var selection = this.getNodeByIndex (this.lastSelectedNode);	
		if (selection) {
			selection.unselect ();
		}
	}

	this.lastSelectedNode = nodeIndex;
	
	this.setActive (true);

	var selection = this.getNodeByIndex (nodeIndex);	
	if (selection) {
		selection.select ();
	}
//	if (selection && selection.updateIcon) {
//		selection.updateIcon ();
//	}

//	this.addHash (nodeIndex);
};

SweetDevRia.RiaTreeview.prototype.unselectNode = function(nodeIndex) {
	if (this.selectedNodes.contains (nodeIndex)) {
		this.selectedNodes.remove (nodeIndex);
	 }
	
	if (this.lastSelectedNode == nodeIndex){
		this.lastSelectedNode = null;
	}
	
	var selection = this.getNodeByIndex (nodeIndex);	
	if (selection) {
		selection.unselect ();
	}
//	if (selection && selection.updateIcon) {
//		selection.updateIcon ();
//	}
};


SweetDevRia.RiaTreeview.prototype.getPreviousNode = function(node) {
	var previousNode = null;
	var previousSibling = node.previousSibling;

	if (previousSibling) {
		if (previousSibling.hasChildren() && previousSibling.expanded) {
			while (previousNode === null) {
				var lastChild = previousSibling.getLastChild ();
				
				if (lastChild.hasChildren() && lastChild.expanded) {
					previousSibling = lastChild;
				}
				else {
					previousNode = lastChild;
				}
			}
		}
		else {
			previousNode = node.previousSibling;
		}
	}
	else {
		if (node.parent && node.parent.isRoot()) {
			previousNode = node;
		}
		else {
			previousNode = node.parent;
		}
	}

	return previousNode;
};


SweetDevRia.RiaTreeview.prototype.getNextNode = function(node) {
	var nextNode = null;
    if (node.hasChildren() && node.expanded) {
		/**
		 * If this node has children and is expanded, 
		 * we return the first child
		 */
		nextNode = node.getFirstChild ();
		
    }
    else {
		/**
		 * If the node has a brother after (nextSibling), we return it
		 */
    	if (node.nextSibling) {
			nextNode = node.nextSibling;
		} 
		else {
			/**
			 * Else we return the next brother of the father (wich has a next brother)
			 */
			var parent = node.parent;
			/** 
			 * We search for the father wich have a next brother
			 */
			while ((parent !== null) && (parent.nextSibling === null)) {
				parent = parent.parent;
			}

			if (parent !== null) {				
				nextNode = parent.nextSibling;
			}

		}
    }
    return nextNode;
};




SweetDevRia.RiaTreeview.prototype.display = function(node) {

	if (node === null || node === undefined)  {
		SweetDevRia.log.debug ("********** RiaTreeview_display **************");
		node = this.root;
	}
		
	SweetDevRia.log.debug (""+node);

	var nextNode = this.getNextNode (node);
	if (nextNode != null) {
		this.display (nextNode);
	}
};



SweetDevRia.RiaTreeview.prototype.changeSelection = function(keyCode) {

	var selection = this.getNodeByIndex (this.lastSelectedNode);	

	if (selection) {
		var newSelection = null;
		switch(keyCode) {
			case SweetDevRia.KeyListener.ARROW_UP_KEY:
				newSelection = this.getPreviousNode (selection);
				break;
			case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
				newSelection = this.getNextNode (selection);
				break;
			default :
				break;
		}

		if (newSelection) {
			this.unselectAll ();

			this.selectNode (newSelection.index);
		}
	}
};


SweetDevRia.RiaTreeview.prototype.initializeNodes = function() {
	this.root.initializeChildren ();
};
 

SweetDevRia.RiaTreeview.getTargetNode = function(el, dragEl, testedNode, evt) {
	var tree = el.node.tree;

	var testedEl = testedNode.getDiv ();

	if (testedEl) {
		var y = SweetDevRia.DomHelper.getY (dragEl);
		y = evt.clientY;

		var region = YAHOO.util.Region.getRegion(testedEl);
		var testedHeight = region.bottom - region.top;
		var testedY = region.top;

		var parentNode = testedNode;
		var beforeNode = null;	

		var marging = SweetDevRia.RiaTreeview.NODE_MARGING;

		/**
		 * If this node isn't droppable, we increase marging
		 * to disable drop into this node 
		 */
		if (! testedNode.isDroppable ()) {
			marging = testedHeight / 2 + 1;	
		}


		if (y < (testedY + marging)) {
			/**
			 * If user want drop the node before the testedNode
			 */
			beforeNode = testedNode;
			parentNode = testedNode.parent;
		}
		if (y > (testedY + testedHeight - marging)) {
			/**
			 * If user want drop the node after the testedNode
			 */
			
			/**
			 * If the testedNode has a nextSibling, we drop before it
			 */
			var next = testedNode.nextSibling;
			if (next) {
				beforeNode = next;
				parentNode = testedNode.parent;
			}
			else {
				/**
				 * We add the node at the last position
				 */
				parentNode = testedNode.parent;
				beforeNode = null;
			}
		}

		if (parentNode.isDroppable ()) {
			return [parentNode, beforeNode];
		}
		else {
			return [null, null];			
		}
			
	}
};

SweetDevRia.RiaTreeview.prototype.addXmlNode = function(parentNode, beforeNode, xml, active, search) {
	if (xml.nodeName == "node") {
		var id = xml.getAttribute("id");
		var tmpNode = null;
		if (id && id !== "") {
			var expanded = (search && xml.childNodes.length > 0) || ((xml.getAttribute("expanded") == "true") && (xml.childNodes.length > 0));//TT 454
			tmpNode = this.root.findChild (id);
			if (! tmpNode) {
				var objToAdd = { id: xml.getAttribute("id"), 
								label:  xml.getAttribute("label"),  
								href: xml.getAttribute("href") ,  
								target: xml.getAttribute("target"),  
								editable: eval (xml.getAttribute("editable")) ,
								finalNode: eval (xml.getAttribute("finalNode")) ,
								droppable: eval (xml.getAttribute("droppable")) ,
								draggable: eval (xml.getAttribute("draggable")) ,
								hasChild: eval (xml.getAttribute("hasChild")) ,
								style: xml.getAttribute("style"),  
								styleClass: xml.getAttribute("styleClass"),
								expanded: eval (xml.getAttribute("expanded")),
								selected: eval (xml.getAttribute("selected"))
								};
				if(!objToAdd.draggable){
					objToAdd.style+=";cursor:default";
				}

				tmpNode = new SweetDevRia.TextNode(objToAdd, parentNode, beforeNode, expanded);
				parentNode.hasChild = true;

				if (parentNode.getChildrenEl() ) {
					var elem = document.createElement ("div");
					elem.innerHTML = tmpNode.getHtml();
//	SweetDevRia.log.debug (id+" :: "+elem.innerHTML)
					var child = elem.childNodes [0];
					if (child) {
						  
						if (beforeNode) {
							parentNode.getChildrenEl().insertBefore (child, beforeNode.getEl());
						}
						else {
							parentNode.getChildrenEl().appendChild (child);
						}
		
						/**
						 * Refresh children after add because a display bug
						 */
						parentNode.getChildrenEl().style.display = "";
							
						tmpNode.initialize ();
								
						/**
						 * update icons
						 */
						tmpNode.updateIcon ();

					}
				}
				
				// TODO srevel test
				parentNode.childrenRenderer = true;
				
			}
			else {
				tmpNode.expanded = expanded;
			}

			if (search && ! xml.childNodes.length) {
				this.foundNodes [this.foundNodes.length] = tmpNode.index;
			}
		}
		else {
			tmpNode = parentNode;
		}

		tmpNode.uncompleted = search;

		if (search && parentNode.updateIcon  && parentNode.getChildrenEl() ) {
			parentNode.getChildrenEl().style.display = "";
			parentNode.updateIcon ();
		}

		for(var j = 0; j < xml.childNodes.length; j++) {
			this.addXmlNode (tmpNode, null, xml.childNodes[j], active, search);
		}		
	
		if (tmpNode.hasChild && tmpNode.getChildrenEl() && !expanded) {
			tmpNode.getChildrenEl().style.display = "none";
		}
	}

	parentNode.refreshChildren(false);
};

/**
 * Parse XML and add nodes to this tree on specified node.
 * @param node node into add XML nodes
 * @param xml XML describing nodes to add.
 */
SweetDevRia.RiaTreeview.prototype.addNodes = function(node, beforeNode, xml, active, search) {
	if (active === null){ active = false;}
	if (search === null){ search = false;}
	
	if (!xml) {
		SweetDevRia.log.debug("RiaTreeview.addNodes : 'xml' is null ! No XML or empty response (wich means no child in this node).");
		return false;
	}
	
	var treeview = xml.getElementsByTagName("treeview")[0];
	if (treeview) {
		var children = treeview.childNodes;

		if (children.length > 0) {
			for (var i = 0; i < children.length; i++) {
				var child = children [i];
				this.addXmlNode (node, beforeNode, child, active, search);
			}
			return true;
		}
	}
	
	return false;
};

/**
 * Load child.
 * @param node node.
 */
SweetDevRia.RiaTreeview.prototype.loadDataForNode = function(node) {
	// Only request server when no child are present.
	if (node.children.length == 0 || node.toReload == true) {
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("loadNode", this.tree.id, {"nodeId":node.data.id, "sendServer":true}));
	} else {
		node.loadComplete();
	}
	
	if (node.uncompleted == true) {
		node.toReload = true;
	}
};

SweetDevRia.RiaTreeview.prototype.onLoadNode = function(evt) {
	var node = this.root.findChild (evt.nodeId);

	if (node) {

		if (! this.addNodes(node, null, SweetDevRia.ComHelper.parseXml(evt.xml))) {
			node.getChildrenEl().style.display = "none";
		}
		node.toReload = false;
		node.uncompleted = false;					
		node.loadComplete ();
	}	
	return true;
};


/**
 * Add a new child.
 */
SweetDevRia.RiaTreeview.prototype.add = function() {
	var selection = this.getNodeByIndex (this.lastSelectedNode);	
	if (! selection) {
		selection = this.root;
	}
	if (selection && ! selection.isFinalNode ()) {
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("addNode", this.id, {"nodeId":selection.data.id, "sendServer":true}));
	}
};

SweetDevRia.RiaTreeview.prototype.onAddNode = function(evt) {
	var node = this.root.findChild (evt.nodeId);
	this.addNodes(node, null, SweetDevRia.ComHelper.parseXml(evt.xml), true);
	node.refreshChildren(true);
	
	if(node.expanded == false){
		node.toggle();
	}
	
	return true;
};

/**
 * Edit selected node.
 */
SweetDevRia.RiaTreeview.prototype.edit = function() {
	var selection = this.getNodeByIndex (this.lastSelectedNode);	
	
	if (selection && selection.isEditable ()) {
		var label = SweetDevRia.DomHelper.get (selection.labelElId);
		if (label) {
			SweetDevRia.EditableText.active (label);
		}
	}
};


/**
 * Modify node value.
 */
SweetDevRia.RiaTreeview.prototype.modify = function(labelId, oldValue, newValue) {
	var label = SweetDevRia.DomHelper.get (labelId);
	if (label) {
		var node = label.node;
		if (node && node.isEditable()) {
			SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("modifyNode", this.id, {"nodeId":node.data.id,"oldValue":oldValue,"newValue":newValue, "sendServer":true}));
	
			node.data.label = newValue;
		}
	}
};

/**
 * Delete selected node.
 */
SweetDevRia.RiaTreeview.prototype.deleteNode = function() {

	var length = this.selectedNodes.length;
	for (var i = 0; i < length; i++) {
		var index = this.selectedNodes [i];
		var selection = this.getNodeByIndex (index);	
	
		if (selection && ! selection.isRoot() && selection.isEditable()) {
			SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("deleteNode", this.id, {"nodeId":selection.data.id , "sendServer":true}));
	
			var parent = selection.parent;
			parent.removeChild (selection);
			
			var el = selection.getEl();
			el.parentNode.removeChild (el);

			if (parent.children.length == 0) {
				// refresh because no childre, delete + or -
				parent.hasChild = false;
				parent.collapse ();
				parent.refresh ();
			}else{
				parent.refreshChildren(true);//TT 449
			}
	
			parent.select ();
			
			this.selectedNodes.remove (index);
		}
	 }
};


SweetDevRia.RiaTreeview.prototype.searchByLabel = function(label) {
	if (label) {
		this.foundNodes = [];
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("searchByLabel", this.id, {"label":label , "sendServer":true}));
	}
};

SweetDevRia.RiaTreeview.prototype.onSearchByLabel = function(evt) {
	this.addNodes(this.root, null, SweetDevRia.ComHelper.parseXml(evt.xml), null, true);

	if (this.foundNodes.length) {
		var lastId = this.foundNodes [this.foundNodes.length - 1];
		var node = this.getNodeByIndex (lastId);
		if (node) {
			node.labelAction ();
		}
	}

	return true;
};


SweetDevRia.RiaTreeview.prototype.searchById = function(id) {
	if (id) {
		this.foundNodes = [];

		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("searchById", this.id, {"nodeId":id , "sendServer":true}));
	}
};

SweetDevRia.RiaTreeview.prototype.onSearchById = function(evt) {
	this.addNodes(this.root, null, SweetDevRia.ComHelper.parseXml(evt.xml), null, true);
	
	return true;
};


SweetDevRia.RiaTreeview.prototype.getSelectedIds = function() {
	return this.selectedNodes;
};

SweetDevRia.RiaTreeview.prototype.unselectAll = function() {
	var length = this.selectedNodes.length;
	for (var i = 0; i < length; i ++) {
		this.unselectNode(this.selectedNodes [0]);
	}
};