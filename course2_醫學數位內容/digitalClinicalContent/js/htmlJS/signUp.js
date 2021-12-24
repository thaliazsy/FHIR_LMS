//Show Page Title and Header
info.pageName= "報名網頁";
document.title= info.universityName + " - " + info.courseName + " - " + info.pageName;
document.getElementById("header").innerHTML= info.universityName + " - " + info.courseName + "<br>" + info.pageName;

//Initialize Fhir Person class
let user = new CPerson();
//local variable for store temporary json obj
let personJSON, slotJSON;

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
		alert(message.accountExist);
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
	postResource(FHIRURL, 'Person', '', FHIRResponseType, "createPatient", personJSONobj);
}

//Create new FHIR Patient
function createPatient(obj){
	//If failed to create new Person
	if (!isError(obj.resourceType, "Error in create FHIR Person. " + message.contactPerson))
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
	if (!isError(obj.resourceType, "Error in create FHIR Patient. " + message.contactPerson))
	{
		globalPatientID= obj.id;
		let link= '{"link":[{"target":{"reference":"Patient/' + globalPatientID + '","display": "' + user.name + '"}}]}';
		link= JSON.parse(link);
		
		if(personJSON.link == null)
		{
			mergedObject = {
			  ...personJSON,
			  ...link,
			};
		}
		personJSON = JSON.stringify(mergedObject);
		putResource(FHIRURL, 'Person', '/' + user.id, FHIRResponseType, "getAppointmentByPatientID", personJSON)
	}
}

//Check all appointment of patient by Actor.reference
function getAppointmentByPatientID(obj){
	//let patientID= obj.link[0].target.reference;
	if (!isError(obj.resourceType, "Error in update FHIR Person. " + message.contactPerson))
	{
		getResource(FHIRURL, 'Appointment', '?actor=' + globalPatientID, FHIRResponseType, 'getSlotByApptID');
	}
}

function getSlotByApptID(obj){
	//If patient doesn't have appointment -> check free Slot -> create new appointment
	if (obj.total == 0){
		getResource(FHIRURL, 'Slot', '?schedule=' + course1.scheduleID + "&status=free", FHIRResponseType, 'createAppointment');
	}
	// else{
		// for (var i=0;i<((jsonOBJ.total>10)?10:jsonOBJ.total);i++){ 
			// arrTempSlot[iAppointment] = jsonOBJ.entry[i].resource.slot[0].reference;			//slotID
			// iAppointment++;
		// }
		// globalScheduleExist=0;
		// for (var i=0;i<iAppointment;i++){ 
			// if(globalScheduleExist==1) break;
			// let urlStr= FHIRserver + arrTempSlot[i];
			// HTTPGetData(urlStr, "getSlotOfAppointment");
		// }
	// }
}

function createAppointment(obj){
	if (obj.total == 0){
		alert("Course full slot!");
		document.getElementById("loader").style.display = "none";
	}
	else{
		slotJSON= obj.entry[0].resource;
		appointmentJSONobj.slot[0].reference= "Slot/" + obj.entry[0].resource.id;				//slot ID
		appointmentJSONobj.participant[0].actor.reference= "Patient/" + globalPatientID;						//patient ID
		appointmentJSONobj.participant[0].actor.display= user.name;								//patient name
		appointmentJSONobj.participant[1].actor.reference= course1.practitionerRoleID;			//PractitionerRole ID
		appointmentJSONobj.participant[1].actor.display= course1.practitionerName;				//PractitionerRole name
		appointmentJSONobj = JSON.stringify(appointmentJSONobj);
		postResource(FHIRURL, 'Appointment', '', FHIRResponseType, "updateSlot", appointmentJSONobj);
	}
}

function updateSlot(obj){
	if (!isError(obj.resourceType, "Error in create FHIR Appointment. " + message.contactPerson))
	{
		slotJSON.status="busy";
		let slotSTR = JSON.stringify(slotJSON);
		putResource(FHIRURL, 'Slot', '/' + slotJSON.id, FHIRResponseType, "signUpResult", slotSTR)
	}
}

function signUpResult(obj){
	if (!isError(obj.resourceType, message.signUpFail + message.contactPerson))
	{
		alert(message.signUpOK);
		window.close();
	}
}

function isError(resourceType, msg){
	if(resourceType=="OperationOutcome")
	{
		document.getElementById("loader").style.display = "none";
		alert(msg);
		return 1;
	}
	else
		return 0;
}