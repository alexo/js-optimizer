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
 * Copy the parameter array into this array.
 * @param array source array.
 */
Array.prototype.copy = function (array) {
	this.length = 0;
	for(var i = 0; i < array.length; i++) {
		this[i] = array[i];
	}
};

/*
 * Search for value 'value' inside array
 * @param {String} value Value searched inside the array.
 * @return True if found, false else.
 * @type boolean
 */
Array.prototype.contains = function(value) {
    for (var i=0; i<this.length; i++) {
        if (this[i] == value) {
            return true;
        }
    }
    return false;
};

/**
 * Remove first 'value' found in array
 * @param {String} value Value searched inside the array.
 * @return True if found and removed, false else.
 * @type boolean
 */
Array.prototype.remove = function(value) {
    for (var i=0; i<this.length; i++) {
        if (this[i] == value) {
            this.splice(i, 1);
            return true;
        }
    }
    return false;
};

/**
 * Add 'value' in array
 * @param {String} value Value to add.
 */
Array.prototype.add = function(value) {
   this[this.length] = value; 
};

/**
 * Insert a 'value' at a specified index in array
 * @param {String} value	Value to insert.
 * @param {int} index		The index where the value must be inserted
 * @return the Array into which the insert has been processed.
 * @type Array
 */
Array.prototype.insertAt = function(value, index) {
	if (index < 0){
		index = 0;
	}
	if (index > this.length){
		index = this.length;
	}
	
	var copy = [];
	copy.copy (this);
	
	this [index] = value;
	for (var i = index; i < copy.length; i++) {
		this [i+1] = copy [i];
	}
	
	return this;

};

/**
 * Returns a recusiv view of some array nested
 * @param {Array} tab	the array to get a view of
 * @return the string resulting of the tab concatenation
 * @type String
 * @static
 */
function displayTab(tab) {
	var str = "";
	if (tab) {
		str += "[";
		
		for (var i = 0; i < tab.length; i++) {
			if (i > 0){ str+=", ";}
			if (tab [i].reverse) {
				str+= displayTab (tab [i]);
			}
			else {
				str+= tab [i];
			}
		}
		
		str += "]";
	}
	
	return str;	
}


