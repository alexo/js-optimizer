

function openSrcWindow(url) {		
    window.open(url,'Test','width=750,height=540,scrollbars=yes,resizable=yes');
}	

function getScriptsSrc(){
	var scripts = document.getElementsByTagName("SCRIPT");
	
	var urls = new Array();
	for(var i=0;i<scripts.length;++i){
		var script =scripts[i];
		if(script.src!=undefined && script.src !=""){
			urls.push(script.src);
		}
	}
	return urls;
}

function writeInDiv(string){
	document.getElementById('Results').innerHTML +=string;
}

var printRes = function(){
	var start = this.url.lastIndexOf('/')+1; 
	var end = this.url.lastIndexOf('?');
	var resname = this.url.substring(start,end);

	endTimer(this.id, RiaTimer.LAST);
	var tbody = document.getElementById("Results");
	var tr = tbody.insertRow(tbody.rows.length);
	var tr1 = tr.insertCell(0); tr1.innerHTML = resname;
	var tr2 = tr.insertCell(1); tr2.innerHTML = this.responseText.length;
	var tr3 = tr.insertCell(2); tr3.innerHTML = getTimer(this.id).value[0];
	//var res = "";	
/*	res+="<tr><td>"+resname+"</td><td>";
	res+=this.responseText.length+"</td><td>";
	res+=getTimer(this.id).value[0]+"</td></tr>";
	writeInDiv(res);*/
}

function getUrlContent(url){
	var ajax = AjaxPooler.getInstance ();
	ajax.setCallback (printRes);
	ajax.url = url;
	ajax.startReq = startTimer(ajax.id, RiaTimer.LAST);
	ajax.post (url, "");
}