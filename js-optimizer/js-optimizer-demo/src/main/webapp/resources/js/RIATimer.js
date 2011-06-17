if(window.ria_timer == undefined || window.ria_timer == null )
	window.ria_timer = {}

function RiaTimer (name, mode) {
	if (mode == null) mode = RiaTimer.LAST; //last, all, sum
	
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
}

RiaTimer.prototype.end = function () {
	this.setValue (new Date () - this.startTime);
	this.startTime = null;
}

RiaTimer.prototype.setValue = function (time) {
	this.value [this.value.length] = time;
}


RiaTimer.prototype.display = function () {
	var res = "";
	
	if (this.mode == RiaTimer.ALL) {
		for (var i = 0; i < this.value.length; i++) {
			if (i > 0) res += ", ";
			res += this.value[i];
		}
	}
	else if (this.mode == RiaTimer.SUM) {
		var sum = 0;
		for (var i = 0; i < this.value.length; i++) {
			sum += this.value[i];
		}
		res += sum;
	}
	else if (this.mode == RiaTimer.LAST) {
		res = this.value [this.value.length - 1];		
	}
	
	return res;
}

function clearTimers () {
	window.ria_timer = {};
}

function displayTimers () {
	var res = "";
	
	for (name in window.ria_timer) {
		if (name) {
			var timer = getTimer (name);
			if (timer)
				res += name+" :: "+timer.display ()+"\n";
		}
	}

	return (res);
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



