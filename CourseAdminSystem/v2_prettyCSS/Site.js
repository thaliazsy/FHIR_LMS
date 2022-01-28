/*
    公用變數區
    FHIRURL：FHIR Server位址
    FHIRResponseType：要求FHIR Server回傳的資料型態
*/
//var FHIRURL = 'http://hapi.fhir.org/baseDstu3/';
//var FHIRURL = 'https://hapi.fhir.tw/fhir/';
//var FHIRURL = 'http://203.64.84.213:52888/r4/fhir/';
//var FHIRURL = 'http://hapi.fhir.org/baseR4/';
var FHIRURL =  'http://203.64.84.213:8080/fhir/';
var partOfid = '';
var FHIRResponseType = 'json';

function getTodayDate() {
    var fullDate = new Date();
    var dd = String(fullDate.getDate()).padStart(2, '0');
	var mm = String(fullDate.getMonth() + 1).padStart(2, '0');
	var yyyy = fullDate.getFullYear();
	var today = yyyy + "-" + mm + '-' + dd;
    return today;
}

function checkRequiredField(reqFieldNum){
	var count = 0; //計數器
	var inputObj = document.getElementsByTagName("input");
	//alert(inputObj.length);
	for (var k = 0; k < inputObj.length; k++) {
		if (inputObj[k].type == "radio") {
			if (inputObj[k].checked) count++;
		}
		if (inputObj[k].type == "text" || inputObj[k].type == "password") { 
			if (inputObj[k].value != "") count++
		}
		if (inputObj[k].type == "email") { 
			var emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			if (inputObj[k].value != ""){
				if(emailFormat.test(inputObj[k].value)) count++;
				else{ 
					alert("Email 格式錯誤");
					document.getElementById("btnSubmit").disabled = false;
				}
			}
		}
	}
	if (reqFieldNum != count){
		alert("表單未填寫完畢");
		document.getElementById("btnSubmit").disabled = false;
		return 0;
	}
	return 1;
}