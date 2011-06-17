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
 * @class Utility class in order to produce completed message from string with parameters ({0}, {1}, etc).
 * This class can now handle until 5 parameters.
 * @constructor 
 */   
SweetDevRia.MessageHelper = function() {
  /** MessageHelper instance */
   this._instance = null;     
};

/** Singleton */
SweetDevRia.MessageHelper._instance = new SweetDevRia.MessageHelper ();
SweetDevRia.MessageHelper.getInstance = function () {
	return SweetDevRia.MessageHelper._instance;
};


/**
 * Return messages after fill optional parameter get from MessageHelper
 * @param {String} message Message to return after completion
 * @param {String} param1 Value for field {0} for message @key 
 * @param {String} param2 Value for field {1} for message @key
 * @param {String} param3 Value for field {2} for message @key
 * @param {String} param4 Value for field {3} for message @key
 * @param {String} param5 Value for field {4} for message @key
 * @return Completed message, else null.
 * @type String 
 */  
SweetDevRia.MessageHelper.prototype.getMessage = function(message, param1, param2, param3, param4, param5) {
  /** If message is not null, it filled optional parameters */
  if (message !== null) {
    /** Fill optional parameters */
    message = this.completeAllParams (message, param1, param2, param3, param4, param5);
  }

  /** return completed message */
  return message;
};


/**
 * Return messages after fill optional parameter get from MessageHelper
 * @param {String} message Message to return after completion
 * @param {String} param1 Value for field {0} for message @key 
 * @param {String} param2 Value for field {1} for message @key
 * @param {String} param3 Value for field {2} for message @key
 * @param {String} param4 Value for field {3} for message @key
 * @param {String} param5 Value for field {4} for message @key
 * @return Completed message, else null.
 * @type String 
 */  
SweetDevRia.MessageHelper.prototype.completeAllParams  = function(message, param1, param2, param3, param4, param5) {
  message = this.completeParam (message, param1, 0);
  message = this.completeParam (message, param2, 1);
  message = this.completeParam (message, param3, 2);
  message = this.completeParam (message, param4, 3);
  message = this.completeParam (message, param5, 4);
  /** return completed message */
  return message;
};


/**
 * Compete a specific parameter in a message
 * @param {String} message message to complete
 * @param {String} param value to fill
 * @param {int} index index to put the value into message (0 for "{0}", 1 for "{1}', etc).
 * @return Completed message
 * @type String 
 */    
SweetDevRia.MessageHelper.prototype.completeParam = function(message, param, index) {
    /** if param is not null, replace all {index} with their value */
    if (param !== null) {
      var strToFind = "{"+ index +"}";
            
      /** Search first position of {index} */
      var idx = message.indexOf( strToFind );

      /** while {index} exists... */
      while ( idx > -1 ) {
          /** Replace {index} by param value */
          message = message.replace( strToFind, param );
          
          /** Keep looking for other {index} */
          idx = message.indexOf( strToFind );
      }
    }
    
    /** return completed message */
    return message;
};