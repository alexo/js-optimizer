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
 * Process the export excel by calling the associated action, on server side
 * @param {String} exportId the exportId on the server that will be requested
 * @param {int} exportMode Define if we export in wysiwyg mode or model mode. Possible values are SweetDevRia.Grid.WYSIWYG_EXPORT and SweetDevRia.Grid.MODEL_EXPORT
 * @param {Array} exportdRowIds Array containing all exported row ids. If null, all rows will be exported.
 * @static
 * @private
 */
SweetDevRia_exportExcel = function(exportId, exportMode, exportRowIds){
		var params = {"exportMode" : exportMode, "exportId" : exportId};
		if(exportRowIds != null && exportRowIds.length > 0){
			params ["exportRowIds"] = exportRowIds.join();
		}
		SweetDevRia_callAction (exportId, "com.ideo.sweetdevria.taglib.grid.export.action.GridExportAction", params);
};

/**
 * Call an action on the server. This action implements com.ideo.sweetdevria.servlet.IAction
 * @param {String} id the id the action is related to
 * @param {String} action the name of the action
 * @param {Map} params a map of parameters
 * @static
 * @private
 */
SweetDevRia_callAction = function(id, action, params){
		function addInput(theForm, id, value) {
			var input = document.createElement ("input");
			input.id = id;
			input.name = id;
			input.type = "hidden";
			input.value= value;
			theForm.appendChild (input);
			
			return input;
		}
	
		var form = document.createElement ("form");
		form.action = SweetDevRia.ComHelper.PROXY_URL;
		form.target="_self";
		form.method="post";
	
		addInput (form, "action", action);
		for (var paramId in params ) {
			addInput (form, paramId, params[paramId]);
		}
		addInput (form, SweetDevRia.ComHelper.ID_PAGE, __RiaPageId);//propagate the page id to retrieve the model in session
		
		document.body.appendChild (form);
		form.submit();
		document.body.removeChild(form);	
};


/**
 * Download a resource as a file, without evaluating it.
 * Used on SweetDevRia only be the uploaded files grabber.
 * @param {String} path the full path of the resource, including the resource Name
 * @param {String} name the name of the client resource, after downloading
 * @param {String} contentType the contentType of the file
 * @static
 */
SweetDevRia_downloadResource = function(path, name, contentType){
		SweetDevRia_callAction (null, "com.ideo.sweetdevria.taglib.fileUpload.action.FileuploadAction", {"path":encodeURI(path), "name":name,"contentType":contentType});
};

