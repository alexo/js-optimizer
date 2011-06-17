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

SweetDevRia.Node = function() {
	this.data = {};
	
	this.editable = null;

	this.finalNode = false;
	this.droppable = true;
	this.draggable = true;
	
	this.target = null;
	
	/**
	 * Used for automatic open of hovered node
	 */
	this.hoverDivId = null;
	this.hoverTimer = null;
};

SweetDevRia.Node.DIV_PREF = "div_";
SweetDevRia.Node.HOVER_DELAY = 1000;

SweetDevRia.Node.prototype.select = function() {

	var selection;

	if (! this.tree.multiSelect || ! this.tree.selectedNodes.contains (this.index)) {
		var foundNodes = this.tree.foundNodes;
		if (! foundNodes.contains (this.index)) {
			for (var i = 0; i < foundNodes.length; i++) {
				var node = this.tree.getNodeByIndex (foundNodes [i]);
				var label = node.getLabelEl();
				if (label) {
					SweetDevRia.DomHelper.removeClassName (label, "foundNode");
				}
			}

			this.tree.foundNodes = [];
		}
	}

	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("selectNode", this.tree.id, {"nodeId":this.data.id,"select":true, "sendServer":true, "synchroCall":true}));

	return true;
};

SweetDevRia.Node.prototype.unselect = function() {
//	this.tree.unselectNode (this.index);

	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("selectNode", this.tree.id, {"nodeId":this.data.id,"select":false, "sendServer":true, "synchroCall":true}));
	return true;
};


SweetDevRia.Node.prototype.expand = function() {

	if(!this.hasChild){// TT 455
		return;
	}

    // Only expand if currently collapsed.
	this.parentClass.prototype.expand.call(this);

	if (! this.isLoading) {
		this.initializeChildren ();

		if (this.updateIcon) {
			this.updateIcon();
		}
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("expandNode", this.tree.id, {"nodeId":this.data.id,"expand":true, "sendServer":true}));
	}
};

SweetDevRia.Node.prototype.collapse = function() {
    // Only expand if currently collapsed.
    if (! this.expanded) { return; }
	this.parentClass.prototype.collapse.call(this);
	if (this.updateIcon) {
		this.updateIcon();
	}
	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("expandNode", this.tree.id, {"nodeId":this.data.id,"expand":false, "sendServer":true}));
};

SweetDevRia.Node.prototype.drawChildren = function() {
	this.getChildrenEl().innerHTML = this.renderChildren();
	this.initializeChildren ();
};


SweetDevRia.Node.prototype.removeChild = function(node) {
	
	if (this.tree.lastSelectedNode == node.index){
		this.tree.lastSelectedNode = null;
	}
	if (this.tree.copiedNodes.contains (node.index)){
		this.tree.copiedNodes.remove (node.index);
	}
	if (this.tree.cuttedNodes.contains (node.index)){
		this.tree.cuttedNodes.remove (node.index);
	}
	if (this.tree.selectedNodes.contains (node.index)){
		this.tree.selectedNodes.remove (node.index);
	}

	var length = node.children.length;
	for (var i = 0; i < length; i++) {
		node.removeChild (node.children [0]);
	}

	if (node.previousSibling && (node.previousSibling.index != node.index)) {
		node.previousSibling.nextSibling = node.nextSibling;
	}
	if (node.nextSibling && (node.nextSibling.index != node.index)) {
		node.nextSibling.previousSibling = node.previousSibling;
	}

	node.nextSibling = null;
	node.previousSibling = null;

	this.children.remove(node);

	var dragdrop = SweetDevRia.getComponent (SweetDevRia.Node.DIV_PREF+node.index);
	dragdrop.unreg ();

    node.tree			= null;
    node.parent			= null;
    node.depth			= null;
    node.multiExpand	= null;
	
};


SweetDevRia.Node.getIndex = function(node) {
	var index = 0;
	if (node.previousSibling) {
		return SweetDevRia.Node.getIndex (node.previousSibling) + 1;
	}
	return 1;
};

