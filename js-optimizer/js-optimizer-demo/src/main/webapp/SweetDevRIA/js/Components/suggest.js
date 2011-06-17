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
 
/********************************************************************************************************************************************
 * 									Suggest
********************************************************************************************************************************************/

/**
* This is the Suggest component class 
* @param {String} id Id of this table
* @param {String} preselectedValue The initial value of the input field
* @param {int} itemPerPage The number of item to display per suggestion page.
* @param {int} triggerLength The number of characters required before evaluating the field.
* @param {int} filterMode The mode of filter of the suggest.
* @param {int} bufferSize The size of the client buffer.
* @param {boolean} multiSelect The selection behavior of the suggest.
* @param {boolean} multiField The selections renders in HTML, in multiSelect mode enabled.
* @param {boolean} caseSensitive The case state of the suggest.
* @param {boolean} stackSelection The selection persistence state of the suggest 
* @param {boolean} forceSelection The type of selection of the suggest, in singleSelection only.
* @param {boolean} paginable The paginable state of the suggest.
* @constructor
* @extends RiaComponent
* @base RiaComponent
*/
SweetDevRia.Suggest = function (id,
								preselectedValue,
								itemPerPage,  
								triggerLength,
								filterMode,
								bufferSize,
								multiSelect, 
								multiField, 								
								caseSensitive, 
								stackSelection,
								forceSelection, 
								paginable) {
	if(id){
		superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Suggest");
	
		this.preselectedValue = preselectedValue; 
		
		this.itemPerPage = itemPerPage;
		this.triggerLength = triggerLength;
		this.filterMode = filterMode;
		this.bufferSize = bufferSize;
		
		this.multiSelect = multiSelect;
		this.multiField = multiField;
		this.caseSensitive = caseSensitive;
		this.stackSelection = stackSelection;
		this.forceSelection = forceSelection;
		this.paginable = paginable;
		
		
		this.data = null; //data loaded at present :{items, truncated, map, inputValue, pageNumber, totalItemNumber}

		/* buffer manager */		
		this.buffer = new SweetDevRia.SuggestBuffer(this, bufferSize);
		/* manager */
		this.viewManager = new SweetDevRia.SuggestItemViewManager();		
		
		/* local vars */
		// define the highlightened item
		this.highlightenedItem;
		// store the id selected
		this.selectedItemsIds = [];
		// store the models selected, with their ids as a key
		this.selectedItemsModels = {};
		// associate each id selected with an input field, in multiselect+multifield mode
		this.selectedIdsInputAssociation = [];
		
		// boolean used not to spam the server : 1 by 1 Ajax request 
		this.isRetrievingValue = false;
		// current view
		this.viewMode = SweetDevRia.Suggest.SUGGEST_MODE;
		
		/* button manager */
		this.buttonState = new Array();
		this.buttonState.push("ideo-sug-buttonOut");
		
		//page bar
		if(paginable){
			this.createPageBar();
		}
	}
};

SweetDevRia.Suggest.prototype = new SweetDevRia.RiaComponent;

/**
 * Constants
 */

/**
 * This constant indicates that the search for a pattern will be process from the values begin.
 * @type int
 */
SweetDevRia.Suggest.STARTSWITH = 0;

/**
 * This constant indicates that the search for a pattern will be process from anywhere in the values.
 * @type int
 */
SweetDevRia.Suggest.CONTAINS = 1;

/**
 * This constant indicates that the search for a pattern will be process from the values end.
 * @type int
 */
SweetDevRia.Suggest.ENDSWITH = 2;

/**
 * This constant indicates that the filtering of values will be process from regexp expressions.
 * @type int
 */
SweetDevRia.Suggest.REGEXP = 3;

/**
 * This constant indicates that the filtering of values will be process from simple regexp expressions, managing only * and ?.
 * @type int
 */
SweetDevRia.Suggest.SIMPLE_REGEXP = 4;

/**
 * This constant indicates that the filtering of values will be process from a custom matcher.
 * @type int
 */
SweetDevRia.Suggest.CUSTOM = 5;


/**
 * This constant indicates the view mode Suggestion, displaying the suggested items
 * @type int
 */
SweetDevRia.Suggest.SUGGEST_MODE = 0;

/**
 * This constant indicates the view mode Selection, displaying the selected items
 * @type int
 */
SweetDevRia.Suggest.SELECTION_MODE = 1;

/**
 * This constant indicates the way to concatenate the values selected in multiSelect mode + singleField mode.
 * @type String
 */
SweetDevRia.Suggest.SEPARATOR = ";";

/**
 * This constant indicates the number of page to display in the pageBar.
 * @type int
 */
SweetDevRia.Suggest.PAGEBAR_NUMBER = 3;


/* 
 *
 * Public APIS
 *
 */

/**
 * This method is called before restoring the input value
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeRestoreInputValue = function(){
	return true;
};

/**
 * This method is called after restoring the input value
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterRestoreInputValue = function(){
};

/**
 * This method is called before updating the selection on blur
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeUpdateSelectionOnBlur = function(){
	return true;
};

/**
 * This method is called after updating the selection on blur
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterUpdateSelectionOnBlur = function(){
};

/**
 * This method is called before updating the input render
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeUpdateInputRender = function(){
	return true;
};

/**
 * This method is called after updating the input render
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterUpdateInputRender = function(){
};

/**
 * This method is called before cleaning the HTML render of the items
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeClearHTMLItems = function(){
	return true;
};

/**
 * This method is called after cleaning the HTML render of the items
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterClearHTMLItems = function(){
};

/**
 * This method is called before highlightning an item
 * To be overridden !!
 * @param {SuggestItem} item the item to highlight
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeHighlightItem = function(item){
	return true;
};

/**
 * This method is called after cleaning the HTML render of the items
 * To be overridden !!
 * @param {SuggestItem} item the item to highlight
 */
SweetDevRia.Suggest.prototype.afterHighlightItem = function(item){
};

/**
 * This method is called before unhighlightning an item
 * To be overridden !!
 * @param {SuggestItem} item the item to unhighlight
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeUnhighlightItem = function(item){
	return true;
};

/**
 * This method is called after cleaning the HTML render of the items
 * To be overridden !!
 * @param {SuggestItem} item the item to unhighlight
 */
SweetDevRia.Suggest.prototype.afterUnhighlightItem = function(item){
};

/**
 * This method is called before unhighlightning an item
 * To be overridden !!
 * @param {SuggestItem} item the item to unhighlight
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeUnhighlightItem = function(item){
	return true;
};

/**
 * This method is called after cleaning the HTML render of the items
 * To be overridden !!
 * @param {SuggestItem} item the item to unhighlight
 */
SweetDevRia.Suggest.prototype.afterUnhighlightItem = function(item){
};


/**
 * This method is called before drawing the selected values
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeDrawSelectedValues = function(){
	return true;
};

/**
 * This method is called after drawing the selected values
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterDrawSelectedValues = function(){
};



/**
 * This method is called before drawing the popup header
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeDrawHeader = function(){
	return true;
};

/**
 * This method is called after drawing the popup header
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterDrawHeader = function(){
};

/**
 * This method is called before drawing the popup footer
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeDrawFooter = function(){
	return true;
};

/**
 * This method is called after drawing the popup footer
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterDrawFooter = function(){
};


/**
 * This method is called before showing the suggest popup
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeShowSuggestPopup = function(){
	return true;
};

/**
 * This method is called after showing the suggest popup
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterShowSuggestPopup = function(){
};

/**
 * This method is called before hiding the suggest popup
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeHideSuggestPopup = function(){
	return true;
};

/**
 * This method is called after hiding the suggest popup
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterHideSuggestPopup = function(){
};

/**
 * This method is called before processing the user action switching the view mode
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeOnSwitchViewModeAction = function(){
	return true;
};

/**
 * This method is called after processing the user action switching the view mode
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterOnSwitchViewModeAction = function(){
};

/**
 * This method is called before switching the view mode
 * To be overridden !!
 * @param {int} viewMode the mode to switch to
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeSwitchViewMode = function(viewMode){
	return true;
};

/**
 * This method is called after switching the view mode
 * To be overridden !!
 * @param {int} viewMode the mode to switch to
 */
SweetDevRia.Suggest.prototype.afterSwitchViewMode = function(viewMode){
};

