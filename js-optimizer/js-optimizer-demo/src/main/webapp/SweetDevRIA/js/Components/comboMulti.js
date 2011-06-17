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
 * @class ComboMulti
 * @constructor
 * @param {String}	self 		Name of the JavaScript Object
 * @param {String}	domInput 	Graphical input id
 * @param {String}	domData 	Input cache data id
 * @param {String}	divName		Div list name. The surrounding div's name is the same suffixed by 'Container'
 * @param {String}	serviceURL 	webservice's url
 */
SweetDevRia.ComboMulti = function(self, domInput, domData, divName, serviceURL) {
	superClass (this, SweetDevRia.RiaComponent, self, "SweetDevRia.ComboMulti");

    this.strName = self;
    this.domInput = domInput;
    this.domData = domData;
    this.strDivName = divName;
    this.strUrlService = serviceURL;
    this.strLastUrlService = this.strUrlService;
    this.cssStyle = "";
    this.cssStyleClass = "";
    this.enabled = true;
    
    /*
     * Multi-select or single-select mode.
     * @type boolean
     */
    this.multiSelect = true;

    // textes
    this.strTexts = {};

    // Appelle des suggestions
    // Attend 3 secondes pour ??viter de rafra??chir pendant la frappe
    this.intTypeDelay = 1000;
    this.minCharactersTrigger = 3;
    this.strFilterMode = 'startsWith';
    // type de filtre : startsWith | contains | endsWith
    this.boolSingleRequestMode = true;
    // mode "1 requ??te ?? la fois"

    this.strLastInput = '';
    this.strCurrentListFor = '';
    this.thrSuggest = null;
    this.boolIsCaseSensitive = false;
    // Format des donn??es retourn??es
    this.chrDelimiter = '"';
    this.chrSeparator = ';';

    // plus loin : this.filterMatchingRule = this.filterMatchingRuleStartsWithCI;
    this.intActiveRequests = 0;
    // Private : combien de requ??tes en cours de traitement ?

    this.replaceMode = false;

    // stockage des r??sultats en provenance du XML
    this.arrResultsSet = [];
    this.arrResultsSet["for"] = null;
    // r??sultats pour quelle chaine ?
    this.arrResultsSet["truncated"] = false;
    // tous les r??sultats ont-ils ??t?? envoy??s ?
    this.arrResultsSet['results'] = [];
    // r??sultats (objets de type item)

    // Message send from server
    this.arrMessages = [];

    this.arrItemsList = [];
    this.strLastItemSelectedName = '';
    this.arrSelectedItems = [];
    this.arrSelectedItemsLabels = [];

    // la valeur actuellement affich??e dans l'input est-elle un multi formatt?? ?
    this.boolFormattedInput = false;
    this.strLastFormattedInput = '';
    this.boolListShown = false;
    this.boolShowSelection = false;
    // la liste affich??e est-elle la s??lection ?

    this.callbackOnAfterValidate = null;

    this.offsetBetweenListAndInput = 3;

    this.customMessageFormatter = null;

    this.filterMatchingRule = this.filterMatchingRuleStartsWithCI;
    
    /* Server synchronization */
    this.filterModeChanged = false;
    this.caseChanged = false;
};

extendsClass (SweetDevRia.ComboMulti, SweetDevRia.RiaComponent);

SweetDevRia.ComboMulti.prototype.protoItem = function(id, nom) {
    this.id = id;
    this.nom = nom;
};

SweetDevRia.ComboMulti.prototype.clearResults = function() {
    this.arrSelectedItems = [];
    this.arrSelectedItemsLabels = [];
};

SweetDevRia.ComboMulti.prototype.suppressItems = function() {
    this.arrResultsSet['results'] = [];
    this.arrItemsList = [];
};

SweetDevRia.ComboMulti.prototype.addItem = function(id, nom) {
    this.arrResultsSet['results'].push(new this.protoItem(id, nom));
    this.arrItemsList.push(new this.protoItem(id, nom));
};

SweetDevRia.ComboMulti.prototype.protoMessage = function(cssClass, message) {
    this.cssClass = cssClass;
    this.message = message;    
};

SweetDevRia.ComboMulti.prototype.addMessage = function(cssClass, message) {
    this.arrMessages.push(new this.protoMessage(cssClass, message));
};

// method overriden by user

SweetDevRia.ComboMulti.prototype.filterMatchingRuleContainsCI = function(strFor, val) {
    if (val.toLowerCase().indexOf(strFor.toLowerCase()) >= 0) {return true;}
    return false;
};

