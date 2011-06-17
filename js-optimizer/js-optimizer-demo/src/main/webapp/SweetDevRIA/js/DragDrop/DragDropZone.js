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
 * @class a DragDrop implementation that inserts an empty, bordered div into
 * the document that follows the cursor during drag operations.  At the time of
 * the click, the frame div is resized to the dimensions of the linked html
 * element, and moved to the exact location of the linked element.
 *
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {String} id the id of the linked html element
 * @param {String} sGroup the group of related DragDrop objects
 */
SweetDevRia.DragDrop = function(id, grpId, handler) {
    if (id) {
		superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.DragDrop");
		superClass (this, YAHOO.util.DDProxy, id, grpId);

		this.handler = handler;
		this.mode = SweetDevRia.DragDrop.ALL_MODE;
		this.grpId = grpId;
		this.type = SweetDevRia.DragDrop.DUPLICATE_TYPE;

		/**
		 * true if we can drop this object on #document, else false;
		 */
		this.documentTarget = true;

		this.multiSelect = true;
		this.origZ = 0;
		this.selectedObjects = [];

		this.locked = false;

    	YAHOO.util.DragDropMgr.clickTimeThresh = 100000;

		/** Event declarations */
		this.dragStartEvt = new SweetDevRia.EventHelper.customEvent("dragStart", this);
		this.dragEndEvt = new SweetDevRia.EventHelper.customEvent("dragEnd", this);
		this.dragEnterEvt = new SweetDevRia.EventHelper.customEvent("dragEnter", this);
		this.dragOverEvt = new SweetDevRia.EventHelper.customEvent("dragOver", this);
		this.dragOutEvt = new SweetDevRia.EventHelper.customEvent("dragOut", this);

		/** Events management subscription */
		this.dragStartEvt.subscribe(SweetDevRia.DragDrop.prototype.handler, this);
		this.dragEndEvt.subscribe(SweetDevRia.DragDrop.prototype.handler, this);
		this.dragEnterEvt.subscribe(SweetDevRia.DragDrop.prototype.handler, this);
		this.dragOverEvt.subscribe(SweetDevRia.DragDrop.prototype.handler, this);
		this.dragOutEvt.subscribe(SweetDevRia.DragDrop.prototype.handler, this);
    }
};

extendsClass (SweetDevRia.DragDrop, SweetDevRia.RiaComponent, YAHOO.util.DDProxy);

//SweetDevRia.DragDrop.GROUP_SUFFIXE = 0;
SweetDevRia.DragDrop.VERTICAL_MODE = 1;
SweetDevRia.DragDrop.HORIZONTAL_MODE = 2;
SweetDevRia.DragDrop.ALL_MODE = 3;

SweetDevRia.DragDrop.DUPLICATE_TYPE = 0;
SweetDevRia.DragDrop.CADRE_TYPE = 1;
SweetDevRia.DragDrop.DIRECT_TYPE = 2;
SweetDevRia.DragDrop.DUPLICATE_OPACITY = "0.5";

SweetDevRia.DragDrop.locked = false;


SweetDevRia.DragDrop.prototype.handleEvent = function(evt) {
	if (evt.type == SweetDevRia.RiaEvent.INIT_TYPE) {
    	this.isTarget = false;
        this.init(this.id, this.grpId);


        if (this.type != SweetDevRia.DragDrop.DIRECT_TYPE) {
          this.initFrame();
        }
        else {
          this.setDragElId (this.id);
        }

       this.specificHandler = this.handler;
		
		if (this.documentTarget) {
			this.addDropZone (SweetDevRia.DropZone.DOCUMENT_ID);
		}

	    if (this.mode == SweetDevRia.DragDrop.VERTICAL_MODE) {
		    this.setXConstraint (0, 0);
	    }

	    if (this.mode == SweetDevRia.DragDrop.HORIZONTAL_MODE) {
		    this.setYConstraint (0, 0);
	    }
	    
	}
	return true;
};

SweetDevRia.DragDrop.prototype.init = function(id, sGroup) {
	if (this.id !== null && this.id != "undefined") {
	    this.initTarget(id, sGroup);

	    /** onclick event overrided in order to manage multiselection */
	    if (this.multiSelect) {
	        YAHOO.util.Event.addListener(id, "mousedown",
	                                      this.multiSelectHandleMouseDown, this, true);
	    }
	    else {
	        YAHOO.util.Event.addListener(id, "mousedown",
	                                      this.handleMouseDown, this, true);
	    }
	}
};

SweetDevRia.DragDrop.prototype.setLock  = function(lock) {
	this.locked = lock;
};