/**
 * This method is called before switching the popup visibility
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeSwitchSuggestPopupVisibility = function(){
	return true;
};

/**
 * This method is called after switching the popup visibility
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterSwitchSuggestPopupVisibility = function(){
};

/**
 * This method is called before processing the input value
 * To be overridden !!
 * @param {String} newInputValue The input value to process
 * @param {int} pageNumber the number of the page to process. Default is set to 1.
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeProcessInputValue = function(newInputValue, pageNumber){
	return true;
};

/**
 * This method is called after processing the input value
 * @param {String} newInputValue The input value to process
 * @param {int} pageNumber the number of the page to process. Default is set to 1.
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterProcessInputValue = function(newInputValue, pageNumber){
};


/**
 * This method is called before updating the selection
 * To be overridden !!
 * @param {String} newInputValue The new input value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeUpdateSelection = function(newInputValue){
	return true;
};

/**
 * This method is called after updating the selection
 * To be overridden !!
 * @param {String} newInputValue The new input value
 */
SweetDevRia.Suggest.prototype.afterUpdateSelection = function(newInputValue){
};


/**
 * This method is called before analyzing a key stroked on the input field
 * To be overridden !!
 * @param {Event} evt HTML event
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeOnInputKeyStroke = function(evt){
	return true;
};

/**
 * This method is called after analyzing a key stroked on the input field
 * To be overridden !!
 * @param {Event} evt HTML event
 */
SweetDevRia.Suggest.prototype.afterOnInputKeyStroke = function(evt){
};


/**
 * This method is called before analyzing a key stroked on an item
 * To be overridden !!
 * @param {Event} evt HTML event
 * @param {SuggestItem} item the item where the event was triggered
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeOnItemKeyStroke = function(evt, item){
	return true;
};

/**
 * This method is called after analyzing a key stroked on an item
 * To be overridden !!
 * @param {Event} evt HTML event
 * @param {SuggestItem} item the item where the event was triggered
 */
SweetDevRia.Suggest.prototype.afterOnItemKeyStroke = function(evt, item){
};

/**
 * This method is called before treating an item selection switch
 * To be overridden !!
 * @param {SuggestItem} item the item to switch
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeOnSwitchItemSelectionAction = function(item){
	return true;
};

/**
 * This method is called after treating an item selection switch
 * To be overridden !!
 * @param {SuggestItem} item the item to switch
 */
SweetDevRia.Suggest.prototype.afterOnSwitchItemSelectionAction = function(item){
};

/**
 * This method is called before updating the HTML render of an item class
 * To be overridden !!
 * @param {SuggestItem} item the item to update the class
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeUpdateClass = function(item){
	return true;
};

/**
 * This method is called after updating the HTML render of an item class
 * To be overridden !!
 * @param {SuggestItem} item the item to update the class
 */
SweetDevRia.Suggest.prototype.afterUpdateClass = function(item){
};

/**
 * This method is called before sending the request to get values from server
 * To be overridden !!
 * @param {String} value the value we are requesting
 * @param {int} pageNumber the page number to get. 1 if no specified.
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeRetrieveValues = function(value, pageNumber){
	return true;
};

/**
 * This method is called after sending the request to get values from server
 * To be overridden !!
 * @param {String} value the value we are requesting
 * @param {int} pageNumber the page number to get. 1 if no specified.
 */
SweetDevRia.Suggest.prototype.afterRetrieveValues = function(value, pageNumber){
};

/**
 * This method is called before processing the response with the values from server
 * To be overridden !!
 * @param {Map} evt the event which contains the data //TODO
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeOnRetrieveValues = function(evt){
	return true;
};

/**
 * This method is called after processing the response with the values from server
 * To be overridden !!
 * @param {Map} evt the event which contains the data //TODO
 */
SweetDevRia.Suggest.prototype.afterOnRetrieveValues = function(evt){
};


/**
 * This method is called before rendering the button
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Suggest.prototype.beforeRenderButton = function(){
	return true;
};

/**
 * This method is called after rendering the button
 * To be overridden !!
 */
SweetDevRia.Suggest.prototype.afterRenderButton = function(){
};

/**
 * Return the html code for the suggest popup header. None by default.
 * To be overiden !!
 * @return The html code for the suggest popup header
 * @type String
 */
SweetDevRia.Suggest.prototype.getHeaderHtmlCode = function () {
	return null;
};

/**
 * This method is used to render a SuggestItem in the HTML suggestion/selection list in the suggestion popup.
 * Return an HTML formatted text according to the item given in parameter
 * To be overiden for a rich display !!
 * @param {SuggestItem} item The item to render.
 * @return the html view of the SuggestItem
 * @type String
 */
SweetDevRia.Suggest.prototype.getItemHtmlCode = function (item) {
	return item.value;
};


/**
 * Return the html code for the suggest popup footer. A close button by default.
 * To be overiden !!
 * @return The html code for the suggest popup footer
 * @type String
 */
SweetDevRia.Suggest.prototype.getFooterHtmlCode = function () {
	return "<input type=\"button\" onclick=\"SweetDevRia.$('"+this.id+"').hideSuggestPopup();\" value=\""+this.i18n.close+"\"/>";
};


/**
 * This method return the link to display to permit the switch of the view mode, suggestions <-> selections
 * Combine it with getViewMode to know what is currently displayed.
 * @see getViewMode 
 * @throw CurrentViewModeException if the current view mode is unavailable 
 * @return The HTML code to set into the header to allow that switch. Default is an HTML link.
 * @type String
 */
SweetDevRia.Suggest.prototype.getHeaderSelectionLink = function(){
	var linkLabel = "";
	switch(this.getViewMode()){
		case SweetDevRia.Suggest.SUGGEST_MODE :
			linkLabel = this.i18n.showSelectionButton;
		break;
		
		case SweetDevRia.Suggest.SELECTION_MODE :
			linkLabel = this.i18n.showSuggestionButton;
		break;
		
		default: throw("CurrentViewModeException : the viewMode :" + this.getViewMode()+" is not available.");
	}
	return "<br/><a onclick=\"SweetDevRia.$('"+this.id+"').onSwitchViewModeAction();return false;\" href=\"#\"/>"+linkLabel+"</a>";
};


/**
 * Return the text to insert in the input when multiple values are selected.
 * The number of items by default.
 * To be overridden !!
 * @return The text to insert in the input when multiple values are selected.
 * @type String
 */
SweetDevRia.Suggest.prototype.getMultiSelectInputRender = function () {
	return this.getSelectedItemsNumber()+" items selected";
};

/**
 * Return the text to insert in the input when a single value is selected.
 * The selected item value by default
 * To be overridden !!
 * @return The text to insert in the input when a single value is selected.
 * @type String
 */
SweetDevRia.Suggest.prototype.getSingleSelectInputRender = function () {
	return this.getSingleSelectedItem().value;
};

/************************** PAGE BAR *****************************/

/**
 * Create the pageBar for the suggest 
 * @private
 */
SweetDevRia.Suggest.prototype.createPageBar = function(){
	this.pageBar = new SweetDevRia.PageBar (this.id+"_pageBar");	
	this.pageBar.visiblePageNumber = SweetDevRia.Suggest.PAGEBAR_NUMBER;

//	this.pageBar.setPageNumber (0);
//	this.pageBar.setActualPage (1);
//	this.pageBar.setLinkedId (this.id);
};

/**
 * Return the pageBar container id for this suggest
 * @type String
 * @private
 */
SweetDevRia.Suggest.prototype.getPageBarId = function(){
	return this.pageBar.id+"_container";
};

/**
 * Show the pageBar
 * @param {int} actualPage The page to display
 * @param {int} totalPageNumber The total number of pages
 * @private
 */
SweetDevRia.Suggest.prototype.showPageBar = function(actualPage, totalPageNumber){
	this.pageBar.setPageNumber (totalPageNumber);
	this.pageBar.setActualPage (actualPage);
	this.pageBar.setLinkedId (this.id);	
	this.pageBar.render();
	
	SweetDevRia.DomHelper.show( this.getPageBarId() );
};

/**
 * Hide the pageBar
 * @private
 */
SweetDevRia.Suggest.prototype.hidePageBar = function(){
	SweetDevRia.DomHelper.hide( this.getPageBarId() );
};

