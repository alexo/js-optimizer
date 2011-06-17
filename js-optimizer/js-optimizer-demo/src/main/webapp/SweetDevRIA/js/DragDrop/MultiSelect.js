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
 * @class Multiselection management class
 * @private
 * @constructor
 */
SweetDevRia.MultiSelect = function() {
	null;
};

SweetDevRia.MultiSelect.selectedObjects = [];

/**
 * Get selected object list
 * @return selected object list
 * @type Array
 */
SweetDevRia.MultiSelect.getSelectedObjs = function() {
	var selectedObjs = SweetDevRia.MultiSelect.selectedObjects;
	if (selectedObjs) {
		return selectedObjs;
	}	
	else {
		return [];
	}
};

/**
 * Check if an object is selected
 * @param {String} Object id to check
 * @return true if object is selected, else false.
 * @type boolean
 */
SweetDevRia.MultiSelect.isSelected = function(id) {
	var selectedObjs = SweetDevRia.MultiSelect.selectedObjects;
	if (selectedObjs) {
		for (var i = 0; i < selectedObjs.length; i++) {
			if (selectedObjs [i].id == id) {
				return true;
			}
		}
	}	
	
	return false;
};


/**
 * Check if objects are selected
 * @return true if objects are selected, else false.
 * @type boolean
 */
SweetDevRia.MultiSelect.haveSelected = function() {
	var selectedObjs = SweetDevRia.MultiSelect.selectedObjects;
	if (selectedObjs) {
		return (selectedObjs.length > 0);
	}	
	
	return false;
};

/**
 * Add a selected object
 * @param {String} id Object id to select
 */
SweetDevRia.MultiSelect.addSelected = function(id) {
	var selectedObjs = SweetDevRia.MultiSelect.selectedObjects;
	if (selectedObjs === null) {
		SweetDevRia.MultiSelect.selectedObjects = [];
		selectedObjs = SweetDevRia.MultiSelect.selectedObjects;
	}
	
	var selectedObj = YAHOO.util.DragDropMgr.getDDById (id);
	
	SweetDevRia.DomHelper.setStyle (selectedObj.getEl(), "border", "1px solid");
	SweetDevRia.DomHelper.setStyle (selectedObj.getEl(), "borderColor", "blue");
	
	selectedObjs [selectedObjs.length] = selectedObj;
};

/**
 * Remove a selected object
 * @param {String} id Object id to remove
 */
SweetDevRia.MultiSelect.removeSelected = function(id) {
	var selectedObjs = SweetDevRia.MultiSelect.selectedObjects;

	if (selectedObjs) {
		var res = [];
		for (var i = 0; i < selectedObjs.length; i++) {
			var selectedObj = selectedObjs [i];
			if (selectedObj.id != id) {
				res [res.length] = selectedObj;
			}
			else {
				SweetDevRia.DomHelper.setStyle (selectedObj.getEl(), "border", "0px solid");
				SweetDevRia.DomHelper.setStyle (selectedObj.getEl(), "borderColor", "black");
			}
		}
		
		SweetDevRia.MultiSelect.selectedObjects = res;
	}	
};

/**
 * Inverse selection
 * @param {String} id Object id to inverse selection
 */
SweetDevRia.MultiSelect.swapSelected = function(id) {
	if (SweetDevRia.MultiSelect.isSelected (id)) {
		SweetDevRia.MultiSelect.removeSelected (id);
	}
	else {
		SweetDevRia.MultiSelect.addSelected (id);
	}
};