SweetDevRia.DragDrop.prototype.b4StartDrag  = function(x, y) {
	if (this.locked){
		return;
	}
	
    var dragEl = this.getDragEl();
    var DOM    = YAHOO.util.Dom;
  	this._previousSize[0] = DOM.getStyle( dragEl, "width");
  	this._previousSize[1] = DOM.getStyle( dragEl, "height");

    if (this.type == SweetDevRia.DragDrop.DUPLICATE_TYPE) {
      var clone = this.getEl().cloneNode (true);
      clone.id = dragEl.id;
      clone.style.position = dragEl.style.position;
      clone.style.zIndex = dragEl.style.zIndex;
      
      dragEl.parentNode.replaceChild (clone, dragEl);
    }


    // show the drag frame
    if (this.type != SweetDevRia.DragDrop.DIRECT_TYPE) {
      this.showFrame(x, y);
    }
};

SweetDevRia.DragDrop.prototype.multiSelectHandleMouseDown  = function(evt) {
	if (this.locked){
		return;
	}
	
	evt = SweetDevRia.EventHelper.getEvent (evt);

	/** If control key activate with left mouse click => selection */
	if (evt.leftButton && evt.ctrlKey) {
		SweetDevRia.MultiSelect.swapSelected (this.id);
	}
	else {
		var selectedObjs = SweetDevRia.MultiSelect.getSelectedObjs ();
		var selected = null;
		/** If this element is not selected, deselect all */
		if ((! SweetDevRia.MultiSelect.isSelected (this.id)) && SweetDevRia.MultiSelect.haveSelected ()) {
			for (var i = 0; i < selectedObjs.length; i++) {
				selected = selectedObjs [i];
				SweetDevRia.MultiSelect.removeSelected (selected.id);
			}
		}
		if (SweetDevRia.MultiSelect.haveSelected ()) {
			var dragEl = this.getDragEl ();

			/** Add dragged elements to dragel */
			for (var j = 0; j < selectedObjs.length; j++) {
				selected = selectedObjs [j];
				var selectedEl = selected.getEl();

				var div = document.createElement ("div");
				div.style.border = dragEl.style.border;
				div.style.width = selectedEl.style.width;
				div.style.height = selectedEl.style.height;
				dragEl.appendChild (div);
			}

			/** Remove drageEl borders */
			SweetDevRia.DomHelper.setStyle (dragEl, "border", "");
		}

		this.handleMouseDown (evt);
	}
};

SweetDevRia.DragDrop.prototype.startDrag  = function(x, y) {
	if (this.locked){	
		return;
	}
	if (SweetDevRia.DragDrop.locked){
		return;
	}
	
	var el = this.getEl ();
	
	var dragEl = this.getDragEl ();

	this.onDropZone = null;

	/** save current zIndex and "to top" */
	var style = this.getDragEl().style;
	this.origZ = style.zIndex;
	style.zIndex = 999;

	this.oldWidth = SweetDevRia.DomHelper.getStyle (this.getEl (), "width");
	this.oldHeight = SweetDevRia.DomHelper.getStyle (this.getEl (), "height");

	if (this.type != SweetDevRia.DragDrop.DUPLICATE_TYPE) {
	  this.oldOpacity = SweetDevRia.DomHelper.getStyle (el, "opacity");
    SweetDevRia.DomHelper.setStyle (el, "opacity", SweetDevRia.DragDrop.DUPLICATE_OPACITY);
	
	SweetDevRia.DragDrop.locked = true;
  }
  
  this.dragStartEvt.fire (x, y);
};

SweetDevRia.DragDrop.prototype.endDrag  = function(e) {
	if (this.locked){
		return;
	}
	
	e = SweetDevRia.EventHelper.getEvent (e);
    var el = this.getEl();
    var dragEl = this.getDragEl();

	/** set old zIndex */
	this.getDragEl().style.zIndex = this.origZ;

	SweetDevRia.DomHelper.setStyle (this.getEl (), "width", this.oldWidth);
	SweetDevRia.DomHelper.setStyle (this.getEl (), "height", this.oldHeight);

	if (this.onDropZone !== null || (this.documentTarget && (this.onDropZone == SweetDevRia.DropZone.DOCUMENT_ID))) {
//	if (this.onDropZone !== null && this.onDropZone !== SweetDevRia.DropZone.DOCUMENT_ID) {
	    // Show the drag frame briefly so we can get its position
	    dragEl.style.visibility = "";

	    // Hide the linked element before the move to get around a Safari
	    // rendering bug.
	    el.style.visibility = "hidden";
	    YAHOO.util.DDM.moveToEl(el, dragEl);
	    dragEl.style.visibility = "hidden";
	    el.style.visibility = "";
	}
	else {
		/*
		 * On ne drop pas sur une zone de drop, donc on ne fait rien
		 */
		
	    dragEl.style.visibility = "hidden";
	}    
		
	/** Deselect all selected items */
	if (SweetDevRia.MultiSelect.haveSelected ()) {
		var selectedObjs = SweetDevRia.MultiSelect.getSelectedObjs ();

	    selectedObjs[0].dragEndEvt.fire (this.onDropZone, e);

		for (var i = 0; i < selectedObjs.length; i++) {
			var selected = selectedObjs [i];

			SweetDevRia.MultiSelect.removeSelected (selected.id);
		}
	}
	else  {
	    this.dragEndEvt.fire (this.onDropZone, e);
	}
	
	/** Remove optional old nodes from dragel */
	if (this.type != SweetDevRia.DragDrop.DIRECT_TYPE) {
	   SweetDevRia.DomHelper.removeChildren (dragEl);
	}
	
	if (this.type != SweetDevRia.DragDrop.DUPLICATE_TYPE) {
    	SweetDevRia.DomHelper.setStyle (el, "opacity", this.oldOpacity);
  	}
	
	SweetDevRia.DragDrop.locked = false;

};