SweetDevRia.ComboMulti.prototype.filterMatchingRuleContainsCS = function(strFor, val) {
    if (val.indexOf(strFor) >= 0) {return true;}
    return false;
};

SweetDevRia.ComboMulti.prototype.filterMatchingRuleStartsWithCI = function(strFor, val) {
    if (val.toLowerCase().indexOf(strFor.toLowerCase()) === 0) {return true;}
    return false;
};

SweetDevRia.ComboMulti.prototype.filterMatchingRuleStartsWithCS = function(strFor, val) {
    if (val.indexOf(strFor) === 0) {return true;}
    return false;
};

SweetDevRia.ComboMulti.prototype.filterMatchingRuleEndsWithCI = function(strFor, val) {
    if (val.toLowerCase().indexOf(strFor.toLowerCase()) === (val.length - strFor.length)) {return true;}
    return false;
};

SweetDevRia.ComboMulti.prototype.filterMatchingRuleEndsWithCS = function(strFor, val) {
    if (val.indexOf(strFor) === (val.length - strFor.length)) {return true;}
    return false;
};

// Tente de filtrer cot?? client
SweetDevRia.ComboMulti.prototype.filterResultsFromCache = function(strFor) {
    // le cache contient des donn??es non tronqu??es
    //    ou la demande est identique au cache m??me si r??sultats tronqu??s
    if ((this.arrResultsSet['results'] !== null)  && ( !this.arrResultsSet['truncated'] || this.compareCaseSensitive(this.arrResultsSet['for'], strFor))) {
        // ce qu'on cherche est contenu dans le cache

        if (this.containsCaseSensitive(this.arrResultsSet['for'], strFor)) {
            this.arrItemsList = [];
            // filtre
            for (var i = 0; i < this.arrResultsSet['results'].length; i++) {
                if (this.filterMatchingRule(strFor, this.arrResultsSet['results'][i].nom)) {
                    this.arrItemsList.push(this.arrResultsSet['results'][i]);
                }
            }

            this.refreshList(false);
            this.strCurrentListFor = strFor;
            return true;
        }
    }
    return false;
};

SweetDevRia.ComboMulti.prototype.serializeResponse = function() {
    var tmp = '';
    var del = this.chrDelimiter;
    var sep = this.chrSeparator;
    for (var i = 0; i < this.arrSelectedItems.length; i++) {
        tmp += (i > 0 ? sep : '') + del + this.arrSelectedItems[i] + del;
    }
    SweetDevRia.DomHelper.get(this.domData).value = tmp;
};


// v??rifie si un portefeuille est s??lectionn??.
// renvoie son id ou -1 s'il est absent
SweetDevRia.ComboMulti.prototype.isInSelection = function(id) {
    for (var i = 0; i < this.arrSelectedItems.length; i++) {
        if (this.arrSelectedItems[i] === id) {
            return i;
        }
    }
    return -1;
};


SweetDevRia.ComboMulti.prototype.updateServerParams = function(){
	if(this.filterModeChanged || this.caseChanged){
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("updateServerModel", this.strName, {"sendServer":true , "filterMode":this.strFilterMode, "case":this.boolIsCaseSensitive,"synchroCall":true}));
		this.filterModeChanged = false;
		this.caseChanged = false;
	}
};


SweetDevRia.ComboMulti.prototype.suggest = function() {
    var input = SweetDevRia.DomHelper.get(this.domInput).value;

    window.clearTimeout(this.thrSuggest);
    if (input.length >= this.minCharactersTrigger) {
    
    	var inputHasChanged = !this.compareCaseSensitive(input, this.strCurrentListFor);
    	var urlToCall = this.handleDynamicParam();
    	var urlHasChanged = this.doINeedToDestroyCacheDueToDynamicParam(urlToCall);
    
		if (inputHasChanged || urlHasChanged) {
            if (this.replaceMode){
            	this.clearResults();
            }
            if (urlHasChanged || !this.filterResultsFromCache(input)) {
                this.setStrLastInput(input);
                this.setStrUrlService(urlToCall);
                this.thrSuggest = setTimeout('SweetDevRia.$(\''+this.strName + '\').executeSuggest(false)', this.intTypeDelay);
            }
        } else {
            this.showSuggestsList();
        }
    } else {
        this.arrItemsList = [];
        this.hideSuggestsList();
    }
};