SweetDevRia.Node.prototype.initialize = function() {

	var label = this.getLabelEl ();
	if (label) {
		var tree = "YAHOO.widget.TreeView.getTree('" + this.tree.id + "')";
//		label.focus = new Function (tree+".selectNode("+this.index+")");
		label.blur =  new Function (tree+".setActive(false)");
	}

	var div = this.getDiv();

	if (div) {
		div.node = this;
	}

	if (! this.isRoot()) {
		var proxy = SweetDevRiaProxy.getInstance();
		var initEvt = new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.INIT_TYPE, proxy.id);

		var dragDrop = new SweetDevRia.DragDrop (SweetDevRia.Node.DIV_PREF+this.index, this.tree.id+"_grp", SweetDevRia.Node.handler);
		dragDrop.documentTarget = false;
		dragDrop.handleEvent (initEvt);

		if (!this.isDraggable()) {
			dragDrop.b4StartDrag =  function(e) {
				this.oldLocked = this.locked;
				this.locked = true;
			};

			dragDrop.endDrag =  function(e) {  
				this.locked = this.oldLocked;
			};
		}
	}

	if (this.isEditable ()) {
		label = this.getLabelEl ();
		if (label) {
			SweetDevRia.EditableText.add (label.id, null, this.data.label , this.tree.id, [this.tree.id], true);
			label.node = this;
		}
	}

	if (this.childrenRenderer) {
		this.initializeChildren ();
	}
};

SweetDevRia.Node.handler = function(type, args, src) {
	var el = this.getEl ();
	var node = el.node;
	var tree = node.tree;
	var nodeIds = tree.selectedNodes;
	var targetNode = null;
	
	var lastChildDiv;
	var beforeNode;
	var parentNode;

	var targetDivId = args[0]+"";
	var targetNodeindex = targetDivId.substring (SweetDevRia.Node.DIV_PREF.length);
	targetNode = tree.getNodeByIndex (targetNodeindex);

	if (type == "dragStart") {
		this.hoverDivId = null;
		this.hoverTimer = null;

		tree.unselectAll ();

		tree.selectNode (node.index);
	}
	else if (type == "dragEnd") {
		/** On remet l'opacit? initiale */
		SweetDevRia.DomHelper.setStyle (el, "opacity", "1");
		el.style.left = 0;
		el.style.top = 0;

		var dragdrop  = SweetDevRia.getComponent (SweetDevRia.Node.DIV_PREF+node.index);
		if (targetDivId !== "null" || (dragdrop.documentTarget && (targetDivId == SweetDevRia.DropZone.DOCUMENT_ID))) {
			var ctrlKey = args[1].ctrlKey;
	
			targetNode = SweetDevRia.RiaTreeview.getTargetNode (el, this.getDragEl(), targetNode, args [1]);
			parentNode = targetNode [0];
			beforeNode = targetNode [1];
		
			if (parentNode !== null) {
				
				if (ctrlKey) {
					tree.copiedNodes = nodeIds;
				}
				else {
					tree.cuttedNodes = nodeIds;
				}

				tree.pasteNode (parentNode, beforeNode, true);
			}

		}

		if (this.hoverNode) {
				SweetDevRia.DomHelper.removeClassName (this.hoverNode, "hoverNode");
				SweetDevRia.DomHelper.removeClassName (this.hoverNode, "beforeNode");
				this.hoverNode = null;
		}
		if ((this.hoverLastChild !== null)&&(this.hoverLastChild !== undefined)) {
			lastChildDiv = SweetDevRia.DomHelper.get (this.hoverLastChild.labelElId);
			SweetDevRia.DomHelper.removeClassName (lastChildDiv, "afterNode");
			this.hoverLastChild = null;
		}


	//	node.unselect ();
	}
	else if (type == "dragOver") {
		if (args[0] == SweetDevRia.DropZone.DOCUMENT_ID){ return;}

		/** Montre la position de l'?l?ment en cas de drop */
		SweetDevRia.DomHelper.setStyle (el, "opacity", "0.5");

		/**
		 * Open node after 2 sec hover
		 */
		var getTargetNode = 'YAHOO.widget.TreeView.getNode(\'' +
				targetNode.tree.id + '\',' + targetNode.index + ')';
				
		if (this.hoverTimer === null) {
			this.hoverDivId = targetDivId;
			this.hoverTimer = window.setTimeout(getTargetNode+".expand();", SweetDevRia.Node.HOVER_DELAY);
		}
		else if (this.hoverDivId != targetDivId) {
			if (this.hoverTimer){
				window.clearTimeout(this.hoverTimer);
			}
			this.hoverDivId = targetDivId;
			this.hoverTimer = window.setTimeout(getTargetNode+".expand();", SweetDevRia.Node.HOVER_DELAY);
		}

		YAHOO.util.DragDropMgr.locationCache = {};

		targetNode = SweetDevRia.RiaTreeview.getTargetNode (el, this.getDragEl(), targetNode, args [1]);

		parentNode = targetNode [0];
		beforeNode = targetNode [1];

		targetNode = parentNode;
		if (beforeNode){ targetNode = beforeNode;}

		if (targetNode !== null && targetNode.labelElId !== null) {
			/**
			 * We delete old style class in old hover node
			 */
			if ((this.hoverNode !== null)&&(this.hoverNode !== undefined)) {
				SweetDevRia.DomHelper.removeClassName (this.hoverNode, "hoverNode");
				SweetDevRia.DomHelper.removeClassName (this.hoverNode, "beforeNode");

				if ((this.hoverLastChild !== null)&&(this.hoverLastChild !== undefined)) {
					lastChildDiv = SweetDevRia.DomHelper.get (this.hoverLastChild.labelElId);
					SweetDevRia.DomHelper.removeClassName (lastChildDiv, "afterNode");
					this.hoverLastChild = null;
				}
			}

			/**
			 * We add style class on new hovernode
			 */
			this.hoverNode = SweetDevRia.DomHelper.get (targetNode.labelElId);
			if (beforeNode){
				SweetDevRia.DomHelper.addClassName (this.hoverNode, "beforeNode");
			}
			else {
				SweetDevRia.DomHelper.addClassName (this.hoverNode, "hoverNode");

				if (targetNode.expanded && targetNode.hasChildren()) {
					this.hoverLastChild = targetNode.children [targetNode.children.length - 1]; 
					lastChildDiv = SweetDevRia.DomHelper.get (this.hoverLastChild.labelElId);
					SweetDevRia.DomHelper.addClassName (lastChildDiv, "afterNode");
				}
				
			}
		}

	}	
};

