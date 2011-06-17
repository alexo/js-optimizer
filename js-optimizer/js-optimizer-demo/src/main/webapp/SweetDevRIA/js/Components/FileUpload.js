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
 * @class allowing upload file on server
 * @constructor
 * @param {String} id	The id of the FileUpload
 * @private
 */ 
SweetDevRia.FileUpload = function(id) {
	if (id) {
		superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.FileUpload");
   	}
};

SweetDevRia.FileUpload.LINK = "_link";

extendsClass(SweetDevRia.FileUpload, SweetDevRia.RiaComponent);

/**
 * Public APIs
 *
 */

/**
 * This method is called before starting an upload file
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.FileUpload.prototype.beforeUpload = function(){ return true; };

/**
 * This method is called after having started a file upload
 * To be overridden !!
 */
SweetDevRia.FileUpload.prototype.afterUpload = function(){};


/**
* Return the input element
* @return Return the input element
* @type HTMLElement
* @private
*/
SweetDevRia.FileUpload.prototype.getInputFile = function() {
	return document.getElementById (this.id);
};

/**
* Return the input element content
* @return Return the input element content
* @type String
*/
SweetDevRia.FileUpload.prototype.getInputFileValue = function() {
	return this.getInputFile().value;
};

/**
* Return the text of the fileupload element
* @return Return the text of the fileupload element
* @type HTMLElement
* @private
*/
SweetDevRia.FileUpload.prototype.getInputFileText = function() {
	return document.getElementById (this.id + "_text");
};

/**
* Return the link element
* @return Return the link element
* @type HTMLElement
* @private
*/
SweetDevRia.FileUpload.prototype.getLink = function() {
	return document.getElementById (this.id+SweetDevRia.FileUpload.LINK);
};

/**
* Function uploading a file
* @private
*/
SweetDevRia.FileUpload.prototype.upload = function() {
	if(this.beforeUpload()){
		this.index = null;
	
		var form = this.getInputFile().form;
		if (form) {
			if (SweetDevRia.ComHelper.isJsfPage ()) {
				form.action = window.location.href;
			}
			else {
				form.action = SweetDevRia.ComHelper.PROXY_URL; 
			}
			
			(form.action.indexOf ("?")>0) ? form.action += "&" : form.action += "?";
			form.action += SweetDevRia.ComHelper.ID_PAGE+"="+window [SweetDevRia.ComHelper.ID_PAGE];
			form.submit();
	
			var filename = this.getInputFileValue();
			var stillUploadingText = this.stillUploadingText;
			window.onbeforeunload = function () {
				return stillUploadingText+" "+filename;
			};
		}
		
		this.afterUpload();
	}
};

/**
* Called by the server on upload file complete.
* @param {int} index	the number count of the file uploaded
* @param {String} name	the name of the fileupload
* @private
*/
SweetDevRia.FileUpload.prototype.loaded = function(index, name) {
	
	window.onbeforeunload = null;
	
	this.index = index;
	this.name = name;
	
	// disable input file 
	this.getInputFile ().disabled = true;
	
	// display delete link
	var link = this.getLink();
	if (link) {
		link.style.display = "";
	}
	this.getInputFile ().style.display = "none";
	this.getInputFileText ().style.display = "";
	this.getInputFileText ().value = this.getInputFile ().value;

	this.updateServerModel ("value", this.getInputFile().value.replace(/\\/g,"\\\\\\\\"));
	this.updateServerModel ("index", this.index);
	this.updateServerModel ("name", this.name);
};

/**
* IS the file uploaded or not ?
* @return Return the state of the upload
* @type boolean
*/
SweetDevRia.FileUpload.prototype.isUploaded = function() {
	return 	(this.index != null);
};

/**
* Action triggered on the Delete link. Delete an uploaded file.
*/
SweetDevRia.FileUpload.prototype.deleteFile = function() {
	// hide delete link
	var link = this.getLink();
	if (link) {
		link.style.display = "none";
	}

	// ajax call to delete file in session
	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("deleteFile", this.id, {"sendServer":true, "index":this.index, "name":this.name}));

	// delete input file value
	this.getInputFile ().form.reset();
	this.getInputFile ().disabled = false;
	this.getInputFile ().style.display = "";
	this.getInputFileText().value = "";
	this.getInputFileText().style.display = "none";
	this.index = null;
	this.name = null;
};



/*
function SweetDevRia.FileUpload.prototype.cacheLoaded () {
	// disable input file 
	this.getInputFile ().disabled = true;
	this.getInputFile ().style.display = "none";
	this.getInputFileText().style.display = "";
	// display delete link
	var link = this.getLink();
	if (link) {
		link.style.display = "";
	}
	this.uploaded = true;
}
*/