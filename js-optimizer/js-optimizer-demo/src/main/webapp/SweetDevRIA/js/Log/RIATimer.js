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
 if(window.ria_timer == undefined || window.ria_timer == null ){
	window.ria_timer = {};
}

function RiaTimer (name, mode) {
	if (mode == null){
		mode = RiaTimer.LAST; //last, all, sum
	}
	
	this.mode = mode;
	this.name = name;
	
	this.value = [];
	
	this.startTime = null;

	window.ria_timer [name] = this;
}

RiaTimer.ALL = 0;
RiaTimer.LAST = 1;
RiaTimer.SUM = 2;


RiaTimer.prototype.start = function () {
	this.startTime = new Date ();
};

RiaTimer.prototype.end = function () {
	this.setValue (new Date () - this.startTime);
	this.startTime = null;
};

RiaTimer.prototype.setValue = function (time) {
	this.value [this.value.length] = time;
};


RiaTimer.prototype.display = function () {
	var res = "";
	
	if (this.mode == RiaTimer.ALL) {
		for (var i = 0; i < this.value.length; i++) {
			if (i > 0){
				res += ", ";
			}
			res += this.value[i];
		}
	}
	else if (this.mode == RiaTimer.SUM) {
		var sum = 0;
		for (var j = 0; j < this.value.length; j++) {
			sum += this.value[j];
		}
		res += sum;
	}
	else if (this.mode == RiaTimer.LAST) {
		res = this.value [this.value.length - 1];		
	}
	
	return res;
};

function clearTimers () {
	window.ria_timer = {};
}

function displayTimers () {
	var res = "";
	
	for (name in window.ria_timer) {
		if (name) {
			var timer = getTimer (name);
			if (timer){
				res += name+" :: "+timer.display()+"\n";
			}
		}
	}

	alert(res);
}


function getTimer (name) {
	return window.ria_timer [name];
}

function startTimer (name, cumul) {
	var timer = getTimer (name);
	
	if (timer == undefined) {
		timer = new RiaTimer (name, cumul);
	}
	if (timer) {
		timer.start ();
	}
}

function endTimer (name) {
	var timer = getTimer (name);
	if (timer) {
		timer.end ();
	}
}