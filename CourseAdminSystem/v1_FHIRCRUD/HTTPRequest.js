var ret, totalPost;
let arrSlotID= new Array();
var FHIRserver = 'https://203.64.84.213:52883/binus/fhir/'; //'https://59.126.145.136:53443/binus/fhir/'; //'https://203.64.84.213:52883/binus/fhir/'; //'http://203.64.84.213:8080/fhir/'; //'https://hapi.fhir.tw/fhir'; //"http://203.64.84.213:8080/fhir";
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
			else if (totalPost==0) alert("Finished!");
        }
    }
    HttpObj.send(dataStr);
}

//Update FHIR data
function HTTPPutData(urlStr, dataStr, curIndex, type) {
	var patientID=[ "6930","6320","6962","6465","7004","6455","6778","6713","6500","6234",
					"6450","7018","6385","6605","6460","6940","6723","6758","6773","6990",
					"6289","6718","6166","6788","7008","6203","6445","6743","6985","6161",
					"6952","6555","6229","6530","6510","6969","6340","6945","6960","6249",
					"6980","6076","6505","6239","6224","6783","6435","6151","6520","6873",
					"6738","6405","6798"];
	var uuid= ["799154f6-900d-11ec-b909-0242ac120002",
		"79915988-900d-11ec-b909-0242ac120002",
		"79915b54-900d-11ec-b909-0242ac120002",
		"79915d20-900d-11ec-b909-0242ac120002",
		"79916036-900d-11ec-b909-0242ac120002",
		"799161da-900d-11ec-b909-0242ac120002",
		"799163f6-900d-11ec-b909-0242ac120002",
		"799165b8-900d-11ec-b909-0242ac120002",
		"79916824-900d-11ec-b909-0242ac120002",
		"79916a72-900d-11ec-b909-0242ac120002",
		"79916c98-900d-11ec-b909-0242ac120002",
		"79916e1e-900d-11ec-b909-0242ac120002",
		"799171b6-900d-11ec-b909-0242ac120002",
		"79917382-900d-11ec-b909-0242ac120002",
		"799178d2-900d-11ec-b909-0242ac120002",
		"79917ada-900d-11ec-b909-0242ac120002",
		"79917c7e-900d-11ec-b909-0242ac120002",
		"79917f4e-900d-11ec-b909-0242ac120002",
		"79918142-900d-11ec-b909-0242ac120002",
		"799184c6-900d-11ec-b909-0242ac120002",
		"799186ec-900d-11ec-b909-0242ac120002",
		"7991889a-900d-11ec-b909-0242ac120002",
		"79918b88-900d-11ec-b909-0242ac120002",
		"79918da4-900d-11ec-b909-0242ac120002",
		"79919074-900d-11ec-b909-0242ac120002",
		"79919218-900d-11ec-b909-0242ac120002",
		"79919592-900d-11ec-b909-0242ac120002",
		"7991975e-900d-11ec-b909-0242ac120002",
		"7991990c-900d-11ec-b909-0242ac120002",
		"79919aba-900d-11ec-b909-0242ac120002",
		"79919c5e-900d-11ec-b909-0242ac120002",
		"79919e16-900d-11ec-b909-0242ac120002",
		"7991a154-900d-11ec-b909-0242ac120002",
		"7991a316-900d-11ec-b909-0242ac120002",
		"7991a4b0-900d-11ec-b909-0242ac120002",
		"7991a92e-900d-11ec-b909-0242ac120002",
		"7991ab36-900d-11ec-b909-0242ac120002",
		"7991ace4-900d-11ec-b909-0242ac120002",
		"7991ae92-900d-11ec-b909-0242ac120002",
		"7991b13a-900d-11ec-b909-0242ac120002",
		"7991b2d4-900d-11ec-b909-0242ac120002",
		"7991b4dc-900d-11ec-b909-0242ac120002",
		"7991b6bc-900d-11ec-b909-0242ac120002",
		"7991b996-900d-11ec-b909-0242ac120002",
		"7991bb80-900d-11ec-b909-0242ac120002",
		"7991bd24-900d-11ec-b909-0242ac120002",
		"7991bec8-900d-11ec-b909-0242ac120002",
		"7991c184-900d-11ec-b909-0242ac120002",
		"7991c8be-900d-11ec-b909-0242ac120002",
		"7991cabc-900d-11ec-b909-0242ac120002",
		"7991ce40-900d-11ec-b909-0242ac120002",
		"7991d016-900d-11ec-b909-0242ac120002",
		"7991d1f6-900d-11ec-b909-0242ac120002"];
	// var id= uuid[curIndex];
	// var patID= patientID[curIndex];
	// // var formattedNumber = ("0" + curIndex).slice(-2);
	// // id = 'IDTW.CC.1030' + formattedNumber;
	// urlStr=FHIRserver + 'Composition/' + id;
	// //dataStr = '{"resourceType": "Bundle","id": "' + id + '","identifier": {"system": "https://www.vghtc.gov.tw","value": "IDTW.CC.10000100103","period": {"start": "2022-02-19"}},"type": "document"}'; //document.getElementById("TextArea1").value;
	// dataStr = '{"resourceType": "Composition","id" : "' + id + '","status": "final","type": {"coding": [{"system": "http://loinc.org","code": "CC","display": "Course Certificate"}]},"subject": {"reference": "Patient/' + patID + '"},"date": "2022-02-18","author": [{"reference": "Organization/5591"}],"title": "IDTW FHIR Beginner Course Certifaction"}';
	
    var HttpObj = new XMLHttpRequest();
	HttpObj.open("PUT", urlStr, true);
	HttpObj.setRequestHeader("Content-type", "application/json+fhir");
    HttpObj.onload = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
			alert(ret);
			// if(type=="updateSlot")
			// {
				// if (curIndex<arrSlotID.length){
					// slotJSONobj.id= arrSlotID[curIndex];
					// HTTPPutData(FHIRserver + 'Slot/' + arrSlotID[curIndex], JSON.stringify(slotJSONobj), curIndex+1, "updateSlot");
				// }
				// else{
					// document.getElementById("loader").style.display = "none";
					// document.getElementById("myModal").style.display = "none";
					// location.reload();
				// }
			// }
			// else if(type=="createComposition")
			// {
				// if (curIndex<totalPost){
					// HTTPPutData(FHIRserver + 'Composition/' + id, '', curIndex+1, "createComposition");
				// }
				// else
				// {
					// alert("finish");
				// }
			// }
			
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