/**
 * Load a page.
 * @see pageBar.goToPage(pageNumber);
 * @param {int} pageNumber The number of the page to load
 * @private
 */
SweetDevRia.Suggest.prototype.goToPage = function(pageNumber){
	this.processInputValue(this.data.inputValue, pageNumber);
};



/***************** INPUT RENDERING *********************/

/**
 * Restore the input search value, on refocusing
 * This mean that in multiSelect mode, the input field switch to the previous searched value
 */
SweetDevRia.Suggest.prototype.restoreInputValue = function(){

	if(this.beforeRestoreInputValue()){
		if(!this.multiSelect && this.getSelectedItemsNumber()==1){
			this.updateInputRender();
		}else{
			if(!this.data){
				return;
			}else{
				this.getInput().value = this.data.inputValue;
			}
		}
		this.afterRestoreInputValue();
	}
	
};

/**
 * Updates the selection on input blur
 * This mean that in singleSelect mode, if the forceSelection is disabled, the selection switch to the user's value entered in the input.
 */
SweetDevRia.Suggest.prototype.updateSelectionOnBlur = function(){

	if(this.beforeUpdateSelectionOnBlur()){
	
		if(!this.multiSelect && !this.forceSelection){//set the value to the selection
			var val = this.getInputValue();
			if(this.getSelectedItemsNumber()!=0){
				var itemSelected = this.getSingleSelectedItem();
				if(itemSelected.value != val){//if the selection was not already set
					this.switchItemSelection({"value":val, "id":val, "information":null}, true); 
				}			
			}else{//just add
				this.switchItemSelection({"value":val, "id":val, "information":null}, true);
			}
		}
		this.updateInputRender();
		
		this.afterUpdateSelectionOnBlur();
	}
};

 /**
 * This method updates the input render depending of the current selection
 */
SweetDevRia.Suggest.prototype.updateInputRender = function () {
	if(this.beforeUpdateInputRender()){
	
		var input = this.getInput (); 
		
		//the user has not selected anything, clear the input field !
		if(!this.multiSelect){
			if(this.getSelectedItemsNumber() != 0){
				input.value = this.getSingleSelectInputRender();
			}
			else{
				input.value = "";
			}
		}else{
			input.value = this.getMultiSelectInputRender();
		}
		
		this.afterUpdateInputRender();
	}
};

 /**
 * This method clear all items presents in the suggestion list.
 */
SweetDevRia.Suggest.prototype.clearHTMLItems = function () {
	if (this.beforeClearHTMLItems ()) {
	
		var suggestUl = this.getItemsList();
		suggestUl.innerHTML = "";
		this.highlightenedItem = null;

		this.afterClearHTMLItems ();
	}
};

/**
 * This method highlights an item in the list. Also unhighlight the current one.
 * @see getHighlightenedItem
 * @param {SuggestItem} item the item to highlight
 */
SweetDevRia.Suggest.prototype.highlightItem = function (item) {
	if (this.beforeHighlightItem (item)) {
		if(!this.viewManager.containsItem(item)){
			return;
		}
		
		var a = SweetDevRia.DomHelper.get(this.viewManager.getViewForItem(item));

		if (a) {
			if(this.highlightenedItem != null){
				this.unhighlightItem(this.highlightenedItem);
			}
			
			this.highlightenedItem = item;
			this.updateClass(item);
			
			a.focus ();
		}

		this.afterHighlightItem (item);
	}
};

/**
 * This method unhighlight an item in the list.
 * @param {SuggestItem} item the item to unhighlight
 */
SweetDevRia.Suggest.prototype.unhighlightItem = function (item) {
	if (this.beforeUnhighlightItem (item)) {

		var a = SweetDevRia.DomHelper.get(this.viewManager.getViewForItem(item));

		if (a) {
			this.highlightenedItem = null;
			
			a.focus ();
			
			this.updateClass(item);
		}

		this.afterUnhighlightItem (item);
	}
};

/**
 * This method create a new suggested item in the suggestion list, for the item and at the specified index.
 * @param {SuggestItem} item the item to set into the list
 * @param {int} index the index of the item in that list
 * @private
 */
SweetDevRia.Suggest.prototype.createHTMLItem = function (item, index) {
	var ul =  this.getItemsList();

	var li = document.createElement ("li");

	var a = document.createElement ("a");
	var aId = this.getHTMLId(index);
	a.setAttribute ("id", aId);
	a.setAttribute ("href", "#");
	a.setAttribute ("onclick", "return false;");//required of the page scroll get reloaded

	this.viewManager.add(item, aId); 

	SweetDevRia.DomHelper.addClassName (a, "ideo-sug-item");
			
	li.appendChild (a);

	a.innerHTML = this.getItemHtmlCode (item);

	ul.appendChild (li);

	var comp = this;
	SweetDevRia.EventHelper.addListener (a, "click",  function() {comp.onSwitchItemSelectionAction (item);});
	SweetDevRia.EventHelper.addListener (a, "keyup",  function(event) {comp.onItemKeyStroke (event, item); });
	
	this.updateClass(item);
};

/**
 * This method set a list of items into the suggestion list.
 * @param {Array} items A list of SuggestItem to set into the suggestion list
 * @private
 */
SweetDevRia.Suggest.prototype.setHTMLItems = function (items) {
	this.clearHTMLItems ();
	
	this.drawHeader();
	
	this.viewManager.reset();
	
	if(items && items.length > 0){
		for (var i = 0; i < items.length; i++) {
			this.createHTMLItem (items [i], i);
		}
	}

	this.drawFooter();
};

/**
 * This method set the selected items into the suggestion list.
 */
SweetDevRia.Suggest.prototype.drawSelectedValues = function(){
	if(this.beforeDrawSelectedValues()){
	
		if(this.getSelectedItemsNumber() == 0){
			return;
		}
	
		var items = new Array();
		for(var i=0; i<this.getSelectedItemsNumber();++i){
			items.push(this.getSelectedItemFromId(this.selectedItemsIds[i]));
		}
		this.setHTMLItems(items, 1);
		
		this.afterDrawSelectedValues();
		
	}
};

/**
 * This method draws the header in the suggest popup.
 * It first draws the getHeaderHtmlCode, then the getHeaderSelectionLink. 
 * @see getHeaderHtmlCode
 * @see getHeaderSelectionLink
 */
SweetDevRia.Suggest.prototype.drawHeader = function(){

	if(this.beforeDrawHeader()){
	
		var header = this.getHeader();
		var finalHeaderHtmlCode = "";
		var customHeaderHtmlCode = this.getHeaderHtmlCode ();
		
		if (customHeaderHtmlCode != null) { //custom code
			finalHeaderHtmlCode = customHeaderHtmlCode;
		}
		//draw the link if and only if we are in selectionView or that we have some items selected
		if((this.getSelectedItemsNumber() > 0) || (this.getViewMode() == SweetDevRia.Suggest.SELECTION_MODE)){
			finalHeaderHtmlCode = finalHeaderHtmlCode + this.getHeaderSelectionLink ();
		}
		
		if(finalHeaderHtmlCode != ""){
			header.innerHTML = finalHeaderHtmlCode;
			SweetDevRia.DomHelper.show (header.id);
		}	
		else {
			SweetDevRia.DomHelper.hide (header.id);
		}
		
		this.afterDrawHeader();
	}
};

/**
 * This method draws the header in the suggest popup, according to the getFooterHtmlCode result.
 * @see getFooterHtmlCode
 */
SweetDevRia.Suggest.prototype.drawFooter = function(){
	if(this.beforeDrawFooter()){
	
		var footer = this.getFooter();
		var footerHtmlCode = this.getFooterHtmlCode ();
		if (footerHtmlCode != null) {
			footer.innerHTML = footerHtmlCode;
			SweetDevRia.DomHelper.show (footer.id);
		}
		else {
			SweetDevRia.DomHelper.hide (footer.id);
		} 
		this.afterDrawFooter();
		
	}
};


/**
 * This method test the visibility of the suggested item list
 * @return true if the suggested item list is visible, else false
 * @type boolean
 */
SweetDevRia.Suggest.prototype.itemsAreVisible = function () {
	return SweetDevRia.DomHelper.isVisible (this.getSuggestPopup().id);
};

