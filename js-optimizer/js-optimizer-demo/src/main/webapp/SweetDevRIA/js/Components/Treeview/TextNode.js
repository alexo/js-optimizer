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

SweetDevRia.TextNode = function(data, parentNode, beforeNode, expanded) {

	superClass (this, SweetDevRia.Node);
	superClass (this, YAHOO.widget.TextNode, data, parentNode, expanded);
	
	this.className = SweetDevRia.TextNode;
	this.parentClass = YAHOO.widget.TextNode;

	/**
	 * Move child at this good position,because the  TextNode constructor
	 * add it at the last position 
	 */
	
	if (beforeNode) {
		 var refIndex = beforeNode.isChildOf(parentNode);

		 if ((refIndex  != null) && (refIndex > -1)) {
			SweetDevRia.Node.moveTo (this, refIndex);
		}
	}

	this.editable = booleanValue (data ["editable"]);
	this.finalNode = booleanValue (data ["finalNode"]);
	this.droppable = booleanValue (data ["droppable"]);
	this.draggable = booleanValue (data ["draggable"]);
	this.hasChild = booleanValue (data ["hasChild"]);
	this.selected = booleanValue (data ["selected"]);

	if (this.selected == true) {
		//this.tree.selectedNodes [this.tree.selectedNodes.length] = this.index;
		this.tree.selectNode (this.index);	
		//this.select ();
	}


	this.style = data ["style"];

	if (! data ["styleClass"]) {
		this.styleClass = "nodeLevel"+(parentNode.depth + 1);
	}
	else {
		this.styleClass = data ["styleClass"];
	}
};

extendsClass (SweetDevRia.TextNode, YAHOO.widget.TextNode);
extendsClass (SweetDevRia.TextNode, SweetDevRia.Node);

function booleanValue (obj) {
	if (obj != null) {
		var str = obj.toString().toLowerCase ();
		if (obj == true || str == "true" || str == "1"){
			return true;
		}else if (obj == false || str == "false" || str == "0"){
			return false;
		}
	}

	return null;
}


SweetDevRia.TextNode.prototype.unselect  = function() {
	if (! SweetDevRia.Node.prototype.unselect.call (this)){ 
		return ;
	}

	var selectedLabel = this.getLabelEl ();

	if (selectedLabel) {
		SweetDevRia.DomHelper.removeClassName (selectedLabel, "selectedNode");
	}
};

SweetDevRia.TextNode.prototype.getRiaStyle  = function() {
	return this.style;
};


SweetDevRia.TextNode.prototype.getRiaStyleClassName  = function(className) {
	var name = null;
	if (className) {
		SweetDevRia.DomHelper.indexCssStyles ();
		
		var opened = this.expanded;
		
		if (opened) {				
			name = className+"_open";
		}
		else {
			name = className+"_close";
		}

		if (name && ! SweetDevRia.DomHelper.cssClassExist (name)) {
			name = className;
		}

		if (name && ! SweetDevRia.DomHelper.cssClassExist (name)) {
			name = null;
		}

		if (name && (name.indexOf(".") === 0)) {
			name = name.substring (1);
		}
	}

	return name;
};

SweetDevRia.TextNode.prototype.getRiaStyleClass  = function() {
	var classes = this.labelStyle;
	
	if (this.styleClass != null) {
		var styleClasses = this.styleClass.split(" ");
	
		for(var i=0;i<styleClasses.length;++i){
			var riaStyleClassName = this.getRiaStyleClassName ("."+styleClasses[i]);
			if (riaStyleClassName) {
				classes += " "+riaStyleClassName+" ";
			}
		}
	}
	
	if (this.tree.foundNodes.contains (this.index)) {
		classes += " foundNode ";
	}

	if (this.tree.selectedNodes.contains (this.index)) {
		classes += " selectedNode ";
	}

	return classes;
};

SweetDevRia.TextNode.prototype.getRiaIconStyleClass  = function() {
	if (this.styleClass != null) {
		var styleClasses = this.styleClass.split(" ");
		
		for(var i=0;i<styleClasses.length;++i){
			var riaStyleClassName = this.getRiaStyleClassName ("."+styleClasses[i]+"_icon");
			if (riaStyleClassName) {
				return this.labelStyle+" "+riaStyleClassName;
			}
		}
	}

	return this.labelStyle;
};