// renvoie true si l'appel a ??t?? ??x??cut??
SweetDevRia.ComboMulti.prototype.executeSuggest = function(force) {
    // blocage quand boolSingleRequestMode
    // (?? la fin de la requ??te active, une synchro sera ??x??cut??e dans sendData > done)
    if (this.boolSingleRequestMode && this.intActiveRequests > 0) {
        return false;
    }

    var urlToCall = this.prepareUrl(force);

    this.intActiveRequests++;
    // fin boolSingleRequestMode

	this.updateServerParams();

    ComboMulti_sendData(urlToCall, 'GET', force, this.strName);

    return true;
};

/**
 * Transform dynamic parameter, add filter and comboMulti id.
 * @return URL ready to use to get XML
 */
SweetDevRia.ComboMulti.prototype.prepareUrl = function(force) {
    var urlToCall = this.handleDynamicParam();
    var input = SweetDevRia.DomHelper.get(this.domInput).value;
    var op = '?';

    if (urlToCall.indexOf('?') !== -1) {
        op = '&';
    }
    var param = op + 'id=' + this.strName;
    if (!force) {
        if (!this.compareCaseSensitive(input, this.strLastInput)) {
            return false;
        }
        param += '&for=' + escape(this.strLastInput);
    }

	param += '&__RiaPageId='+ __RiaPageId;

	return urlToCall + param;
};

/**
 *
 */
SweetDevRia.ComboMulti.prototype.doINeedToDestroyCacheDueToDynamicParam = function(urlToCall) {
	var ret = true;
	if (this.strLastUrlService == urlToCall) {
		ret = false;
	}
	return ret;
};

/**
 * Transform dynamic parameter (like {idHtmlElement}) on URL parameter (like &idHtmlElement=HtmlValue).
 * @return converted URL
 */
SweetDevRia.ComboMulti.prototype.handleDynamicParam = function() {
	var begIdx = 0, endIdx = -1;
	var workUrl = this.strUrlService,
		begUrl, endUrl;

    while ( (begIdx = workUrl.indexOf('{', begIdx)) !== -1) {
			begIdx++;
    	if ((endIdx = workUrl.indexOf('}', begIdx)) !== -1) {
    		var htmlId = workUrl.substring(begIdx, endIdx);
    		var htmlEl = SweetDevRia.DomHelper.get(htmlId);
			if( htmlEl ) {
				if( htmlEl.value !== "" ) {
	    			begUrl = workUrl.substring(0, begIdx-1);
    				endUrl = workUrl.substring(endIdx+1);
    				workUrl = begUrl + htmlId + '=' + htmlEl.value + endUrl;
				}
    		} else {
				SweetDevRia.log.warn("HTML element with Id='" + htmlId + "' was not found on page.");
    			workUrl = workUrl.replace('&{' + htmlId + '}', '');
    		}
			begIdx = 0;
    	}
    }

	return workUrl;
};

// Qd click sur portefeuille. Si pr??sent dans la s??lection, il vire, sinon on l'ajoute
SweetDevRia.ComboMulti.prototype.clickOnItem = function(id, value,divPortefeuille , inSelectList) {
    var isPresent = this.isInSelection(id);
    if (isPresent > -1) {
        this.arrSelectedItems.splice(isPresent, 1);
        this.arrSelectedItemsLabels.splice(isPresent, 1);
        isPresent = false;
    } else {
		/* Empty selection if single selection and a row is selected */
		if (this.multiSelect === false && this.arrSelectedItems.length !== 0) {
			this.clearResults();
		}

 		if (value == null) {
		   value = divPortefeuille.innerHTML;
		}
 
        this.arrSelectedItems.push(id);
        this.arrSelectedItemsLabels.push(value);
        this.strLastItemSelectedName = value;
        isPresent = true;
    }

	if  (divPortefeuille) {
	    this.changeItemBg(divPortefeuille, (isPresent ? 'selected' : 'hover'), -1);
	}

    // Faire deux cas :
    //	clic sur ??l??ment de la s??lection : v??rifie si le m??me ??l??ment est dans la liste
    if (inSelectList) {
        var tmp2 = SweetDevRia.DomHelper.get('item' + this.strName + id);
        if (tmp2) {
            this.changeItemBg(tmp2, (isPresent ? 'selected' : 'normal'), -1);
        }
    } else {
        // clic sur ??l??ment de liste : it??ration sur tous les ??l??ments de la s??lection
        var tmp3 = SweetDevRia.DomHelper.get('itemSel' + this.strName + id);
        if (tmp3) {
            this.changeItemBg(tmp3, (isPresent ? 'selected' : 'normal'), -1);
        }
    }

    if (this.arrSelectedItems.length > 0) {
        if (this.disabledButton) { 
        	this.disabledButton.style.display = 'none';
        }
        if (this.enabledButton) {
          this.enabledButton.style.display = '';
		}
    } else {
        if (this.enabledButton) {
          this.enabledButton.style.display = 'none';
		}
        if (this.disabledButton) { 
          this.disabledButton.style.display = '';
		}
    }

	/* Close box if multiSelect attribute is false */
	if (this.multiSelect === false && this.arrSelectedItems.length !== 0) {
        this.validateSelection();
	}

	return true;
};