/**
 * This method shows the suggest popup
 */
SweetDevRia.Suggest.prototype.showSuggestPopup = function () {
	if (this.beforeShowSuggestPopup ()) {

		if (! this.itemsAreVisible ()) {
			var input = this.getInput ();
			var popup = this.getSuggestPopup();
			SweetDevRia.DomHelper.verticalShow (popup, 0.2);
			SweetDevRia.DomHelper.setX(popup, SweetDevRia.DomHelper.getX(input));
			SweetDevRia.DomHelper.setY(popup, SweetDevRia.DomHelper.getY(input)+SweetDevRia.DomHelper.getHeight(input));
			popup.style.zIndex = SweetDevRia.DisplayManager.getInstance().getTopZIndex();			
			this.setButtonClassName("ideo-sug-buttonDown");
		}

		this.afterShowSuggestPopup ();
	}
};


/**
 * This method hides the suggest popup
 */
SweetDevRia.Suggest.prototype.hideSuggestPopup = function () {
	if (this.beforeHideSuggestPopup ()) {
	
		if (this.itemsAreVisible ()) {
			var popup = this.getSuggestPopup();

			SweetDevRia.DomHelper.verticalHide (popup, 0.2);

			var input = this.getInput (); 
			input.focus();
			this.removeButtonClassName("ideo-sug-buttonDown");
		}
		
		this.afterHideSuggestPopup ();
		
	}
};


/**
 * This method is triggered on the view mode switch action ( suggestions <-> selections )
 * @see getHeaderSelectionLink
 */
SweetDevRia.Suggest.prototype.onSwitchViewModeAction = function(){
	if(this.beforeOnSwitchViewModeAction()){
		var toViewMode;
		switch(this.getViewMode()){
			case SweetDevRia.Suggest.SUGGEST_MODE:
				toViewMode = SweetDevRia.Suggest.SELECTION_MODE;
			break;
			
			case SweetDevRia.Suggest.SELECTION_MODE:
				toViewMode = SweetDevRia.Suggest.SUGGEST_MODE;
			break;
			
			default:throw("CurrentViewModeException : the viewMode :" + this.getViewMode()+" is not available.");
		}
		this.switchViewMode(toViewMode);
		this.afterOnSwitchViewModeAction();
	}
};


/**
 * This method switchs the view mode into the popup ( suggestions <-> selections )
 * @param {int} viewMode the mode to switch to
 * @see SweetDevRia.Suggest.SUGGEST_MODE
 * @see SweetDevRia.Suggest.SELECTION_MODE
 */
SweetDevRia.Suggest.prototype.switchViewMode = function(viewMode){
	if(this.beforeSwitchViewMode(viewMode)){
	
		this.viewMode = viewMode;
		
		switch(this.getViewMode()){
			case SweetDevRia.Suggest.SUGGEST_MODE:
				this.processData(this.data);
			break;
			
			case SweetDevRia.Suggest.SELECTION_MODE:
				this.drawSelectedValues();
			break;
			
			default:throw("CurrentViewModeException : the viewMode :" + this.getViewMode()+" is not available.");
		}
		
		this.afterSwitchViewMode(viewMode);
	}
};

/**
 * This method switchs the popup visibility
 */
SweetDevRia.Suggest.prototype.switchSuggestPopupVisibility = function () {
	if(this.beforeSwitchSuggestPopupVisibility()){
		if (!this.itemsAreVisible ()) {
			this.showSuggestPopup();
		}else{
			this.hideSuggestPopup();
		}
		
		this.afterSwitchSuggestPopupVisibility();
	}
};


/*SweetDevRia.Suggest.prototype.getItemValue = function (item) {
	return item.value;
};*/


/**
 * Creates a SuggestData from parameters values
 * @param {String} inputValue The value of the input which correspond this object
 * @param {Array} items The array of SuggestItem of this object
 * @param {boolean} truncated Whether this data is truncated or not
 * @param {int} pageNumber The page number this data are related to. 
 * @return the new SuggestData created
 * @type SuggestData
 * @private
 */
SweetDevRia.Suggest.createSuggestData = function(inputValue, items, truncated, pageNumber){
	if(!pageNumber){pageNumber = 1;}
	return {"inputValue":inputValue, "items":items, "truncated":truncated, "pageNumber":pageNumber};
};

/**
 * Process the input value, for an optional page.
 * This method first look up the combo inputValue/pageNumber into the buffer, 
 * then try to refine some buffered data, and finally execute a server request.  
 * @param {String} newInputValue The input value to process
 * @param {int} pageNumber the number of the page to process. Default is set to 1.
 */
SweetDevRia.Suggest.prototype.processInputValue = function(newInputValue, pageNumber){
	if(this.beforeProcessInputValue(newInputValue, pageNumber)){
	
		var newSuggestData = null;
		
		if(this.isRetrievingValue){//we are already retrieving value. do not overload the server with Ajax request.
			SweetDevRia.log.debug("Multiple Ajax request avoided, retrieving has been aborted.");
			return;
		}
		
		if(newInputValue.length < this.triggerLength){
			newSuggestData = SweetDevRia.Suggest.createSuggestData(newInputValue, null, true);//set as trunctaed to bypass refinment
		}else if( this.buffer.contains( newInputValue, pageNumber ) ){	// We have already buffered the results
			newSuggestData = this.buffer.get( newInputValue, pageNumber );
			SweetDevRia.log.debug("Buffer loading in process for input value :"+newInputValue+" and page : "+pageNumber);		
		}else{
			var bufferedData = this.getRefineableData( newInputValue );  
			if(bufferedData != null){// we found some data to refine
				SweetDevRia.log.debug("Refinement in process.");
				newSuggestData = this.refineBufferedData(bufferedData, newInputValue);
			}
		}
	
		this.highlightenedAId = null;
		
		if(!newSuggestData){
			newSuggestData = this.retrieveValues(newInputValue, pageNumber);
		}else{
			this.processData(newSuggestData, true);
		}
		
		this.afterProcessInputValue(newInputValue, pageNumber);
	}
};		

/**
 * Process some new data in the suggest, and optionnally show the suggest popup
 * @param {SuggestData} suggestData The data to process
 * @param {boolean} autoShowItems Indicates if we must show the items or not.
 * @private
 */
SweetDevRia.Suggest.prototype.processData = function(suggestData, autoShowItems){
	if(this.getViewMode() == SweetDevRia.Suggest.SELECTION_MODE){//we process data : shift to suggestion mode
		this.switchViewMode(SweetDevRia.Suggest.SUGGEST_MODE);
	}
	this.data = suggestData;
	if(suggestData.items){
		if(suggestData.pageNumber == 0){
			suggestData.pageNumber = 1;
		}
		this.buffer.add(suggestData, suggestData.inputValue, suggestData.pageNumber);
		this.setHTMLItems( suggestData.items , suggestData.pageNumber);
		if(autoShowItems){
			this.showSuggestPopup();
		}
		if(this.paginable == true){
			if( (suggestData.truncated == true) || (suggestData.pageNumber != 1) ){
				this.showPageBar(suggestData.pageNumber, Math.ceil(suggestData.totalItemNumber/this.itemPerPage));
			}else{
				this.hidePageBar();
			}
		}
	}else{
		this.clearHTMLItems();
	}
	this.updateSelection(suggestData.inputValue);
};


/**
 * Updates the selection, according to the current input value and the previous selected items.
 * Clean up all the selected item which no longer fit the input value.
 * Does nothing if stackSelection is set to true.
 * @param {String} newInputValue The new input value
 */
SweetDevRia.Suggest.prototype.updateSelection = function(newInputValue){
	if(this.beforeUpdateSelection(newInputValue)){	
	
		if(this.stackSelection){//do not modify the selection
			return;
		}
		
		// we just keep in selection the items that are still in the data
		for(var i=0;i<this.getSelectedItemsNumber();){
			var item = this.getSelectedItemFromId(this.selectedItemsIds[i]);
			if(!this.isFirstMatchSecond(newInputValue, item.value)){
				this.removeItemFromSelection(item);
			}else{
				++i;
			}
		}
		
		this.afterUpdateSelection(newInputValue);
	}
};