SweetDevRia.TextNode.prototype.updateIcon  = function() {
	this.refreshNode ();	
};


SweetDevRia.TextNode.prototype.select  = function() {
	if(this.selected){
		return;//already selected
	}

	if (! SweetDevRia.Node.prototype.select.call (this)){ return;}

	var nodeLabel = this.getLabelEl();
	if (nodeLabel) {
		nodeLabel.focus();
		SweetDevRia.DomHelper.addClassName (nodeLabel, "selectedNode");
	}
};

SweetDevRia.TextNode.prototype.getStyle  = function() {
    if (this.isLoading) {
        return "ygtvloading";
    } else {
        // location top or bottom, middle nodes also get the top style
        var loc = (this.nextSibling) ? "t" : "l";

        // type p=plus(expand), m=minus(collapase), n=none(no children)
        var type = "n";
        if (this.hasChild) {
            type = (this.expanded) ? "m" : "p";
        }

        return "ygtv" + loc + type;
    }
};

SweetDevRia.TextNode.prototype.getNodeHtml  = function() { 
	var sb = new Array();

	sb[sb.length] = '<div id="'+this.getDivId () +'">';
	sb[sb.length] = this.getNodeContentHtml ();
	sb[sb.length] = '</div>';

	return sb.join("");
};

SweetDevRia.TextNode.prototype.getNodeContentHtml  = function() { 

	var sb = new Array();

	sb[sb.length] = '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
	sb[sb.length] = '<tr>';

	for (var i=0;i<this.depth;++i) {
		sb[sb.length] = '<td class="' + this.getDepthStyle(i) + '">&nbsp;</td>';
	}

	var getNode = 'YAHOO.widget.TreeView.getNode(\'' +
					this.tree.id + '\',' + this.index + ')';

	sb[sb.length] = '<td';
	sb[sb.length] = ' id="' + this.getToggleElId() + '"';
	sb[sb.length] = ' class="' + this.getStyle() + '"';
	if (this.hasChild || this.hasChildren(true)) {
		sb[sb.length] = ' onmouseover="this.className=';
		sb[sb.length] = getNode + '.getHoverStyle()"';
		sb[sb.length] = ' onmouseout="this.className=';
		sb[sb.length] = getNode + '.getStyle()"';
	}
	
	sb[sb.length] = ' onclick="javascript:' + this.getToggleLink() + '">&nbsp;';
	sb[sb.length] = '</td>';
	sb[sb.length] = '<td>';
	sb[sb.length] = '<span';
	sb[sb.length] = ' class="' + this.getRiaIconStyleClass() + '"';
	sb[sb.length] = ' style="width:100%;'+this.getRiaStyle()+'"';
	sb[sb.length] = ' id="' + this.labelElId + '_icon"';
	sb[sb.length] = ' onclick="javascript:' + this.getLabelLink() + '" ';
	if (this.hasChildren(true)) {
		sb[sb.length] = ' onmouseover="document.getElementById(\'';
		sb[sb.length] = this.getToggleElId() + '\').className=';
		sb[sb.length] = getNode + '.getHoverStyle()"';
		sb[sb.length] = ' onmouseout="document.getElementById(\'';
		sb[sb.length] = this.getToggleElId() + '\').className=';
		sb[sb.length] = getNode + '.getStyle()"';
	}
	sb[sb.length] = ' >'; 

	if (this.isEditable ()) {
		sb[sb.length] = '<span id="' + this.labelElId + '_editZone"  style="display:none">';
		sb[sb.length] = '<input value="'+this.data.label+'"/></span>';
	}
	
	sb[sb.length] = ' <span ';
	sb[sb.length] = ' class="' + this.getRiaStyleClass() + '" ';
	sb[sb.length] = ' id="' + this.labelElId + '"';
	sb[sb.length] =  ' >';
	
	sb[sb.length] = this.data.label;
	sb[sb.length] = '</span>';

	sb[sb.length] = '</span>';
	sb[sb.length] = '</td>';
	sb[sb.length] = '</tr>';
	sb[sb.length] = '</table>';

	return sb.join("");
};

SweetDevRia.TextNode.prototype.refreshNode  = function() { 
	var html = this.getNodeContentHtml ();
	var node = this.getDiv ();
	if (node && html) {
		node.innerHTML = html;
		this.initialize ();
	}
};