// Change l'apparence visuel d'un item en fonction de sa pr??sence dans la s??lection
// id = -1 pour forcer le changement et outrepasser les r??gles (??vite des doubles v??rifs).
SweetDevRia.ComboMulti.prototype.changeItemBg = function(div, state, id) {
    switch (state) {
        case 'hover':
            if ((id !== "") && (this.isInSelection(id) > -1)){
            	return;
            }
            break;
        case 'normal':
            if ((id !== "") && (this.isInSelection(id) > -1)){
            	return;
            }
            break;
        default:
            break;
    }
    div.className = state;
};

SweetDevRia.ComboMulti.prototype.getItemHTML = function(itemId, divId, label, inSelectList, cssclass) {
    var html = '<div name="' + itemId + '" id="' + divId + '"  class="' + cssclass + '" ';
    html += 'onmouseover="SweetDevRia.$(\'' + this.strName + '\').changeItemBg(this, \'hover\', \'' + itemId + '\');" ';
    html += 'onmouseout="SweetDevRia.$(\'' + this.strName + '\').changeItemBg(this, \'normal\', \'' + itemId + '\');" ';
    html += 'onclick="tmp=SweetDevRia.$(\'' + this.strName + '\').clickOnItem(\'' + itemId + '\', null, this, ' + inSelectList + ');" ';
    html += '>' + label + '</div>';
    return html;
};

SweetDevRia.ComboMulti.prototype.refreshList = function(onlySelection) {
    var html = '';

    // Affiche la s?lection
    if (this.arrSelectedItems && this.arrSelectedItems.length > 0) {
        html += '<div class="selectionList">';
        var tmpDivPrefix = 'itemSel' + this.strName;
        for (var i = 0; i < this.arrSelectedItems.length; i++) {
            id = this.arrSelectedItems[i];
            html += this.getItemHTML(id, tmpDivPrefix + id, this.arrSelectedItemsLabels[i], true, (this.arrSelectedItems.contains(id) ? 'selected' : 'normal'));
        }
        html += '</div>';
        html += '<div class="ideo-cbo-listSeparator"></div>';
    }

    // Affiche les messages re??us par le serveur
    var msgCtr = SweetDevRia.DomHelper.get('comboMultiMessagesContainer');
    msgCtr.innerHTML = "";
    for (var j = 0; j < this.arrMessages.length; j++) {
        var msgToShow = this.arrMessages[j].message;
        if (this.customMessageFormatter) {
            msgToShow = this.customMessageFormatter(this.arrMessages[j].cssClass, this.arrMessages[j].message);
        }
        msgCtr.innerHTML += "<div class='" + this.arrMessages[j].cssClass + "'>" + msgToShow + "</div>";
    }

    if (!onlySelection) {
        // Affiche la liste re??ue par le serveur
        tmpDivPrefix = 'item' + this.strName;
        for (var k = 0; k < this.arrItemsList.length; k++) {
            var id = this.arrItemsList[k].id;
            html += this.getItemHTML(id, tmpDivPrefix + id, this.arrItemsList[k].nom, false, (this.arrSelectedItems.contains(id) ? 'selected' : 'normal'));
        }
        if (this.arrResultsSet['truncated']) {
            html += '<span class="ideo-cbo-trunc">' + this.strTexts['truncatedNotice'] + '</span>';
        }
    }


    SweetDevRia.DomHelper.get(this.strDivName).innerHTML = html;
    this.showSuggestsList();

    this.boolShowSelection = onlySelection;
};

