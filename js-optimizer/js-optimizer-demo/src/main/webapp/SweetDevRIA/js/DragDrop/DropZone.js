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
 * @extends YAHOO.util.DDTarget
 * @constructor
 * @param {String} id the id of the linked html element
 * @param {String} sGroup the group of related DragDrop objects
 */
SweetDevRia.DropZone = function(id, grpId, handler) {
    if (id) {
		superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.DropZone");
		superClass (this, YAHOO.util.DDTarget, id, grpId);
    	
        this.specificHandler = handler;
    }
};

extendsClass (SweetDevRia.DropZone, SweetDevRia.RiaComponent, YAHOO.util.DDTarget);

SweetDevRia.DropZone.DROP_SELECTED_BORDER_COLOR = "red";
SweetDevRia.DropZone.DROP_BORDER_COLOR = "yellow";
SweetDevRia.DropZone.DOCUMENT_ID = "#document";

SweetDevRia.DropZone.prototype.handler = function(evt) {
	if (evt.type == SweetDevRia.RiaEvent.INIT_TYPE) {
        this.isTarget = true;
        this.init(this.id, "defaultGroup");
	}
	
	return true;
};

SweetDevRia.DropZone.handler = function(type, args, src) {
	var elem = src.getEl ();

	if (! elem) {
		return;
	}

	if (type == "dragStart") {
		this.oldBoderColor = SweetDevRia.DomHelper.getStyle (elem, "borderColor");
		SweetDevRia.DomHelper.setStyle (elem, "borderColor", SweetDevRia.DropZone.DROP_BORDER_COLOR);
	}
	else if (type == "dragEnd") {
		SweetDevRia.DomHelper.setStyle (elem, "borderColor", "black");
/*
		if (this.oldBoderColor) {
			SweetDevRia.DomHelper.setStyle (elem, "borderColor", this.oldBoderColor);
			this.oldBoderColor = null;
		}
*/
	}
	else if (type == "dragEnter") {
		if (src.id == args [0]){
			SweetDevRia.DomHelper.setStyle (elem, "borderColor", SweetDevRia.DropZone.DROP_SELECTED_BORDER_COLOR);
		}
	}
	else if (type == "dragOut") {
		if (src.id == args [0]) {
			SweetDevRia.DomHelper.setStyle (elem, "borderColor", SweetDevRia.DropZone.DROP_BORDER_COLOR);
		}
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

//new SweetDevRia.DropZone (SweetDevRia.DropZone.DOCUMENT_ID);
