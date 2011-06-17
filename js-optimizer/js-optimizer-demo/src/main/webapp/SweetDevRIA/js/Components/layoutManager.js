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

SweetDevRia.LayoutManager = new Object();

SweetDevRia.LayoutManager = {

    /*
     * renvoie la hauteur de l'espace interne de la fen?tre // sert au centrage
     */
    getViewportHeight: function() {
        if (window.innerHeight != window.undefined){ return window.innerHeight;}
        if (document.compatMode == 'CSS1Compat'){ return document.documentElement.clientHeight;}
        if (document.body){ return document.body.clientHeight;}
        return window.undefined;
    },

    /*
     * renvoie la largeur de l'espace interne de la fen?tre // sert au centrage
     */
    getViewportWidth: function() {
        if (window.innerWidth != window.undefined){ return window.innerWidth; }
        if (document.compatMode == 'CSS1Compat'){ return document.documentElement.clientWidth;}
        if (document.body){ return document.body.clientWidth;}
        return window.undefined;
    },

    /*
     * On IE < 6, change the visibility of all SELECT contained into HTML element wich are not hidden.
     * el : HTML element wich contains (or not) SELECT fields
     * state : true or false
     */
    changeSelectVisibility: function(el, visible) {
        if (!browser.isIE || el === null){
            return;
        }

        var visibility = (visible == true) ? '' : 'hidden',
            selects = el.getElementsByTagName('SELECT');
        for (var e = 0; e < selects.length; e++) {
            if (browser.version < 6) {

                var selectVisi = selects[e].style.visibility,
                    anteriorVisibility = selects[e].getAttribute("anteriorVisibility");

                if (!visible) {
                    if (selectVisi !=  'hidden') {
                        selects[e].style.visibility = visibility;
                        selects[e].setAttribute('anteriorVisibility', 'true');
                    }
                } else {
                    if (anteriorVisibility) {
                        selects[e].style.visibility = visibility;
                    }
                }
            }
        }
    },

    /*
     * On IE 6, disabled SELECT contained in the HTML element
     * el : HTML element wich contains (or not) SELECT fields
     * state : true or false
     */
    changeSelectState: function(el, state) {
        if (!browser.isIE || el === null){
            return;
        }

        var selects = el.getElementsByTagName('SELECT');
        for (var e = 0; e < selects.length; e++) {
            if (browser.version == 6) {
                 /* Disabling select on IE 6 for modal windows */
                var disabled = selects[e].getAttribute("disabled"),
                    anteriorDisabled = selects[e].getAttribute("anteriorDisabled");

                if (!state) {
                    if (!disabled) {
                        selects[e].setAttribute('disabled', 'true');
                        selects[e].setAttribute('anteriorDisabled', 'true');
                    }
                } else {
                    if(anteriorDisabled) {
                        selects[e].removeAttribute('disabled');
                    }
                }
            }
        }
    },

    /*
     * Add a iframe behind an HTML objet, to fix the display bug width SELECT and APPLET.
     * id : unique id to create the iframe
     * obj : HTML object on wich put a iframe behind
     */
    addMaskIFrame: function(id, obj) {
        if (!browser.isIE){
            return;
        }

        var iframe = SweetDevRia.DomHelper.get(id + '-iframe-mask');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.setAttribute('id', id + '-iframe-mask');
            iframe.setAttribute('src', '');
            iframe.setAttribute('scrolling', 'no');
            iframe.setAttribute('frameBorder', '0');
            iframe.style.position = 'absolute';
            iframe.style.display = 'none';
            iframe.style.filter = 'alpha(opacity=0)';
            document.body.appendChild(iframe);
        }

        this.moveIFrame(id, obj);
        this.setIFrameZIndex(id, obj);
        iframe.style.display = "block";
    },

    /*
     * Remove the iframe set behing an HTML object.
     * id : unique id to remove the iframe
     * obj : HTML object on wich remove the iframe
     */
    removeTransparentIFrame: function(id, obj) {
        if (!browser.isIE){
            return;
        }

        var iframe = SweetDevRia.DomHelper.get(id + '-iframe-mask');
        if (iframe){
            iframe.style.display = "none";
        }
    },

    /*
     * Move the iframe.
     * id : unique id to identify the iframe
     * obj : HTML object on wich remove the iframe
     */
    moveIFrame: function(id, obj) {
        if (!browser.isIE){
            return;
		}
		
        var iframe = SweetDevRia.DomHelper.get(id + '-iframe-mask');

        if (iframe) {
            iframe.style.width = obj.offsetWidth;
            iframe.style.height = obj.offsetHeight;
            iframe.style.top = obj.offsetTop;
            iframe.style.left = obj.offsetLeft;
        }
    },

    /*
     * Change the ZIndex of the iframe
     * id : unique id to identify the iframe
     * obj : HTML object on wich remove the iframe
     */
    setIFrameZIndex: function(id, obj) {
        if (!browser.isIE){
            return;
        }
        
        var iframe = SweetDevRia.DomHelper.get(id + '-iframe-mask');

        if (iframe) {
            iframe.style.zIndex = obj.style.zIndex - 1;
        }
    }
};