SweetDevRia.ComboMulti.prototype.validateSelection = function() {
    this.hideSuggestsList();

    var tmp = this.getFormattedInput();
    this.strLastFormattedInput = tmp;
    SweetDevRia.DomHelper.get(this.domInput).value = tmp;
    this.serializeResponse();
    
    var arrSelectedItemsString = this.arrSelectedItems.toString();
    var arrSelectedItemsLabelsString = this.arrSelectedItemsLabels.toString();

	this.updateServerModel("textfieldValue", SweetDevRia.DomHelper.get(this.domInput).value);
	this.updateServerModel("strLastItemSelectedName", this.strLastItemSelectedName);
	this.updateServerModel("arrSelectedItems", arrSelectedItemsString);
	this.updateServerModel("arrSelectedItemsLabels", arrSelectedItemsLabelsString);

    /* user callback */
    if (this.callbackOnAfterValidate !== null) {
        this.callbackOnAfterValidate();
    }
	
	this.fireEventListener ("change");

};


// Formatte la valeur de l'input apr??s validation
SweetDevRia.ComboMulti.prototype.getFormattedInput = function() {
    this.boolFormattedInput = false;
    if (this.arrSelectedItems.length === 0){
    	return '';
   	}

    this.boolFormattedInput = true;
    if (this.arrSelectedItems.length > 1){
        return this.strTexts['inputFormatterMulti'].replace(/%d/, this.arrSelectedItems.length);
	}
	
    if (this.arrSelectedItems.length === 1){
        return this.strLastItemSelectedName;
    }
};

SweetDevRia.ComboMulti.prototype.showSelectionSwitch = function() {

    if (this.boolShowSelection) {
        this.hideSuggestsList();
    } else {
        this.refreshList(true);
    }
};

SweetDevRia.ComboMulti.prototype.showSelection = function() {
    this.serializeResponse();
};

SweetDevRia.ComboMulti.prototype.allUnSelect = function() {
    this.strLastItemSelectedName = '';
    this.arrSelectedItems = [];
    this.arrSelectedItemsLabels = [];
    SweetDevRia.DomHelper.get(this.domInput).value = this.strLastInput;
    this.refreshList(false);
    if (this.disabledButton) {
    	this.disabledButton.style.display = '';
    }
    if (this.enabledButton) {
    	this.enabledButton.style.display = 'none';
    }
};


SweetDevRia.ComboMulti.prototype.showSuggestsList = function() {
    if (!this.boolListShown) {
        var container = SweetDevRia.DomHelper.get(this.strDivName + 'Container'),
        input = SweetDevRia.DomHelper.get(this.domInput);
		container.style.top = input.offsetHeight + this.offsetBetweenListAndInput;
        container.parentNode.style.zIndex = SweetDevRia.DisplayManager.getInstance().getTopZIndex(true);
        container.style.display = 'block';
        SweetDevRia.DomHelper.get(this.strDivName + '_invisibleFrame').style.height = (container.offsetHeight + 5)+ "px";
        this.boolListShown = true;
    }

    /* BUG FIX IE SELECT */
    /* Hide all selects on IE 4, 5, 5.5 */
    SweetDevRia.LayoutManager.changeSelectVisibility(document, false);
    /* On IE 6, apply a transparent iframe on each window */
    SweetDevRia.LayoutManager.addMaskIFrame(this.strDivName, SweetDevRia.DomHelper.get(this.strDivName + 'Container'));
    
    
	SweetDevRia.setInstance (this.className, this.id);
    //comboMultiManager.presentList.register(this.strName);
    
    this.setActive (true);
};

SweetDevRia.ComboMulti.prototype.hideSuggestsList = function() {

    /* BUG FIX IE SELECT */
    //comboMultiManager.presentList.unregister(this.strName);
    SweetDevRia.removeInstance (this.className, this.strName);
    
    if (SweetDevRia.size(this.className) === 0) {
        /* Show all select boxes precedently hidden on IE 4, 5, 5.5 */
        SweetDevRia.LayoutManager.changeSelectVisibility(document, true);
    }
    SweetDevRia.LayoutManager.removeTransparentIFrame(this.strDivName, SweetDevRia.DomHelper.get(this.strDivName + 'Container'));

    SweetDevRia.DomHelper.get(this.strDivName + 'Container').style.display = 'none';
    SweetDevRia.DomHelper.get(this.strDivName + 'Container').parentNode.style.zIndex = 0;
    this.boolListShown = false;
    this.boolShowSelection = false;
    
    this.setActive (false);
    
};