/**
 * Refine the items contained in the bufferedData, according to the value given in parameter
 * Clean up all the old items which no longer fits the actual value.
 * @param {SuggestData} bufferedData The old data in buffer to refine
 * @param {String} value The value to refine from.
 * @return the new SuggestData created from the old one
 * @type SuggestData
 * @private
 */
SweetDevRia.Suggest.prototype.refineBufferedData = function(bufferedData, value){
	var newSuggestData = SweetDevRia.Suggest.createSuggestData(value, null, false, 1); 
	
	var newItems = new Array();
	
	for(var i=0;i<bufferedData.items.length;++i){
		var item = bufferedData.items[i];
		var newval = value;
		var bufferVal = item.value;
	
		if(!this.caseSensitive){
			newval = newval.toLowerCase();
			bufferVal = bufferVal.toLowerCase();
		}
		if(this.isFirstMatchSecond(newval, bufferVal)){
			newItems.push(item);
		}
	}
	newSuggestData.items = newItems; 
	
	return newSuggestData;
};


/**
 * Get some data refined from other ones in buffer.
 * Return null if none could be created. 
 * @param {String} value The value to refine from.
 * @return the new SuggestData created from an old one, or null if none could have been created 
 * @type SuggestData
 * @private
 */
SweetDevRia.Suggest.prototype.getRefineableData = function(value){

	if(this.data){//test the highest probability of refinement first
		if(this.testRefinement(this.data, value)){
			return this.data;
		}
	}

	for(var i=0;i<this.buffer.length();++i){
		var bufferedData = this.buffer.getElementAt(i).suggestData;
		if(this.testRefinement(bufferedData, value)){
			return bufferedData;
		}
	}

	return null;
};

/**
 * Test if a SuggestData could be refined for a specific value
 * Return null if none could be created.
 * @param {SuggestData} suggestData The data to test for a refinement
 * @param {String} value The value to test the refine from.
 * @return true if a refinement can be executed between the suggestData and the value
 * @type boolean
 * @private
 */
SweetDevRia.Suggest.prototype.testRefinement = function(suggestData, value){

	if(suggestData.truncated || suggestData.pageNumber != 1){//we had truncated results. Data not usable.
		return false;
	}
	
	// else, is the new input value a refinement of the old one ?
	var oldValue = suggestData.inputValue;
	var newValue = value;
	
	if(!this.caseSensitive){
		oldValue = oldValue.toLowerCase();
		newValue = newValue.toLowerCase();
	}
	if(this.isFirstMatchSecond(oldValue, newValue)){
		return true;
	}
	return false;
};

/**
 * Test the equality of two strings, according to the current caseSensitive property
 * @param {String} str1 The first string
 * @param {String} str2 The second string
 * @return true if the two strings are equals.
 * @type boolean
 * @private
 */
SweetDevRia.Suggest.prototype.testEquality = function(str1, str2){
	if(!this.caseSensitive){
		str1 = str1.toLowerCase();
		str2 = str2.toLowerCase();
	}
	if( (str1 == str2) ){
		return true;
	}
	return false;
};

/**
 * return true if the first value match the second one, according to the current filterMode
 * @param {String} part The string deciding of the *pattern* that word must match
 * @param {String} word The word to test for the *pattern* part.
 * @return true if part matches into word
 * @type boolean
 * @private
 */
SweetDevRia.Suggest.prototype.isFirstMatchSecond = function(part, word){
	switch(this.filterMode){
		case SweetDevRia.Suggest.STARTSWITH:
			return (word.indexOf(part) == 0);
		case SweetDevRia.Suggest.CONTAINS:
			return (word.indexOf(part) != -1);
		case SweetDevRia.Suggest.ENDSWITH:
			return (word.lastIndexOf(part) == (word.length-part.length));
			break;
		case SweetDevRia.Suggest.REGEXP:
			return false;
			break;
		case SweetDevRia.Suggest.SIMPLE_REGEXP:
			return false;
			break;
		case SweetDevRia.Suggest.CUSTOM:
			return false;
			break;
		default : throw("Unavailable filter mode set :"+this.filterMode+". Cannot process refine.");
	}
	return false;
};



/**
 * Event Handler put on the input field
 * Decide which action should be executed, depending of the key stroked.
 * @param {Event} evt HTML event
 */
SweetDevRia.Suggest.prototype.onInputKeyStroke = function (evt) {

	evt = SweetDevRia.EventHelper.getEvent (evt);
	
	if (this.beforeOnInputKeyStroke (evt)) {

		if (evt.keyCode == SweetDevRia.KeyListener.ESCAPE_KEY) { // escape
			this.hideSuggestPopup ();
		}
		else if (evt.keyCode == SweetDevRia.KeyListener.ARROW_DOWN_KEY) { // Key down arrow
			if (! this.data) { // data have never been retrieved
				this.processInputValue (evt.src.value);
			}
			else{//we already have data : show them if not, focus if not!
				this.showSuggestPopup();
				if(this.data.items && this.data.items.length > 0){
					this.highlightItem ( this.viewManager.getItemAt(0) );
				}
			}
		}
		else if (evt.keyCode == SweetDevRia.KeyListener.ARROW_UP_KEY) { // Key up arrow
			this.hideSuggestPopup();
		}
		else {
			var inputValue = evt.src.value;
			//the input value has changed or none have already been executed
			if(!this.data || !this.testEquality(this.data.inputValue, inputValue)){
				this.processInputValue (inputValue);
			}
			//else is a hole key
		}

		this.afterOnInputKeyStroke (evt);
	}
};

/**
 * Event Handler put on each suggested item.
 * Decide which action should be executed, depending of the key stroked.
 * @param {Event} evt HTML event
 * @param {SuggestItem} item the item where the event was triggered
 */
SweetDevRia.Suggest.prototype.onItemKeyStroke = function (evt, item) {
	evt = SweetDevRia.EventHelper.getEvent (evt);

	if (this.beforeOnItemKeyStroke (evt, item)) {

		if (evt.keyCode == SweetDevRia.KeyListener.ESCAPE_KEY) { // escape
			this.hideSuggestPopup ();
		}
	/*	else if (evt.keyCode == SweetDevRia.KeyListener.ENTER_KEY) { // Key enter
			//this.switchItemSelection (item);
			//ENTER automatically clic on the link and call onclick
		}*/
		else {
			var aId = evt.src.id;
			var nb = this.extractHTMLIndex(aId);

			if (nb >= 0) {
				if (evt.keyCode == SweetDevRia.KeyListener.ARROW_DOWN_KEY) { // Key down arrow
					if (nb == this.data.items.length - 1) {
					;//	nb = 0;
					} 
					else {
						nb ++;
						this.highlightItem(this.viewManager.getItemAt(nb));
					}
				}
				else if (evt.keyCode == SweetDevRia.KeyListener.ARROW_UP_KEY) { // Key up arrow
					if (nb == 0) {
						//nb = this.items.length - 1;
						this.unhighlightItem(this.viewManager.getItemAt(0));
						this.getInput().focus();
					} 
					else {
						nb --;
						this.highlightItem (this.viewManager.getItemAt(nb));
					}
				}
			}
		}	

		this.afterOnItemKeyStroke (evt, item);
	}
	
	return false;
};


/**
 * Return the number of items selected at present.
 * @return the number of items selected at present.
 * @type int
 */
SweetDevRia.Suggest.prototype.getSelectedItemsNumber = function(){
	return this.selectedItemsIds.length;
};

/**
 * Return the selected state of an item
 * @param {SuggestItem} item the item to test
 * @return true if the item is selected, false otherwise
 * @type boolean
 */
SweetDevRia.Suggest.prototype.isItemSelected = function(item){
	return this.selectedItemsIds.contains(item.id);
};

/**
 * Add a SuggestItem to the selection, in the Suggest reference 
 * @param {SuggestItem} item the item to add
 * @private
 */
SweetDevRia.Suggest.prototype.addIdToSelection = function(item){
	this.selectedItemsIds.push(item.id);
	this.selectedItemsModels[item.id] = item;
};

/**
 * Remove a SuggestItem from the selection, in the Suggest reference 
 * @param {SuggestItem} item the item to remove
 * @private
 */
SweetDevRia.Suggest.prototype.removeIdFromSelection = function(item){
	this.selectedItemsIds.remove(item.id);
	this.selectedItemsModels[item.id] = null;
};