SweetDevRia.Node.prototype.initializeChildren = function() {
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children [i];
		child.initialize ();
	}
};

SweetDevRia.Node.prototype.refreshChildren = function(recursiv) {//TT 449
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children [i];
		child.refreshNode();
		if(recursiv && child.hasChild && child.expanded){
			child.refreshChildren(true);
		}
	}
};

SweetDevRia.Node.prototype.isEditable = function() {
	return (this.editable || (this.tree.editable && (this.editable !== false || this.editable !== null)));
};

SweetDevRia.Node.prototype.isDroppable = function() {
	return (this.droppable && ! this.finalNode);
};

SweetDevRia.Node.prototype.isDraggable = function() {
	return this.draggable;
};

SweetDevRia.Node.prototype.isFinalNode = function() {
	return (this.finalNode);
};

SweetDevRia.Node.prototype.toggle = function() {
	this.parentClass.prototype.toggle.call(this);

//	this.select ();
};

SweetDevRia.Node.prototype.getLabelLink = function() {
    return "YAHOO.widget.TreeView.getNode(\'" + this.tree.id + "\'," + 
        this.index + ").labelAction()";
};

SweetDevRia.Node.prototype.labelAction = function() {
	if(this.uncompleted == true) {
		this.childrenRendered = false;
		this.expanded = false;
		this.dynamicLoadComplete = false;
	}

//	this.toggle ();
	this.tree.selectNode (this.index);
	
	if (this.href) {
		var target = SweetDevRia.DomHelper.get (this.target);

		if (target) {
			if (target.nodeName == "IFRAME") {
				var param  = "treeId="+this.tree.id+"&nodeId="+this.data.id;	
				if (this.href.indexOf ("?") > -1){
					target.src = this.href+"&"+param;
				}
				else{
					target.src = this.href+"?"+param;
				}
			}
			else {
				var node = this;
				//JSLINT MODIFICATION
				//function myCallback() {
				var myCallback = function(){
					target.innerHTML =  this.getResponseText();
					
					SweetDevRia_Zone_evalJS( target );

					SweetDevRia_initCompNotInitialized ();
				};

				SweetDevRia.ComHelper.call (this.href, {"treeId":this.tree.id, "nodeId":this.data.id, "__RiaPageId":window[SweetDevRia.ComHelper.ID_PAGE]}, myCallback);
			}
		}
		else {
			document.location = this.href;
		}
	}
};