SweetDevRia.ComboMulti.prototype.cancel = function() {
    this.allUnSelect();
    this.hideSuggestsList();
    this.strLastFormattedInput = SweetDevRia.DomHelper.get(this.domInput).value = SweetDevRia.DomHelper.get(this.domData).value = '';
};

SweetDevRia.ComboMulti.prototype.EvtFocus = function() {
    if (this.boolFormattedInput) {
        SweetDevRia.DomHelper.get(this.domInput).value = '';
        this.boolFormattedInput = false;
    }
};

SweetDevRia.ComboMulti.prototype.EvtBlur = function() {
    if (!this.boolListShown) {
        SweetDevRia.DomHelper.get(this.domInput).value = this.strLastFormattedInput;
        this.boolFormattedInput = true;
    }
};

SweetDevRia.ComboMulti.prototype.getHTML = function() {
	var html = '<div style="display : inline;position:relative;">';
    html += '<input name="' + this.domInput + '" autocomplete="off" type="text" id="' + this.domInput + '" onkeyup="SweetDevRia.$(\'' + this.strName + '\').suggest()" onfocus="SweetDevRia.$(\'' + this.strName + '\').EvtFocus()" onblur="SweetDevRia.$(\'' + this.strName + '\').EvtBlur()" '+ ((this.enabled === false) ? ' disabled ' : '') +' style="' + this.textfieldStyle + '" class="' + this.textfieldStyleClass + '" value="' + this.textfieldValue + '">';
    html += '<div id="' + this.strDivName + 'Container" class="ideo-cbo-container '+ this.cssStyleClass +'" style="'+ this.cssStyle +'display : none;position : absolute;left:0px;top:100%;">';
    html += '<iframe id="' + this.strDivName + '_invisibleFrame" style="position:absolute;top:-2px;left:-2px;width:105%;height:105%;z-index : -1;border : none;padding : 0px 0px 0px 0px;filter : alpha(opacity=0);-moz-opacity: 0;opacity: 0;background-color:blue;" src="about:blank"></iframe>';
    if (this.strTexts['title'] && this.strTexts['title'] !== ""){
        html += '<div class="comboMulti">' + this.strTexts['title'] + '</div>';
    }
    html += '<div class="ideo-cbo-sugg" id="' + this.strDivName + '"></div>';
    html += '<div class="ideo-cbo-btnContainer">';

	if (this.multiSelect === true) {
	    html += '<input class="ideo-cbo-btn" type="button" value="' + this.strTexts['btnValid'] + '" onclick="SweetDevRia.$(\'' + this.strName + '\').validateSelection()"/>';
	    html += '<input class="ideo-cbo-btn" type="button" value="' + this.strTexts['btnSelectAll'] + '" onclick="SweetDevRia.$(\'' + this.strName + '\').selectAll()"/>';
	}
    html += '<input class="ideo-cbo-btn" type="button" value="' + this.strTexts['btnAllUnselect'] + '" onclick="SweetDevRia.$(\'' + this.strName + '\').allUnSelect();"/>';
    html += '<input class="ideo-cbo-btn" type="button" value="' + this.strTexts['btnCancel'] + '" onclick="SweetDevRia.$(\'' + this.strName + '\').cancel();"/>';
    html += '<input type="hidden" id="' + this.domData + '" name="' + this.domData + '" />';
    html += '</div>';
    html += '<div id="comboMultiMessagesContainer" class="ideo-cbo-msgContainer"></div>';
    html += '</div>';
	html += '</div>';

    return html;
};


SweetDevRia.ComboMulti.prototype.loadingStarted = function(force) {
    this.showSuggestsList();
    if (this.strLastInput && this.strLastInput.length > 0){
        SweetDevRia.DomHelper.get(this.strDivName).innerHTML = this.strTexts['loadingForText'] + ' ' + ((force) ? '*' : this.strLastInput);
    }
    else{
        SweetDevRia.DomHelper.get(this.strDivName).innerHTML = this.strTexts['loadingText'];
    }
};

SweetDevRia.ComboMulti.prototype.loadingEnded = function() {
  null;
};

// Private setters
SweetDevRia.ComboMulti.prototype.setStrCurrentListFor = function(str) {
    this.strCurrentListFor = (this.boolIsCaseSensitive ? str : str.toLowerCase() );
};

SweetDevRia.ComboMulti.prototype.setStrLastInput = function(str) {
    this.strLastInput = (this.boolIsCaseSensitive ? str : str.toLowerCase() );
};

