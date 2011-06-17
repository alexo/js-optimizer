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
* @class RiaTabbox
* @constructor
* @param {String} id 	The id of the tabbox
* @private
*/
SweetDevRia.RiaTabbox = function(id){
    this.id = id;
   //YAHOO.util.Event.addListener(window, "load", this.init(this));
   superClass (this, SweetDevRia.RiaComponent, id, SweetDevRia.RiaTabbox.prototype.className);
};

extendsClass(SweetDevRia.RiaTabbox, SweetDevRia.RiaComponent);

SweetDevRia.RiaTabbox.prototype.tabs = [];
SweetDevRia.RiaTabbox.prototype.tabPanels = [];
SweetDevRia.RiaTabbox.prototype.width = null;
SweetDevRia.RiaTabbox.prototype.height = null;
SweetDevRia.RiaTabbox.prototype.yahooView = null;
SweetDevRia.RiaTabbox.prototype.className = "SweetDevRia.RiaTabbox";

/**
* Add a tab and a tabpanel to the tabbox
* @param {RiaTabModel} tab 				The tab
* @param {RiaTabPanelModel} tabpanel	The tab panel
*/
SweetDevRia.RiaTabbox.prototype.add = function(tab,tabpanel){
    this.tabs.push(tab);
    this.tabPanels.push(tabpanel);
};

/**
* Set the height of the tabbox
* @param {int} height	The height of the tabbox
*/
SweetDevRia.RiaTabbox.prototype.setHeight = function(height){
    this.height = height;
};
/**
* Set the width of the tabbox
* @param {int} width	The width of the tabbox
*/
SweetDevRia.RiaTabbox.prototype.setWidth = function(width){
    this.width = width;
};

/**
* @class RiaTabbox
* @constructor
* @param {String} id 	The id of the tabbox
*/
SweetDevRia.RiaTabbox.prototype.setYahooView = function(yahooView){
    this.yahooView = yahooView;
};

/**
* @class RiaTabModel
* @constructor
* @param {String} label 	The label of the tab
* @param {boolean} selected The state of the tab
* @param {String} label 	The label of the tab
* @param {String} label 	The label of the tab
* @param {String} label 	The label of the tab
* @private
*/
SweetDevRia.RiaTabModel = function(label,selected,state,image,removable){
    this.label = label;
    this.selected = selected;
    this.state = state;
    this.image = image;
    this.removable = removable;
};

SweetDevRia.RiaTabPanelModel = function(content,url){
    this.content = content;
    this.url = url;
};

SweetDevRia.RiaTabbox.prototype.getTabIndex = function (node){
    node = node.parentNode.parentNode.parentNode;
    var childNodes = node.parentNode.childNodes;
    var index = 0;
    for(var i=0;i<childNodes.length;i++){
        if(childNodes[i] == node) {
            break;
        }
        else {
            if(childNodes[i].nodeType == 1){
                index++;
            }
        }
    }
    return index;
};

SweetDevRia.RiaTabbox.prototype.addTab = function(tab,tabpanel,position){
    var label = ((tab.image!=null)?"<img style=\"height:16px;width : 16px;text-decoration : none;border : none;\" src=\"" + tab.image + "\"/>":"") + tab.label + ((tab.removable)?"<span onclick=\"SweetDevRia.$('"+this.id+"').yahooView.removeTab(SweetDevRia.$('"+this.id+"').yahooView.getTab(SweetDevRia.RiaTabbox.prototype.getTabIndex(this)));\" style=\"height:16px;width : 16px;position : absolute; right : 0px;top : 0px;text-decoration : none;border : none;\" class=\"ideo-tab-closeImg\"></span>":"");
    if(tabpanel.url){
    	tabpanel.content = "<iframe src='" + tabpanel.url + "' style='height:100%;width:100%'></iframe>";
    }
    this.yahooView.addTab(new YAHOO.widget.Tab({label: label,content: tabpanel.content,active: tab.selected}), position);
    SweetDevRia.RiaTab.prototype.counter = SweetDevRia.RiaTab.prototype.counter + 1;
    var riatab = new SweetDevRia.RiaTab("RiaTab_" + SweetDevRia.RiaTab.prototype.counter);
    riatab.add(this.id,tab,tabpanel,position);
};

