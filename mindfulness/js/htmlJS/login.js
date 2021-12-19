//Validate data input by user
function dataValidation(){
	if(checkRequiredField(2)){
		let id= document.getElementById('userID').value;
		getResource(FHIRURL, 'Person', '?identifier=' + id, FHIRResponseType, 'verifyUser');
	}
}

//Verify login account username and password
function verifyUser(obj){ 
	let encPassword= document.getElementById('SHA256PWD').value;
	let retID="", retName="", retUsername="", retPassword="", patientID="";
	let arrPatientID= new Array();
	
	if (obj.total == 0) alert('帳號不存在!');
	else if (obj.total == 1){
		retID = (obj.entry[0].resource.id) ? obj.entry[0].resource.id : '';
		retName = (obj.entry[0].resource.name) ? obj.entry[0].resource.name[0].text : '';
		retUsername= (obj.entry[0].resource.identifier[0])? obj.entry[0].resource.identifier[0].value : '';
		retPassword= (obj.entry[0].resource.identifier[1])? obj.entry[0].resource.identifier[1].value : '';
		patientID = (obj.entry[0].resource.link) ? obj.entry[0].resource.link[0].target.reference:'';
		//arrPatientID.push(patientID);
		if(encPassword!=retPassword)	alert('密碼錯誤!');		
		else {
			sessionSet("loginAccount", retID, retName, retUsername, arrPatientID);
			window.open('index.html',"_self");
		}
	}
	else{
		alert('系統錯誤! 請聯絡慈大醫資龍昱璇學姊，\n電話：0965006102\n郵件：108316107@gms.tcu.edu.tw');
	}
}