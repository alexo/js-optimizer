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
* This is the PageBar component class 
* @param {String} id Id of this PageBar
* @constructor
* @extends RiaComponent
* @base RiaComponent
*/
SweetDevRia.PageBar = function (id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.PageBar");
	
	// Total page number
	this.pageNumber = null;
	// only used by template
	this.visiblePageNumberArray =  [];
	
	// if true, < and > symbols that allows go to previous and next pages are displayed
	this.showPreviousNext = true;

	// if true, << and >> symbols that allows go to first and last pages are displayed
	this.showFirstLast = true;
		
	// indicate how many page number will be displayed. Defauilt is 7;
	this.visiblePageNumber = 9;
		
	// actual page number
	this.actualPage = null;
	
	// Associated component identifiant. The page bar will call the goToPage method of this sweetdevria component.
	this.linkedId = null;

};

extendsClass (SweetDevRia.PageBar, SweetDevRia.RiaComponent);

/**
 * This method is called before Set the total page number
 * To be overridden !!
 * @param {int} pageNumber total page number of this page bar
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.PageBar.prototype.beforeSetPageNumber  = function(pageNumber){  /* override this */ return true;  };

/**
 * This method is called after Set the total page number
 * To be overridden !!
 * @param {int} pageNumber total page number of this page bar
 */
SweetDevRia.PageBar.prototype.afterSetPageNumber = function(pageNumber){  /* override this */ };

/**
 * This method is called before Set the selected page number
 * To be overridden !!
 * @param {int} the new selected page number
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.PageBar.prototype.beforeSetActualPage  = function(actualPage){  /* override this */ return true;  };

/**
 * This method is called after Set the selected page number
 * To be overridden !!
 * @param {int} the new selected page number
 */
SweetDevRia.PageBar.prototype.afterSetActualPage = function(actualPage){  /* override this */ };

/**
 * This method is called before Change the page
 * To be overridden !!
 * @param {int} pageNumber The new selected page number
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.PageBar.prototype.beforeGoToPage  = function(pageNumber){  /* override this */ return true;  };

/**
 * This method is called after Change the page
 * To be overridden !!
 * @param {int} pageNumber The new selected page number
 */
SweetDevRia.PageBar.prototype.afterGoToPage = function(pageNumber){  /* override this */ };


/**
 * Set the total page number
 * @param {int} pageNumber total page number of this page bar
 */
SweetDevRia.PageBar.prototype.setPageNumber =  function (pageNumber) {
	if(this.beforeSetPageNumber(pageNumber)){
		this.pageNumber = pageNumber;
		
		this.afterSetPageNumber(pageNumber);
	}
};

/**
 * Set the associated component identifiant. The page bar will call the goToPage method of this sweetdevria component.
 * @param {String} linkedId  Associated component identifiant
 */
SweetDevRia.PageBar.prototype.setLinkedId =  function (linkedId) {
	this.linkedId = linkedId;
};

/**
 * Set the selected page number
 * @param {int} the new selected page number
 */
SweetDevRia.PageBar.prototype.setActualPage =  function (actualPage) {
	if(this.beforeSetActualPage(actualPage)){
		this.actualPage = actualPage;
	
		// only used by template
		this.visiblePageNumberArray =  [];
		
		var beforeAfterVisible = Math.ceil ((this.visiblePageNumber - 1) / 2);
		
		var start = this.actualPage - beforeAfterVisible ;
		if ((this.actualPage + beforeAfterVisible) > this.pageNumber) {
			start = this.pageNumber - this.visiblePageNumber + 1;
		}
		if (start <= 0) {
			start = 1;
		}
		
		var end = start + this.visiblePageNumber - 1;
		if (end > this.pageNumber) {
			end = this.pageNumber;
		}
	
		for (var i = start; i <= end; i++) {
			this.visiblePageNumberArray.add (i);
		}
		
		this.afterSetActualPage(actualPage);
	}
};

/**
 * Change the page
 * @param {int} pageNumber The new selected page number
 */
SweetDevRia.PageBar.prototype.goToPage =  function (pageNumber) {
	if(this.beforeGoToPage(pageNumber)){
		if (pageNumber >= 1 && pageNumber <= this.pageNumber) {
			this.setActualPage (pageNumber);
			
			// Call the goToPage method of the linked component
			if (this.linkedId) {
				var linkedComp = SweetDevRia.$ (this.linkedId);
				if (linkedComp && linkedComp.goToPage) {
					linkedComp.goToPage (pageNumber);
				}
			}
			
			this.render ();
		}
		this.afterGoToPage(pageNumber);
	}
};


/**
 * Allow to format the text for a page number. For example : "50..99" for page 2. 
 * @param {int} pageNumber The page number to format
 */
SweetDevRia.PageBar.prototype.formatPageNumber =  function (pageNumber) {
	return pageNumber;
};

/**
 * Go to the first page
 */
SweetDevRia.PageBar.prototype.goToFirstPage =  function () {
	this.goToPage (1);
};

/**
 * Go to the last page
 */
SweetDevRia.PageBar.prototype.goToLastPage =  function () {
	this.goToPage (this.pageNumber);
};

/**
 * Go to the previous page
 */
SweetDevRia.PageBar.prototype.goToPreviousPage =  function () {
	this.goToPage (this.actualPage - 1);
};

/**
 * Go to the next page
 */
SweetDevRia.PageBar.prototype.goToNextPage =  function () {
	this.goToPage (this.actualPage + 1);
};


SweetDevRia.PageBar.prototype.template = 
"\
	{if actualPage > 1}\
		{if showFirstLast == true}<a onclick=\"SweetDevRia.$('${id}').goToFirstPage();return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\"> &nbsp;<<&nbsp; </a>{/if}\
		{if showPreviousNext == true}<a onclick=\"SweetDevRia.$('${id}').goToPreviousPage();return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\"> &nbsp;<&nbsp; </a>{/if}\
	{/if}\
	{for num in visiblePageNumberArray}\
		<a onclick=\"SweetDevRia.$('${id}').goToPage(${num});return false;\" href=\"#\" class=\"{if num == actualPage}ideo-pgb-actualPageNumber{else}ideo-pgb-pageNumber{/if}\"> &nbsp;${formatPageNumber(num)}&nbsp;</a>\
 	{/for}\
	{if actualPage < pageNumber}\
		{if showPreviousNext == true}<a onclick=\"SweetDevRia.$('${id}').goToNextPage();return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\"> &nbsp;>&nbsp; </a>{/if}\
		{if showFirstLast == true}<a onclick=\"SweetDevRia.$('${id}').goToLastPage();return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\"> &nbsp;>>&nbsp; </a>{/if}\
	{/if}\
";