SweetDevRia.Node.prototype.clone = function(parent) {
	var clone = new this.className (this.data, parent, false);
	for (var i = 0; i < this.children.length; i++) {
		var childClone = this.children[i].clone (clone);
	}

	return clone;
};


SweetDevRia.Node.prototype.appendChild = function(node) {
	node.children = [];

	//this.parentClass.prototype.appendChild.call (this, node);
    if (this.hasChildren()) {
        var sib = this.getLastChild (); //children[this.children.length - 1];
        sib.nextSibling = node;
        node.previousSibling = sib;
    }
    this.children[this.children.length] = node;
    node.applyParent(this);

    node.tree			= this.tree;
    node.parent			= this;
    node.depth			= this.depth + 1;
    node.multiExpand	= this.multiExpand;

	return node;
};

SweetDevRia.Node.prototype.getDivId = function() {
	return SweetDevRia.Node.DIV_PREF+this.index;
};

SweetDevRia.Node.prototype.getDiv = function() {
	return SweetDevRia.DomHelper.get (this.getDivId());
};

SweetDevRia.Node.prototype.findChild = function(nodeId) {

	if (this.data.id == nodeId) {
		return this;
	}

	for (var i = 0; i < this.children.length; i++) {
		var child = this.children [i];
		var found = child.findChild (nodeId);
		if (found) {
			return found;
		}
	}

	return null;
};

SweetDevRia.Node.prototype.getFirstChild = function() {
	var children = this.children;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children [i].previousSibling == null) {
			return this.children [i];
		}
	}
	
	return null;
};

SweetDevRia.Node.prototype.getLastChild = function() {
	var children = this.children;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children [i].nextSibling == null) {
			return this.children [i];
		}
	}
	
	return null;
};

SweetDevRia.Node.prototype.getChildAt = function(position) {
	
	var children = this.children;
	
	if (!children || (position < 0)||(position >= children.length)){ 
		return null; 
	}

	var child = this.getFirstChild ();
	for (i = 0; i < position && child; i++) {
		child = child.nextSibling;
	}
	return child;
};

/**
 * Change the position of a node  
 * @param {Object} node The node to deplace
 * @param {Object} position the new position of the node
 */
SweetDevRia.Node.moveTo = function(node, position) {

    var parentNode = node.parent;
    if (parentNode) {
		var previousNode = parentNode.getChildAt (position - 1); // dernier noeud
		var nextNode = parentNode.getChildAt (position); //null

		if (node.previousSibling) {
			node.previousSibling.nextSibling = node.nextSibling;
		}
		if (node.nextSibling) {
			node.nextSibling.previousSibling = node.previousSibling;
		}


		if (previousNode) {
	        previousNode.nextSibling = node;
		}
        node.previousSibling = previousNode;

		if (nextNode) {
	        nextNode.previousSibling = node;
		}
        node.nextSibling = nextNode;

    }

    return node;
};

SweetDevRia.Node.prototype.isChildOf = function(parentNode) {
   if (parentNode && parentNode.children) {
   		var node = parentNode.getFirstChild ();
        for (var i=0, len=parentNode.children.length; i<len ; ++i) {
            if (node === this) {
                return i;
            }
			node = node.nextSibling;
        }
    }

    return -1;
};

function displayNode (node, indent) {
	if (indent == null){ indent = "";}
	var rep = indent + node.data.label + "\n";
	for (var i = 0; i < node.children.length; i++) {
		var child = node.children [i];
		rep += displayNode (child, indent + "  ");
	} 
	return rep;
}