/**
 * Add a SuggestItem to the selection, both in the Suggest reference and in the HTML code
 * Is not in charge of the multi selection compatibility  
 * @param {SuggestItem} item the item to add
 * @private
 */
SweetDevRia.Suggest.prototype.addItemToSelection = function(item){
	this.addIdToSelection(item);
	this.addInputToSelection(item);
};

/**
 * Remove a SuggestItem from the selection, both in the Suggest reference and in the HTML code 
 * @param {SuggestItem} item the item to remove
 * @private
 */
SweetDevRia.Suggest.prototype.removeItemFromSelection = function(item){
	this.removeIdFromSelection(item);
	this.removeInputFromSelection(item);
};


/**
 * Set a SuggestItem selected, both in the Suggest reference and in the HTML code
 * Does nothing if the item is already selected  
 * @param {SuggestItem} item the item to set selected
 */
SweetDevRia.Suggest.prototype.setItemSelected = function(item){
	if(!this.isItemSelected(item)){
		this.switchItemSelection(this.getSelectedItemFromId(item.id), true);//get the good model
	}
};

/**
 * Set a SuggestItem unselected, both in the Suggest reference and in the HTML code
 * Does nothing if the item is already unselected  
 * @param {SuggestItem} item the item to set unselected
 */
SweetDevRia.Suggest.prototype.setItemUnselected = function(item){
	if(this.isItemSelected(item)){
		this.switchItemSelection(this.getSelectedItemFromId(item.id), true);//get the good model
	}
};


/**
 * Unselect all the items selected
 * Does nothing if no items are selected  
 */
SweetDevRia.Suggest.prototype.unselectAll = function(){
	while(this.selectedItemsIds.length>0){
		this.switchItemSelection(this.getSelectedItemFromId(this.selectedItemsIds[0]), true);	
	}
};


/**
 * This method is triggered on the item selection action
 * @see switchItemSelection
 * @param {SuggestItem} item the item to switch
 * @param {boolean} keepOpen if the suggest popup should be kept opened after the selection/unselection
 */
SweetDevRia.Suggest.prototype.onSwitchItemSelectionAction = function(item, keepOpen){
	if(this.beforeOnSwitchItemSelectionAction(item)){
		this.switchItemSelection(item, keepOpen);
		
		this.afterOnSwitchItemSelectionAction(item);
	}
};

/**
 * Switch a SuggestItem state.
 * This method manages everything about the SuggestItem to switch and the current selection.
 * It finally updates the input render, redraw the header and the footer of the suggest popup.
 * 
 * @param {SuggestItem} item the item to switch
 * @param {boolean} keepOpen if the suggest popup should be kept opened after the selection/unselection
 */
SweetDevRia.Suggest.prototype.switchItemSelection = function (item, keepOpen) {	
	//we process an unselection
	if(this.isItemSelected(item)){
		this.removeItemFromSelection(item);
	}
	//we select one
	else{
		if(!this.multiSelect){
			if(this.getSelectedItemsNumber() == 1){
				this.switchItemSelection( this.getSingleSelectedItem() );
			}
		}
		this.addItemToSelection(item);
		if(!this.multiSelect && !keepOpen){
			this.hideSuggestPopup();
		}
	}
	
	if(this.viewManager.containsItem(item)){//this item is visualy present
		this.updateClass(item);
	}
	
	this.updateInputRender ();
	this.drawHeader();
	this.drawFooter();
};

/**
 * Updates the class of the HTML render of an item.
 * If the item has no render, does nothing.
 * This class is in charge of computing which class should be applied to the item given in parameter. 
 * @see SuggestItemViewManager
 * @param {SuggestItem} item the item to update the HTML class render
 */
SweetDevRia.Suggest.prototype.updateClass = function(item){
	if(this.beforeUpdateClass(item)){
	
		var aId = this.viewManager.getViewForItem(item);
		if(!aId){
			return;
		}
		var a = SweetDevRia.DomHelper.get(aId);
		if(!a){
			return;
		}
		
		if(this.isItemSelected(item)){
			SweetDevRia.DomHelper.removeClassName (a, "ideo-sug-unselectedItem");
			SweetDevRia.DomHelper.addClassName (a, "ideo-sug-selectedItem");
		}else{
			SweetDevRia.DomHelper.removeClassName (a, "ideo-sug-selectedItem");
			SweetDevRia.DomHelper.addClassName (a, "ideo-sug-unselectedItem");
		}
		
		if(this.highlightenedItem == item){//set it as highlightened
			SweetDevRia.DomHelper.addClassName (a, "ideo-sug-highlightenedItem");
		}
		else{//set it as it should be
			SweetDevRia.DomHelper.removeClassName (a, "ideo-sug-highlightenedItem");
		}
		
		this.afterUpdateClass(item);
	}
};

/************************* AJAX *******************************/

/**
 * Return the parameters to send to the server to update this component's server model
 * @return the parameters to send to the server to update this component's server model
 * @type Map
 * @private
 */
SweetDevRia.Suggest.prototype.getServerModelUpdate = function(){
	var params = {};

	params ["filterMode"] = this.filterMode;
	params ["stackSelection"] = this.stackSelection;
	
	var selectedModels = new Array();
	for(var m in this.selectedItemsModels){
		if(this.selectedItemsModels[m]!=null){
			selectedModels.push(this.selectedItemsModels[m]);
		}
	}
	
	params ["selectedItemModels"] = selectedModels;
	params ["caseSensitive"] = this.caseSensitive;
	
	return params;
};

/**
 * Retrieve the values from the server, for the input value and page number given in parameter
 * Process the Ajax Call.
 * Execute the server model update in the same time than the retrieving.
 * @param {String} value the value we are requesting
 * @param {int} pageNumber the page number to get. 1 if no specified.
 */
SweetDevRia.Suggest.prototype.retrieveValues = function(value, pageNumber){
	if(this.beforeRetrieveValues(value, pageNumber)){
	
		this.isRetrievingValue = true;
		if(!pageNumber){
			pageNumber = 1;
		}
	
		var params = {};
		params["updateModel"] = this.getServerModelUpdate();
		params["value"] = value;
		params["pageNumber"] = pageNumber;
		
		this.setButtonClassName("ideo-sug-buttonLoading");
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("retrieveValues", this.id, params));
		
		this.afterRetrieveValues(value, pageNumber);
	}
};

/**
 * Callback method of the retrieving action
 * Is in charge of the data processing launch.
 * @param {Map} evt the event which contains the data //TODO
 */
SweetDevRia.Suggest.prototype.onRetrieveValues = function(evt){
	if(this.beforeOnRetrieveValues(evt)){
	
		this.removeButtonClassName("ideo-sug-buttonLoading");
		this.processData(evt.data, true);
		this.isRetrievingValue = false;
		
		this.afterOnRetrieveValues(evt);
	}
};


/************************ HTML METHODS ***************************/

/**
 * Return the HTML id formated from an index. 
 * @see extractHTMLIndex
 * @return the HTML id formated from an index.
 * @type String
 */
SweetDevRia.Suggest.prototype.getHTMLId = function(index){
	return this.id+"_item_"+index;
};

/**
 * Extract the HTML index of an element from its id. 
 * @see getHTMLId
 * @return the index of the HTML element's id given in parameter
 * @type int
 */
SweetDevRia.Suggest.prototype.extractHTMLIndex = function(id){
	return parseInt(id.substring(id.lastIndexOf("_")+1, id.length), 10);
};


/************************ INPUT MANAGER **************************/

/**
 * Return the resulting inputs container 
 * @return the resulting input container 
 * @type HTMLElement
 */
SweetDevRia.Suggest.prototype.getInputSelectionContainer = function(){
	return SweetDevRia.DomHelper.get(this.id+"_input_container");
};

/**
 * Return the first result input, contained in the input container. 
 * @return the first result input element. 
 * @type HTMLElement
 * @throw FatalException if no input hidden are defined
 */
SweetDevRia.Suggest.prototype.getFirstItemSelectionInput = function () {
	for(var i=0;i<this.getInputSelectionContainer().childNodes.length;++i){
		if(this.getInputSelectionContainer().childNodes[i].nodeType == 1){
			return  this.getInputSelectionContainer().childNodes[i];
		}
	}
	throw("No input hidden are defined !");
};