SweetDevRia.RiaTabbox.prototype.saveSelection = function(node){
	var activeTabId = this.yahooView.get('activeTab').get('element').id;
	if(activeTabId!=undefined && activeTabId!=""){
		eval(activeTabId).updateServerModel("selected", false);
	}
	/*
	for(var i=0;i<tabstmp.length;i++){
		alert("selected::" + tabstmp[i].get('element').id);
		//if(this.tabs[i].selected) alert(this.tabs[i].label);
	}
	*/
	var index = this.getTabIndex(node);
	var tabtmp = eval(node.id);
	tabtmp.updateServerModel("selected", true);
};

/*
SweetDevRia.RiaTabbox.prototype.init = function(obj){
	return function(){
		for(var i=0;i<obj.tabs.length;i++){
		    var tab = new YAHOO.util.DragDrop(obj.id + "_tab" + i);
	 		tab.onDragDrop = obj.events.dropTag(obj);
		    tab.onDragOver = obj.events.onDragTag(obj);
		}
	};
};

SweetDevRia.RiaTabbox.prototype.events = {};

SweetDevRia.RiaTabbox.prototype.events.prototype.dropTab = function(obj){
	return function(e,id){
	    var arrow = document.getElementById(obj.id + "_arrow");
		arrow.style.visibility = "hidden";
	    var isLastNode = false;
	    var node = this.getEl();
	    var separator = obj.getNextCell(node);
	    if(separator === null) {
	        isLastNode = true;
	        separator = obj.getPreviousCell(node);
	    }
	    var targetNode = document.getElementById(id);
	    var isLastTarget = false;
	    if(obj.getNextCell(targetNode) === null) {
	        isLastTarget = true;
	    }                
	    var width = targetNode.offsetWidth;
	    var x = YAHOO.util.Event.getPageX(e);
	    var targetX = targetNode.offsetLeft;
	    var offsetX = x - targetX;
	    if(offsetX>=width /2){
	        if(!isLastTarget){
	            targetNode = obj.getNextColumn(targetNode);
	        }
	    }
		else{
			isLastTarget = false;
		}
	    
	    if((node==targetNode) || (obj.getNextColumn(node) == targetNode)){ 
			return;
	    }
	    
	    if(!isLastTarget){
	        targetNode.parentNode.insertBefore(node.parentNode.removeChild(node),targetNode);
	        targetNode.parentNode.insertBefore(separator.parentNode.removeChild(separator),targetNode);
	    }
	    else{
	        separator.parentNode.appendChild(separator.parentNode.removeChild(separator));
	        node.parentNode.appendChild(node.parentNode.removeChild(node));
	    }
	};
};

SweetDevRia.RiaTabbox.prototype.events.onDragColumn = function(obj){
	return function(e,id){
	    var target = document.getElementById(id);
	    var node = this.getEl();
	    var arrow = obj.getSubElement(obj.subElementIds.ddArrow);
	    var width = target.offsetWidth;
	    var x = YAHOO.util.Event.getPageX(e);
	    var targetX = target.offsetLeft;
	    var offsetX = x - targetX;
	    arrow.style.position = "relative";
	    arrow.style.visibility = "visible";
	    if(offsetX<width /2){
	        arrow.style.left = target.offsetLeft - 4 + "px";
	    }
	    else{
	        arrow.style.left = target.offsetLeft + width - 5 + "px";
	    }		
	};
};
*/



SweetDevRia.RiaTab = function(id){
	this.id = id;
   superClass (this, SweetDevRia.RiaComponent, id, SweetDevRia.RiaTab.prototype.className);
};
extendsClass(SweetDevRia.RiaTab, SweetDevRia.RiaComponent);
SweetDevRia.RiaTab.prototype.className = "SweetDevRia.RiaTab";
SweetDevRia.RiaTab.prototype.remove = function(tabbox,node){
	var index = SweetDevRia.RiaTabbox.prototype.getTabIndex(node);
	tabbox.yahooView.removeTab(tabbox.yahooView.getTab(index));
	/*
	SweetDevRia.ComHelper.fireEvent (
	    new SweetDevRia.RiaEvent ("remove", this.id, {"index":index})
	);
	*/
	this.updateServerModel("remove","remove");
};
SweetDevRia.RiaTab.prototype.add = function(tabboxId,tab,tabpanel,position){
	SweetDevRia.ComHelper.fireEvent( new SweetDevRia.RiaEvent ("addTabAndPanel", tabboxId, {"id" : this.id,"index":position,"label":tab.label,"selected":tab.selected,"image":tab.image,"removable":tab.removable,"content":tabpanel.content,"url":tabpanel.url}) );
	/*
	this.id = tabboxId;
	this.updateServerModel("addTabAndPanel","addTabAndPanel");
	*/
};
SweetDevRia.RiaTab.prototype.counter = 0;
