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
 * @class WindowDocking
 * @constructor
 * @param {String} id 	Identifier of the windowDocking
 */ 
SweetDevRia.WindowDocking = function (id){
	this.columns = [];
	this.spliters = [];

	this.windowIds = [];
	superClass (this, SweetDevRia.RiaComponent, id, SweetDevRia.Window.prototype.className);
};

extendsClass(SweetDevRia.WindowDocking, SweetDevRia.RiaComponent);

/**
 * Name of the class
 * @type String
 */
SweetDevRia.WindowDocking.prototype.className = "SweetDevRia.WindowDocking";


/**
 * Do all the things that must be done at startup
 */
SweetDevRia.WindowDocking.prototype.init = function(){
	for (var i = 0; i < this.columns.length; i++) {
		var colName = this.columns [i];
		new YAHOO.util.DragDrop(colName,"paneldrag");
	}

	for (var j = 0; j < this.windowIds.length; j++) {
		var windowId = this.windowIds [j];
		var win = SweetDevRia.getComponent (windowId);
		if (win) {
			win.docking = this;			
			win.dock ();
		}		
	}
};

/**
* Add a window to the component
* @param {String} windowId 	The id of the window
*/
SweetDevRia.WindowDocking.prototype.addWindow = function(windowId){
	this.windowIds.push (windowId);
};

/**
* Add a column to the component
* @param {String} colId		The id of the column
*/
SweetDevRia.WindowDocking.prototype.addColumn = function(colId){
	this.columns.push (colId);
};

/**
* Add a spliter to the component
* @param {String} spliterId 	The id of the spliter
*/
SweetDevRia.WindowDocking.prototype.addSpliter = function(spliterId){
	this.spliters.push (spliterId);
};
