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

SweetDevRia.ActiveManager = function(id) {
	this.id = id;
	this.activeComponents = [];
};

SweetDevRia.ActiveManager.ACTIVE_MANAGER_ID = "__SweetDEV_RIA_ActiveManager";

SweetDevRia.ActiveManager._instance = new SweetDevRia.ActiveManager (SweetDevRia.ActiveManager.ACTIVE_MANAGER_ID);
SweetDevRia.ActiveManager.getInstance = function () {
	return SweetDevRia.ActiveManager._instance;
};

/*
ActiveManager.setActiveComponent = ActiveManager_setActiveComponent; 
ActiveManager.getActiveComponent = ActiveManager_getActiveComponent; 
ActiveManager.removeActiveComponent = ActiveManager_removeActiveComponent; 
ActiveManager.removeComponent = ActiveManager_removeComponent; 
*/
SweetDevRia.ActiveManager.setActiveComponent = function(component) {
  var activeManager = SweetDevRia.ActiveManager.getInstance ();

  activeManager.activeComponents [activeManager.activeComponents.length] = component;
};

SweetDevRia.ActiveManager.getActiveComponent = function() {
  var activeManager = SweetDevRia.ActiveManager.getInstance ();

  return activeManager.activeComponents [activeManager.activeComponents.length - 1];
};

SweetDevRia.ActiveManager.removeActiveComponent = function() {
  var activeManager = SweetDevRia.ActiveManager.getInstance ();
  activeManager.activeComponents = activeManager.activeComponents.slice (0, activeManager.activeComponents.length - 1);
};
 
SweetDevRia.ActiveManager.removeComponent = function(component) {
  var activeManager = SweetDevRia.ActiveManager.getInstance ();
  var activeComponents = [];
  
  for (var i = 0; i < activeManager.activeComponents.length; i++) {
    if (activeManager.activeComponents [i].id != component.id){
      activeComponents [activeComponents.length] = activeManager.activeComponents [i];
    }
  }
  
  activeManager.activeComponents = activeComponents;
};