SweetDevRia.ComboMulti.prototype.setStrUrlService = function(strLastUrl) {
	this.strLastUrlService = strLastUrl;
};

SweetDevRia.ComboMulti.prototype.compareCaseSensitive = function(s1, s2) {
    if (s1 === null || s2 === null){
    	return false;
    }
    return (this.boolIsCaseSensitive ? (s1 === s2 ) : ( s1.toLowerCase() === s2.toLowerCase() ) );
};

SweetDevRia.ComboMulti.prototype.containsCaseSensitive = function(strFind, strIn) {
    if (strFind === null || strIn === null){
    	return false;
    }
    if (this.boolIsCaseSensitive){
    	return (strIn.indexOf(strFind) > -1);
    }
    else{
    	return (strIn.toLowerCase().indexOf(strFind.toLowerCase()) > -1);
    }
};
// Setters

SweetDevRia.ComboMulti.prototype.setTypeDelay = function(val) {
    this.intTypeDelay = val;
};

SweetDevRia.ComboMulti.prototype.setTitleText = function(val) {
    this.strTexts['title'] = val;
};

SweetDevRia.ComboMulti.prototype.setValidBtnText = function(val) {
    this.strTexts['btnValid'] = val;
};

SweetDevRia.ComboMulti.prototype.setSelectAllBtnText = function(val) {
    this.strTexts['btnSelectAll'] = val;
};

SweetDevRia.ComboMulti.prototype.setCancelBtnText = function(val) {
    this.strTexts['btnCancel'] = val;
};

SweetDevRia.ComboMulti.prototype.setAllUnselectBtnText = function(val) {
    this.strTexts['btnAllUnselect'] = val;
};

SweetDevRia.ComboMulti.prototype.setTruncatedNoticeText = function(val) {
    this.strTexts['truncatedNotice'] = val;
};

SweetDevRia.ComboMulti.prototype.setMinCharactersTrigger = function(val) {
    this.minCharactersTrigger = val;
};

SweetDevRia.ComboMulti.prototype.setResponseDelimiter = function(val) {
    this.chrDelimiter = val;
};

SweetDevRia.ComboMulti.prototype.setResponseSeparator = function(val) {
    this.chrSeparator = val;
};

SweetDevRia.ComboMulti.prototype.setReplaceMode = function(val) {
    this.replaceMode = val;
};

SweetDevRia.ComboMulti.prototype.setCssStyle = function(val) {
    this.cssStyle = val;
};

SweetDevRia.ComboMulti.prototype.setCssStyleClass = function(val) {
    this.cssStyleClass = val;
};

SweetDevRia.ComboMulti.prototype.setEnabled = function(enabled) {
    this.enabled = enabled;
};

SweetDevRia.ComboMulti.prototype.updateFilterRule = function() {
    switch (this.strFilterMode) {
        case 'contains':
            this.filterMatchingRule = (this.boolIsCaseSensitive) ? this.filterMatchingRuleContainsCS : this.filterMatchingRuleContainsCI;
            break;
        case 'endsWith':
            this.filterMatchingRule = (this.boolIsCaseSensitive) ? this.filterMatchingRuleEndsWithCS : this.filterMatchingRuleEndsWithCI;
            break;
        case 'startsWith':
        default:
            this.filterMatchingRule = (this.boolIsCaseSensitive) ? this.filterMatchingRuleStartsWithCS : this.filterMatchingRuleStartsWithCI;
            break;
    }
};

SweetDevRia.ComboMulti.prototype.setFilterMode = function(val) {
	this.initFilterMode(val);
};

SweetDevRia.ComboMulti.prototype.initFilterMode = function(val) {
    if(val != this.strFilterMode){
    	this.filterModeChanged = true;
    }
    
    switch (val) {
        case 'contains': this.strFilterMode = 'contains';    break;
        case 'endsWith': this.strFilterMode = 'endsWith';    break;
        case 'startsWith':
        default:
            this.strFilterMode = 'startsWith';                break;
    }
        
    this.updateFilterRule();
};


SweetDevRia.ComboMulti.prototype.initCaseSensitiveMode = function(boolCS) {
	if(boolCS != this.boolIsCaseSensitive){
		this.caseChanged = true;
	}

    this.boolIsCaseSensitive = boolCS;    
    this.updateFilterRule();
};

SweetDevRia.ComboMulti.prototype.setCaseSensitiveMode = function(boolCS) {
    this.initCaseSensitiveMode(boolCS);
};

