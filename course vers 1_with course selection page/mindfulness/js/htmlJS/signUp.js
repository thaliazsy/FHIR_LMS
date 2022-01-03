//Initialize Fhir Person class
let user = new CPerson();
//Set course related information
let course1={
	organizationID: "Organization/2220",	//organizationID used for create new FHIR Patient
	practitionerRoleID: "PractitionerRole/1737", 
	scheduleID: "Schedule/1738",
	practitionerName: "蕭嘉宏"
};

//Validate data input by user
function dataValidation(){
	document.getElementById("loader").style.display = "block";
	if(checkRequiredField(3)){
		user.username= document.getElementById('pEmail').value;
		getResource(FHIRURL, 'Person', '?identifier=' + user.username, FHIRResponseType, 'verifyUser');
	}
}

//Verify FHIR Person & Patient exist or not 
function verifyUser(ret){ 
	//if person exist -> alert "user exist"
	if (ret.total > 0){			
		user.id = ret.entry[0].resource.link ? ret.entry[0].resource.link[0].target.reference : "";
		alert('該帳號已註冊過!');
		document.getElementById("loader").style.display = "none";
	}
	//if person unexist -> create new Person ->  create new Patient
	else createPerson();
}

//Create new FHIR Person
function createPerson(){
	initialize();
	let encPassword= document.getElementById('SHA256PWD').value;
	user.name= document.getElementById('pName').value;
	
	personJSONobj.identifier[0].value= user.username;
	personJSONobj.identifier[1].value= encPassword;
	personJSONobj.name[0].text= user.name;
	personJSONobj.telecom[0].value= user.username;
	personJSONobj = JSON.stringify(personJSONobj);
	postResource(FHIRURL, 'Person', '', FHIRResponseType, "signUpResult", personJSONobj);
}

let personJSON;
//Create new FHIR Patient
function createPatient(obj){
	//If failed to create new Person
	if(obj.resourceType=="OperationOutcome")
	{
		signUpError();
	}
	else
	{
		user.id= obj.id;
		personJSON= obj;
		patientJSONobj.name[0].text= user.name;
		patientJSONobj.managingOrganization.reference= course1.organizationID;
		patientJSONobj = JSON.stringify(patientJSONobj);
		postResource(FHIRURL, 'Patient', '', FHIRResponseType, "updatePerson", patientJSONobj);
	}
}

//Update FHIR Person to connect it with FHIR Patient
function updatePerson(obj){
	//If failed to create new Patient
	if(obj.resourceType=="OperationOutcome")
	{
		signUpError();
	}
	else
	{
		let patientID= obj.id;
		let link= '{"link":[{"target":{"reference":"Patient/' + patientID + '","display": "' + user.name + '"}}]}';
		link= JSON.parse(link);
		
		if(personJSON.link == null)
		{
			mergedObject = {
			  ...personJSON,
			  ...link,
			};
		}
		
		personJSON = JSON.stringify(mergedObject);
		putResource(FHIRURL, 'Person', '/' + user.id, FHIRResponseType, "signUpResult", personJSON)
	}
}

function signUpResult(obj){
	if(obj.resourceType=="OperationOutcome")
	{
		signUpError();
	}
	else
	{
		alert("註冊成功, 需等1-2分鐘才可以登入唷！");
		window.close();
	}
}

function signUpError(){
	document.getElementById("loader").style.display = "none";
	alert("註冊失敗!請聯絡慈大醫資龍昱璇學姊，\n電話：0965006102\n郵件：108316107@gms.tcu.edu.tw");
}