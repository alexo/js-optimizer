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
 * @class Log utility class
 * This class override Log4Js methods in order to pass a message key (and not a message)
 *
 */

/**
 * @constructor 
 * @param level The cut-off logger level.  You can adjust this level in the constructor and leave all other logging events in place.  Defaults to {@link Log#WARN}.
 * @param logger The logger to use.  The logger is a function that accepts the logging events and informs the user or developer. Defaults to {@link Log#writeLogger}.
 * @extends Log
 */   
function SweetDevRiaLog (level,logger) {

  /** 
   * Log4Js logger instanciation
   */     
  this._log = new Log (level,logger, null);
} 

/** Static method */ 
SweetDevRiaLog.prototype.getMessage= SweetDevRiaLog_getMessage;
SweetDevRiaLog.prototype.debug     = SweetDevRiaLog_debug;
SweetDevRiaLog.prototype.info      = SweetDevRiaLog_info;
SweetDevRiaLog.prototype.warn      = SweetDevRiaLog_warn;
SweetDevRiaLog.prototype.error     = SweetDevRiaLog_error;
SweetDevRiaLog.prototype.fatal     = SweetDevRiaLog_fatal;

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
function SweetDevRiaLog_getMessage (message, param1, param2, param3, param4, param5) {
  /** Get MessageHelper */
  var messageHelper = SweetDevRia.MessageHelper.getInstance ();
  
  /** Get completed message */
  message = messageHelper.getMessage (message, param1, param2, param3, param4, param5);
   
  return message;
}

/**
 * Print debug message
 * @param {String} message Message to return after completion
 * @param {String} param1 Value for field {0} for message @key 
 * @param {String} param2 Value for field {1} for message @key
 * @param {String} param3 Value for field {2} for message @key
 * @param {String} param4 Value for field {3} for message @key
 * @param {String} param5 Value for field {4} for message @key
 */  
function SweetDevRiaLog_debug (message, param1, param2, param3, param4, param5) {

  /** Get completed message */
  message = this.getMessage (message, param1, param2, param3, param4, param5);
  
  /** Send message to Log4Js */
  this._log.debug (message);
}

/**
 * Print info message
 * @param {String} message Message to return after completion
 * @param {String} param1 Value for field {0} for message @key 
 * @param {String} param2 Value for field {1} for message @key
 * @param {String} param3 Value for field {2} for message @key
 * @param {String} param4 Value for field {3} for message @key
 * @param {String} param5 Value for field {4} for message @key
 */  
function SweetDevRiaLog_info (message, param1, param2, param3, param4, param5) {
  /** Get completed message */
  message = this.getMessage (message, param1, param2, param3, param4, param5);
  
  /** Send message to Log4Js */
  this._log.info (message);
}

/**
 * Print warn message
 * @param {String} message Message to return after completion
 * @param {String} param1 Value for field {0} for message @key 
 * @param {String} param2 Value for field {1} for message @key
 * @param {String} param3 Value for field {2} for message @key
 * @param {String} param4 Value for field {3} for message @key
 * @param {String} param5 Value for field {4} for message @key
 */  
function SweetDevRiaLog_warn (message, param1, param2, param3, param4, param5) {
 
  /** Get completed message */
  message = this.getMessage (message, param1, param2, param3, param4, param5);
  
  /** Send message to Log4Js */
  this._log.warn (message);
}

/**
 * Print error message
 * @param {String} message Message to return after completion
 * @param {String} param1 Value for field {0} for message @key 
 * @param {String} param2 Value for field {1} for message @key
 * @param {String} param3 Value for field {2} for message @key
 * @param {String} param4 Value for field {3} for message @key
 * @param {String} param5 Value for field {4} for message @key
 */  
function SweetDevRiaLog_error (message, param1, param2, param3, param4, param5) {

 /** Get completed message */
  message = this.getMessage (message, param1, param2, param3, param4, param5);
  
  /** Send message to Log4Js */
  this._log.error (message);
}

/**
 * Print fatal message
 * @param {String} message Message to return after completion
 * @param {String} param1 Value for field {0} for message @key 
 * @param {String} param2 Value for field {1} for message @key
 * @param {String} param3 Value for field {2} for message @key
 * @param {String} param4 Value for field {3} for message @key
 * @param {String} param5 Value for field {4} for message @key
 */  
function SweetDevRiaLog_fatal (message, param1, param2, param3, param4, param5) {
 
  /** Get completed message */
  message = this.getMessage (message, param1, param2, param3, param4, param5);
  
  /** Send message to Log4Js */
  this._log.fatal (message);
}