SweetDevRia.ComboMulti.prototype.setSingleRequestMode = function(val) {
    this.boolSingleRequestMode = val;
};

SweetDevRia.ComboMulti.prototype.setCustomMessageFormatter = function(functionName) {
    this.customMessageFormatter = functionName;
};

SweetDevRia.ComboMulti.prototype.setCallBackOnAfterValidate = function(OnAfterValidate) {
    this.callbackOnAfterValidate = OnAfterValidate;
};


SweetDevRia.ComboMulti.prototype.handleEvent  = function(evt) {
	if (evt && evt.type) {
		if (evt.type == SweetDevRia.RiaEvent.KEYBOARD_TYPE) {
			if (evt.keyCode == SweetDevRia.KeyListener.ESCAPE_KEY) {
				var isActive = this.isActive ();
				if (isActive) {
					this.setActive (false);
					this.hideSuggestsList ();
					SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
					SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
					return false;
				}
			}
		}
	}
	return true;
};

/** 
 * Permet d'envoyer des donn es en GET ou POST en utilisant les XmlHttpRequest
 */
function ComboMulti_sendData(sUri, method, force, instanceName){
    var comboMulti = SweetDevRia.$(instanceName);
    var xmlHttp = SweetDevRia.AjaxPooler.getInstance();
    var done = function() {
        var tmp = '';
        var suggestFor = null;
        var truncated = true;
        comboMulti.intActiveRequests--;
        comboMulti.loadingEnded();
        if (xmlHttp.getResponseText() !== '') {
            var xmlDoc = xmlHttp.getResponseXML();
            var root = xmlDoc.getElementsByTagName('items');
            if (root.length > 0) {

                truncated = (root.item(0).getAttribute('truncated') === 'false') ? false : true;
                var suggestsFor = root.item(0).getAttribute('for');

                if (force || ( comboMulti.compareCaseSensitive(SweetDevRia.DomHelper.get(comboMulti.domInput).value, suggestsFor))) {
                    var port = xmlDoc.getElementsByTagName('item');
                    // destroy cache
                    comboMulti.suppressItems();
                    for (var i = 0; i < port.length; i++) {
                        var id = port.item(i).attributes[0].value;
                        var nom = port.item(i).firstChild.data;
                        // cache data add to HTML combo
                        comboMulti.addItem(id, nom);
                    }

                    comboMulti.arrResultsSet['truncated'] = truncated;
                    comboMulti.arrResultsSet['for'] = suggestsFor;
                    comboMulti.strCurrentListFor = suggestsFor;

                    // On enregistre les messages provenant du serveur
                    comboMulti.arrMessages = [];
                    var msgs = xmlDoc.getElementsByTagName('message');
                    for (var j = 0; j < msgs.length; j++) {
                        var cssClass = msgs.item(j).attributes[0].value;
                        var message = msgs.item(j).firstChild.data;
                        comboMulti.addMessage(cssClass, message);
                    }

                    comboMulti.refreshList(false);

                } else {
                    if (comboMulti.boolSingleRequestMode) {
                        comboMulti.suggest();
                    }
                }
            } 

        }
    };

    comboMulti.loadingStarted(force);
    xmlHttp.setCallback(done);
    xmlHttp.send(method, sUri, true);
}

SweetDevRia.ComboMulti.prototype.setTextfieldStyle = function(style){
	this.textfieldStyle = style;
};

SweetDevRia.ComboMulti.prototype.setTextfieldStyleClass = function(styleClass){
	this.textfieldStyleClass = styleClass;
};

SweetDevRia.ComboMulti.prototype.setTextfieldValue = function(value){
	this.textfieldValue = value;
};

SweetDevRia.ComboMulti.prototype.selectAll = function(){
	var node = document.getElementById(this.strDivName);
	for(var i=0;i<node.childNodes.length;i++){
		var id = node.childNodes[i].getAttribute("name");
		if((id === undefined) || (id === null)){
			continue;
		}
		var divPortefeuille = node.childNodes[i];
	    var isPresent = this.isInSelection(id);
	    if (isPresent > -1) {
	    	continue;
	    }else{
	        var tmp = divPortefeuille.innerHTML;
	        this.arrSelectedItems.push(id);
	        this.arrSelectedItemsLabels.push(tmp);
	        this.strLastItemSelectedName = tmp;
	        isPresent = true;	    
	    }
	    divPortefeuille.className = "selected";
	}
};
