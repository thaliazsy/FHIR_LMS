var ret, totalPost;
let arrSlotID= new Array();
var FHIRserver = 'http://203.64.84.213:8080/fhir/'; //'https://hapi.fhir.tw/fhir'; //"http://203.64.84.213:8080/fhir";
//Get FHIR data
function HTTPGetData(urlStr) {
    var HttpObj = new XMLHttpRequest();   
    HttpObj.onreadystatechange = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
            alert(ret);
            callBack(ret);
			//alert("data retrieved");
        }
    }
	HttpObj.open("GET", urlStr, true);
    HttpObj.send();
}

//Upload FHIR data
function HTTPPostData(urlStr, dataStr) {
    var HttpObj = new XMLHttpRequest();
	HttpObj.open("POST", urlStr, true);
	HttpObj.setRequestHeader("Content-type", "application/json+fhir");
    //HttpObj.setRequestHeader("Content-type", "application/xml+fhir");
    HttpObj.onreadystatechange = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
            alert(ret);
			totalPost--;
			if (totalPost>0) HTTPPostData(urlStr, dataStr ); 
        }
    }
    HttpObj.send(dataStr);
}

//Update FHIR data
function HTTPPutData(urlStr, dataStr, curIndex, type) {
    var HttpObj = new XMLHttpRequest();
	HttpObj.open("PUT", urlStr, true);
	HttpObj.setRequestHeader("Content-type", "application/json+fhir");
    HttpObj.onload = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
			alert(ret);
			if(type=="updateSlot")
			{
				if (curIndex<arrSlotID.length){
					slotJSONobj.id= arrSlotID[curIndex];
					HTTPPutData(FHIRserver + 'Slot/' + arrSlotID[curIndex], JSON.stringify(slotJSONobj), curIndex+1, "updateSlot");
				}
				else{
					document.getElementById("loader").style.display = "none";
					document.getElementById("myModal").style.display = "none";
					location.reload();
				}
			}
		}
    }
    HttpObj.send(dataStr);
}

//Delete FHIR Data
function HTTPDeleteData(urlStr) {
    var HttpObj = new XMLHttpRequest();   
    HttpObj.onreadystatechange = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
            alert(ret);
        }
    }
	HttpObj.open("DELETE", urlStr, true);
    HttpObj.send();
}