SweetDevRia.DragDrop.prototype.onDragOver  = function(e, id) {
	if (this.locked){
		return;
	}
	
	e = SweetDevRia.EventHelper.getEvent (e);
    this.dragOverEvt.fire (id, e);
};


SweetDevRia.DragDrop.prototype.onDrag  = function(e) {
	if (this.locked){
		return;
	}
};


SweetDevRia.DragDrop.prototype.onDragOut  = function(e, id) {
	if (this.locked){
		return;
	}
	
	var evt = SweetDevRia.EventHelper.getEvent (e);
    this.dragOutEvt.fire (id, evt);
};

SweetDevRia.DragDrop.prototype.onDragEnter  = function(e, id) {	if (this.locked){
		return;
	}	

	var evt = SweetDevRia.EventHelper.getEvent (e);
    this.dragEnterEvt.fire (id, evt);
};

SweetDevRia.DragDrop.prototype.onDragDrop  = function(e, id) {
	if (this.locked){
		return;
	}
	
	var elem = YAHOO.util.DragDropMgr.getDDById (id);

	if (elem && elem.isTarget) {
		this.onDropZone = elem.id;
	}
};

SweetDevRia.DragDrop.prototype.handler  = function(type, args, src) {
	if (this.locked){ 
		return; 
	}
	
	if (SweetDevRia.MultiSelect.haveSelected ()) {
		var selectedObjs = SweetDevRia.MultiSelect.getSelectedObjs ();

		for (var i = 0; i < selectedObjs.length; i++) {
			var selected = selectedObjs [i];

			/** specific handler call */
			if (src.specificHandler) {
				src.specificHandler.apply (selected, [type, args, src]);
			}
		}
	}
	else {
		/** specific handler call */
		if (src.specificHandler) {
			src.specificHandler.apply (this, [type, args, src]);
		}
	}
};


SweetDevRia.DragDrop.prototype.addDragZoneCoord  = function(x, y, width, height) {
	var elPos = YAHOO.util.Region.getRegion (this.getEl());

	var ileft = elPos.left - x;
	var iright = x + width - elPos.right;
   	this.setXConstraint (ileft, iright, 0);

	var iup = elPos.top - y;
	var idown = y + height - elPos.bottom;
    this.setYConstraint (iup, idown, 0);
    
    if (this.mode == SweetDevRia.DragDrop.VERTICAL_MODE) {
	    this.setXConstraint (0, 0);
    }

    if (this.mode == SweetDevRia.DragDrop.HORIZONTAL_MODE) {
	    this.setYConstraint (0, 0);
    }
};

SweetDevRia.DragDrop.prototype.addDragZone  = function(id) {
	var dragZone = SweetDevRia.DomHelper.get (id);
	
	if (dragZone) {
		var r2 = YAHOO.util.Region.getRegion (dragZone);
		this.addDragZoneCoord (r2.left, r2.top, r2.right - r2.left, r2.bottom - r2.top);
	}
};

SweetDevRia.DragDrop.prototype.addDropZone  = function(id) {
	var dropZone = YAHOO.util.DragDropMgr.getDDById (id);

	if (dropZone) {
		dropZone.addToGroup (this.grpId);

		this.dragStartEvt.subscribe(SweetDevRia.DropZone.handler, dropZone);
		this.dragEndEvt.subscribe(SweetDevRia.DropZone.handler, dropZone);
		this.dragEnterEvt.subscribe(SweetDevRia.DropZone.handler, dropZone);
		this.dragOverEvt.subscribe(SweetDevRia.DropZone.handler, dropZone);
		this.dragOutEvt.subscribe(SweetDevRia.DropZone.handler, dropZone);
	}
};


var oldIsOverTarget = YAHOO.util.DDM.isOverTarget;
//Do NOT refractor this or DD fails
YAHOO.util.DDM.isOverTarget = DragDrop_isOverTarget;

function DragDrop_isOverTarget(pt, oTarget, intersect) {

	if (oTarget.id == SweetDevRia.DropZone.DOCUMENT_ID) {
		return true;
	}

	return oldIsOverTarget.call (YAHOO.util.DDM,pt, oTarget, intersect);
}