/**
 * Return the number of result inputs (implicitly the number of selected items).
 * @return the number of result inputs 
 * @type int
 */
SweetDevRia.Suggest.prototype.getItemSelectionInputNumber = function () {
	var count = 0;
	for(var i=0;i<this.getInputSelectionContainer().childNodes.length;++i){
		if(this.getInputSelectionContainer().childNodes[i].nodeType == 1){
			count++;
		}
	}
	return count;
};

/**
 * Create a result input for the item given in parameter, or fill the one existing, in singleSelection mode
 * @param {SuggestItem} item the item to add 
 * @private
 */
SweetDevRia.Suggest.prototype.createItemInputField = function (item) {
	var firstInput = this.getFirstItemSelectionInput();
	
	if(firstInput.value == ""){//first selection, fill in the first input
		firstInput.value = item.value;
		this.selectedIdsInputAssociation[item.id] = firstInput;
		return;
	}
	
	var newInput = document.createElement ("input");
	newInput.setAttribute("name", this.id);
	newInput.setAttribute("value", item.value);
	newInput.setAttribute("type", "hidden");
	SweetDevRia.DomHelper.insertChild(this.getInputSelectionContainer(), newInput);
	
	this.selectedIdsInputAssociation[item.id] = newInput;
};

/**
 * Delete a result input for the item given in parameter, or clean the one existing, in singleSelection mode
 * @param {SuggestItem} item the item to delete  
 * @private
 */
SweetDevRia.Suggest.prototype.deleteItemInputField = function (item) {
	var delInput = this.selectedIdsInputAssociation[item.id];
	
	if(this.getItemSelectionInputNumber() == 1){//last selection, just clean the input
		delInput.value="";
		this.selectedIdsInputAssociation[item.id] = null;
		return;
	}
	
	this.getInputSelectionContainer().removeChild(delInput);
	this.selectedIdsInputAssociation[item.id] = null;
};

/**
 * Add an item to the selection, in HTML code
 * @see addItemToSelection
 * @param {SuggestItem} item the item to add in HTML
 * @private
 */
SweetDevRia.Suggest.prototype.addInputToSelection = function (item) {
	var firstInput = this.getFirstItemSelectionInput();
	if(!this.multiSelect){
		firstInput.value = item.value;
	}
	else{
		if(this.multiField){
			this.createItemInputField(item);
		}
		else{
			if(firstInput.value == ""){
				firstInput.value = item.value ;
			}
			else{
				firstInput.value = firstInput.value + SweetDevRia.Suggest.SEPARATOR + item.value;
			}
		}
	}
};

/**
 * Remove an item from the selection, in HTML code
 * @see removeItemFromSelection
 * @param {SuggestItem} item the item to remove in HTML
 * @private
 */
SweetDevRia.Suggest.prototype.removeInputFromSelection = function (item) {
	var firstInput = this.getFirstItemSelectionInput();
	if(!this.multiSelect){
		firstInput.value = "";
		return;
	}
	else{
		if(this.multiField){
			this.deleteItemInputField(item);
		}
		else{//change the string of the singleField
			var inputValue = firstInput.value;
			
			if(item.value == inputValue){
				firstInput.value = "";//single element
			}
			else if( inputValue.indexOf(item.value+SweetDevRia.Suggest.SEPARATOR) == 0){//first element
				firstInput.value = inputValue.substring((item.value.length+1), inputValue.length);
			}
			//middle
			else if( inputValue.indexOf(SweetDevRia.Suggest.SEPARATOR+item.value+SweetDevRia.Suggest.SEPARATOR) != -1 ){
				var startIndex = inputValue.indexOf(SweetDevRia.Suggest.SEPARATOR+item.value+SweetDevRia.Suggest.SEPARATOR);
				firstInput.value = inputValue.substring(0, startIndex) + inputValue.substring(startIndex+item.value.length+1, inputValue.length);
			}//end
			else if(inputValue.indexOf(SweetDevRia.Suggest.SEPARATOR+item.value) == -1){
				throw("Deletion of the item value : "+item.value+" in a single field failed.");
			}else{//we can delete it in last position
				firstInput.value = inputValue.substring(0, inputValue.indexOf(SweetDevRia.Suggest.SEPARATOR+item.value));
			}
		}	
	}
};


/*************************** BUTTON MANAGER *************************/

/**
 * Set a class for the button. Manages the class order (loading > open > over > out)
 * @param {String} className the name of the class to add.
 * @private
 */
SweetDevRia.Suggest.prototype.setButtonClassName = function(className){
	var pushed = this.buttonState[this.buttonState.length-1];
	switch(className){
		case "ideo-sug-buttonOut": //put out only if we were over
			if(pushed == "ideo-sug-buttonOver"){
				this.buttonState.pop();
			}
		break;
			
		case "ideo-sug-buttonLoading"://loading own all
			if(pushed != className){
			 	this.buttonState.push(className);
			 }
		break;
		
		case "ideo-sug-buttonOver"://put over only if we were out
			if(pushed == "ideo-sug-buttonOut"){
				this.buttonState.push(className);
			}
		break;
			
		case "ideo-sug-buttonDown": //put down only if we were not laoding
			if((pushed != "ideo-sug-buttonLoading") && (pushed != className)){
				this.buttonState.push(className);
			}
		break;
		default:break;
	}
	
	this.renderButton();
};

/**
 * Remove a class for the button.
 * @param {String} className the name of the class to remove.
 * @private
 */
SweetDevRia.Suggest.prototype.removeButtonClassName = function(className){
	if(this.buttonState[this.buttonState.length-1] == className){
		this.buttonState.pop();
		this.renderButton();
	}
};

/**
 * Update the button rendering, according to the current class
 */
SweetDevRia.Suggest.prototype.renderButton = function(){
	if(this.beforeRenderButton()){
		this.getButton().className = this.buttonState[this.buttonState.length-1];
		
		this.afterRenderButton();
	}
};


/************************ GETTERS *************************************/

/**
 * Return the input element
 * @return input element
 * @type Input
 */
SweetDevRia.Suggest.prototype.getInput = function () {
	return SweetDevRia.DomHelper.get(this.id+"_input");
};


/**
 * Return the input element's value
 * @return input element value
 * @type String
 */
SweetDevRia.Suggest.prototype.getInputValue = function () {
	return this.getInput().value;
};


/**
 * Return the button div element
 * @return div button element
 * @type HTMLElement
 */
SweetDevRia.Suggest.prototype.getButton = function () {
	return SweetDevRia.DomHelper.get(this.id+"_button");
};

/**
 * Return the div containing header, items and footer : the suggest popup
 * @return the div containing header, items and footer : the suggest popup
 * @type HTMLElement
 */
SweetDevRia.Suggest.prototype.getSuggestPopup = function () {
	return SweetDevRia.DomHelper.get(this.id+"_popup");
};

/**
 * Return the list ul element containing the suggest items
 * @return list ul element containing the suggest items
 * @type HTMLElement
 */
SweetDevRia.Suggest.prototype.getItemsList = function () {
	return SweetDevRia.DomHelper.get(this.id+"_suggest");
};

/**
 * Return the suggest popup header element
 * @return the suggest popup header element
 * @type HTMLElement
 */
SweetDevRia.Suggest.prototype.getHeader = function () {
	return SweetDevRia.DomHelper.get(this.id+"_header");
};


/**
 * Return the suggest popup footer element
 * @return the suggest popup footer element
 * @type HTMLElement
 */
SweetDevRia.Suggest.prototype.getFooter = function () {
	return SweetDevRia.DomHelper.get(this.id+"_footer");
};

/**
 * Return the current highlightened item, or null if none are highlightened. 
 * @return the current highlightened item, or null
 * @type SuggestItem
 */
SweetDevRia.Suggest.prototype.getHighlightenedItem = function () {
	return this.highlightenedItem;
};


/**
 * Return the component's buffer
 * @return the component's buffer
 * @type SuggestBuffer
 */
SweetDevRia.Suggest.prototype.getBuffer = function () {
	return this.buffer;
};

/**
 * Return the selected item corresponding to that id
 * @param {String} id the id of the item 
 * @return the item corresponding to that id
 * @type SuggestItem
 */
SweetDevRia.Suggest.prototype.getSelectedItemFromId = function (id) {
	return this.selectedItemsModels[id];
};

/**
 * Return the selected item, in singleSelect
 * @return the selected item, in singleSelect
 * @type SuggestItem
 */
SweetDevRia.Suggest.prototype.getSingleSelectedItem = function () {
	return this.getSelectedItemFromId(this.selectedItemsIds[0]);
};

/**
 * Return the component's view manager
 * @return the component's view manager
 * @type SuggestItemViewManager
 */
SweetDevRia.Suggest.prototype.getViewManager = function () {
	return this.viewManager;
};

/**
 * Return the current view mode
 * @return the current view mode
 * @type int
 */
SweetDevRia.Suggest.prototype.getViewMode = function () {
	return this.viewMode;
};

/**
 * Return true if an Ajax request is in progress, false otherwise
 * @return true if an Ajax request is in progress, false otherwise
 * @type boolean
 */
SweetDevRia.Suggest.prototype.isAjaxInProgress = function () {
	return this.isRetrievingValue;
};


/************************ VIEW MANAGER ********************************/

/**
 * This is the SuggestItemViewManager component class
 * This class manages the relation between the items and their HTML render
 * @constructor
 */
SweetDevRia.SuggestItemViewManager = function(){
	this.reset();
};

/**
 * Clean the associations item/HTML
 * @private
 */
SweetDevRia.SuggestItemViewManager.prototype.reset = function(){
	this.itemOrder = new Array(); //array containing items position in list view
	this.itemHTMLView = {}; // map binding the item with their related element in HTML
};

/**
 * Add an association item/HTML
 * @param {SuggestItem} item the item to associate
 * @param {String} aId the HTML id to associate the item with
 * @private
 */
SweetDevRia.SuggestItemViewManager.prototype.add = function(item, aId){
	this.itemOrder.push(item);
	this.itemHTMLView[item.id] = aId;
};

/**
 * Return the number of associations of the view manager (the number of items currently displayed in HTML) 
 * @type int
 * @return the number of associations of the view manager
 */
SweetDevRia.SuggestItemViewManager.prototype.length = function(){
	return this.itemOrder.length;
};

/**
 * Return true if an item is contained in the manager : if it is displayed in HTML 
 * @type boolean 
 * @return true if an item is contained in the manager
 */
SweetDevRia.SuggestItemViewManager.prototype.containsItem = function(item){
	return this.itemHTMLView[item.id];
};

/**
 * Return the item displayed at a specified HTML index.
 * @param {int} index the index to get 
 * @type SuggestItem
 * @return the item displayed at a specified HTML index.
 * @throw OutOfBoundsException if the index is too large 
 */
SweetDevRia.SuggestItemViewManager.prototype.getItemAt = function(index){
	if(index > this.length()){
		throw("OutOfBoundsException in SuggestItemViewManager. Cannot retrieve the binding for element number : "+index);
	}
	return this.itemOrder[index];
};

/**
 * Return the HTML id view for a specified item
 * @param {SuggestItem} item the item to get the view from. 
 * @type String
 * @return the HTML id view for a specified item
 */
SweetDevRia.SuggestItemViewManager.prototype.getViewForItem = function(item){
	return this.itemHTMLView[item.id];
};


/************************ BUFFER ********************************/

/**
 * This is the SuggestBuffer component class
 * This class manages the buffer of the Suggest component
 * Each data has for key a pair of value/pageNumber, and as value a SuggestData item
 * Implemented as a FILO
 * @param {Suggest} suggest the suggest object the buffer is related to
 * @param {int} size the size of the buffer, -1 for an unlimited buffer size 
 * @constructor
 */
SweetDevRia.SuggestBuffer = function(suggest, size){
	this.suggest = suggest;
	this.size = size;
	
	this.data = new Array();
};

/**
 * Return true if the buffer contains the key value/page
 * @param {String} value the value to search
 * @param {int} page the page to search for the value
 * @type boolean
 * @return true if this couple value/page is contained in the buffer
 */
SweetDevRia.SuggestBuffer.prototype.contains = function(value, page){
	if(!page){ page=1; }
	return this.get(value, page) != null;
};

/**
 * Clean the buffer, reseting its size to 0
 */
SweetDevRia.SuggestBuffer.prototype.clean = function(){
	this.data = new Array();
};

/**
 * Return the SuggestData associated to this couple value/page. null if not found
 * @param {String} value the value related to the data to get
 * @param {int} page the page related to the data to get
 * @type SuggestData
 * @return the SuggestData associated to this couple value/page. null if not found
 */
SweetDevRia.SuggestBuffer.prototype.get = function(value, page){
	if(!page){
		page=1;
	}
	for(var i=0;i<this.data.length;++i){
		if(this.suggest.testEquality(this.data[i].value, value) && (this.data[i].page == page)){
			return this.data[i].suggestData;
		}
	}
	return null;
};

/**
 * Return the SuggestData at a specified index. Used to iterate over the buffer's data.
 * @param {int} index the index to get
 * @type SuggestData
 * @return the SuggestData for this index.
 */
SweetDevRia.SuggestBuffer.prototype.getElementAt = function(index){
	return this.data[index];
};

/**
 * Add a SuggestData for a couple value/page
 * @param {SuggestData} suggestData the suggestData to add
 * @param {String} value the value of this suggestData
 * @param {page} page the page number of this suggestData
 * @private
 */
SweetDevRia.SuggestBuffer.prototype.add = function(suggestData, value, page){
	if(!page){//default page
		page=1;
	}
	if(this.contains(value, page)){
		this.repush(value, page);
		return;
	}
	if(this.size != -1 && this.data.length >= this.size){//clean
		this.data.shift();
	}
	//add
	this.data.push({"suggestData":suggestData, "value":value, "page":page});		
};

/**
 * Repush a data at the end of the FILO
 * @param {String} value the value of the data to repush
 * @param {page} page the page number to repush
 * @private
 */
SweetDevRia.SuggestBuffer.prototype.repush = function(value, page){
	if(!page){//default page
		page=1;
	}
	
	var index = -1;
	for(var i=0;i<this.data.length;++i){
		if( (this.data[i].value == value) && (this.data[i].page == page) ){
			index = i;
			break;
		}
	}
	
	if(index == -1){
		throw("UndefinedBufferedValue : Cannot reorder the buffer value : "+value);
	}
	
	var repushed = this.data[index];
	
	this.data.splice(index, 1);
		
	this.add(repushed.suggestData, value, page);
};

/**
 * Return the current filling size of the buffer  
 * @return the current filling size of the buffer
 * @type int
 */
SweetDevRia.SuggestBuffer.prototype.length = function(){
	return this.data.length;
};


/****************************** TEMPLATE *****************************/

SweetDevRia.Suggest.prototype.template = "\
<input id=\"${id}_input\" name=\"${id}_input\" value=\"${preselectedValue}\" class=\"ideo-sug-input\" type=\"text\" onKeyUp=\"SweetDevRia.$('${id}').onInputKeyStroke (event)\" autocomplete=\"off\" onblur=\"SweetDevRia.$('${id}').updateSelectionOnBlur();\"  onfocus=\"SweetDevRia.$('${id}').restoreInputValue();\"/>\
<div id=\"${id}_button\" class=\"ideo-sug-buttonOut\" onmouseover=\"SweetDevRia.$('${id}').setButtonClassName('ideo-sug-buttonOver');\" onmouseout=\"SweetDevRia.$('${id}').setButtonClassName('ideo-sug-buttonOut');\" onclick=\"SweetDevRia.$('${id}').switchSuggestPopupVisibility();\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>\
<div id=\"${id}_input_container\">\
	<input type=\"hidden\" value=\"\" name=\"${id}\"/>\
</div>\
<div id=\"${id}_popup\" class=\"ideo-sug-popup\" style=\"display:none;\">\
	<div id=\"${id}_header\" class=\"ideo-sug-header\">\
	</div>\
	<ul id=\"${id}_suggest\" class=\"ideo-sug-items\">\
	</ul>\
	<div id=\"${id}_pageBar_container\" class=\"ideo-pgb-pagebar\" style=\"display:none;width:auto;\">\
	</div>\
	<div id=\"${id}_footer\" class=\"ideo-sug-footer\">\
	</div>\
</div>\
";