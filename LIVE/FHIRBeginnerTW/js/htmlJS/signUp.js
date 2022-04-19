//Set table field
let field= {
	code: ["Name", "Email", "Password", "Institution", "JobPosition"],
	placeholder: ["", "", "", "例如： 慈濟大學 / 慈濟醫院", "例如： 學生 / 教授 / 護理人員", ],
	desc: [],
	isRequired: [1,1,1,1,1],		
	type: ["text", "email", "password", "text", "text"]			
};

if(web_language=="CH")
{
	field.desc= ["姓名", "Email", "密碼", "就讀機構", "職稱"];
	pageName= "註冊網頁";
}
else if(web_language=="EN")
{
	field.desc= ["Name", "Email", "Password", "Educational/Working Institution", "Job Position"];
	pageName= "Sign Up";
}

//local variable for store temporary json obj
let personJSON, apptJSON;

let localVar = {
	person:{
		id: '',
		name: '',
		username: '',
		jobPosition: '',
		highestEduDegree: '',
		institution: ''
	},
	patient:{
		id: ''
	},
	organization: {
		id: '',
		identifier: '',
		status: '',	
		name: '',		
		cpname: '',
		cpphone: '',
		cpemail: ''
	},
	schedule: {
		code: '',
		name: '',		
		practitionerRoleID: '',
		practitionerName: '',
		maxParticipant: 0,
		currentParticipant: 0
	},
	slot:{
		id: []
	},
	appointment:{
		id: '',
		bookingsuccess: false
	}
}

//Function Initialization
$(document).ready(function(){
	// Clear session
	let stringValue = window.sessionStorage.getItem("loginAccount")
    if (stringValue != null) 
	{
		window.sessionStorage.removeItem("loginAccount");
	}
	showForm();
});


function showForm()
{
	let temp="";
	// Show Login Form field
	for(let i=0; i<field.desc.length;i++){
		temp += '<tr><td>' + field.desc[i];
		if(field.isRequired[i])			
			temp += '<font color="red"> *</font>';
		
		temp += '</td><td>:&nbsp;<input type="' + field.type[i] + '" id="' + field.code[i] + '" ';
		
		if(field.type[i] == "password")
			temp += 'onkeyup="SHA256PWD.value = sha256(this.value);" ';
			
		if(field.isRequired[i])			
			temp += 'required';
			
		temp += '><br></td></tr>';
	}
	temp+= '<tr><td colspan="2" align="right"><input id="btnSubmit" type="button" value="Submit" onclick="validateData()"></td></tr>';
	$('#mainTable').html(temp);
	
	// Get Organization Information
	getResource(FHIRURL, 'Organization', '/' + DB.organization, FHIRResponseType, 'getOrganization');
}

function getOrganization(str){
	let obj= JSON.parse(str);
	if(retValue(obj))
	{
		localVar.organization.id = (obj.id) ? obj.id : '';
		localVar.organization.identifier= (obj.identifier)? obj.identifier[0].value : '';
		localVar.organization.status= (obj.active == true) ? 'Active' : 'Inactive';
		localVar.organization.name= (obj.name) ? obj.name : '';
		if (obj.contact)
		{
			localVar.organization.cpname= obj.contact[0].name.text;
			obj.contact[0].telecom.map((telecom, i) => {
				if (telecom.system == "email")
					localVar.organization.cpemail= telecom.value;
				else if (telecom.system == "phone")
					localVar.organization.cpphone= telecom.value;
			});
		}
	}
	// Get Schedule Information
	getResource(FHIRURL, 'Schedule', '/' + DB.schedule, FHIRResponseType, 'getSchedule');
}

function getSchedule(str){
	let obj= JSON.parse(str);
	if(retValue(obj))
	{
		localVar.schedule.code= (obj.specialty)? obj.specialty[0].coding[0].code : '';
		localVar.schedule.name= (obj.specialty)? obj.specialty[0].coding[0].display : '';
		localVar.schedule.practitionerRoleID= (obj.actor) ? obj.actor[0].reference.split('/')[1] : '';
		localVar.schedule.practitionerName= (obj.actor) ? obj.actor[0].display : '';
	}
	showWebsiteInfo();
}

//Show Page Title and Header (need to initialize page name beforehand)
function showWebsiteInfo()
{
	document.title= localVar.schedule.name + " - " + pageName;
	$("#header").html(localVar.schedule.name + "<br>" + pageName);
}

//Validate data input by user
function validateData(){
	if(checkRequiredField(field)){
		document.getElementById("loadingPage").style.display = "block";
		localVar.person.name= $('#Name').val();
		localVar.person.username= $("#Email").val();
		localVar.person.jobPosition= $("#JobPosition").val();
		localVar.person.institution= $("#Institution").val();
		getResource(FHIRURL, 'Person', '?identifier=' + localVar.person.username, FHIRResponseType, 'verifyUser');
	}
}

//Verify FHIR Person & Patient exist or not 
function verifyUser(str){ 
	let obj= JSON.parse(str);
	//if person exist -> alert "user exist"
	if (obj.total > 0)
	{			
		alert(message.accountExist);
		document.getElementById("loadingPage").style.display = "none";
	}
	//if person unexist -> check slot availability -> create new Person ->  create new Patient
	else 
	{
		getResource(FHIRURL, 'Slot', '?schedule=' + DB.schedule, FHIRResponseType, 'getSlotID');
	}
}

//Get all slot ID 
function getSlotID(str){ 
	let obj= JSON.parse(str);
	
    obj.entry.map((entry, i) => {
		localVar.slot.id.push(entry.resource.id);
	});
	createPerson();
}

//Create new FHIR Person
function createPerson(){
	initialize();
	
	personJSONobj.identifier[0].value= localVar.person.username;
	personJSONobj.identifier[1].value= $('#SHA256PWD').val();
	personJSONobj.identifier[2].value= localVar.person.jobPosition;
	personJSONobj.identifier[3].value= localVar.person.institution;
	personJSONobj.name[0].text= localVar.person.name;
	personJSONobj.telecom[0].value= localVar.person.username;
	personJSONobj = JSON.stringify(personJSONobj);
	postResource(FHIRURL, 'Person', '', FHIRResponseType, "createPatient", personJSONobj);
}

//Create new FHIR Patient
function createPatient(str){
	let obj= JSON.parse(str);
	//If failed to create new Person
	if (!isError(obj.resourceType, "Error in create FHIR Person. " + message.contactPerson))
	{
		localVar.person.id= obj.id;
		personJSON= obj;
		patientJSONobj.name[0].text= localVar.person.name;
		patientJSONobj.managingOrganization.reference= 'Organization/' + DB.organization;
		patientJSONobj = JSON.stringify(patientJSONobj);
		postResource(FHIRURL, 'Patient', '', FHIRResponseType, "updatePerson", patientJSONobj);
	}
}

//Update FHIR Person to connect it with FHIR Patient
function updatePerson(str){
	let obj= JSON.parse(str);
	if (!isError(obj.resourceType, "Error in create FHIR Patient. " + message.contactPerson))
	{
		localVar.patient.id= obj.id;
		let link= '{"link":[{"target":{"reference":"Patient/' + localVar.patient.id + '","display": "' + localVar.person.name + '"}}]}';
		link= JSON.parse(link);
		
		if(personJSON.link == null)
		{
			mergedObject = {
			  ...personJSON,
			  ...link,
			};
		}
		personJSON = JSON.stringify(mergedObject);
		putResource(FHIRURL, 'Person', '/' + localVar.person.id, FHIRResponseType, "createAppointment", personJSON);
	}
}

function createAppointment(str){
	let obj= JSON.parse(str);
	if (!isError(obj.resourceType, "Error in update FHIR Person. " + message.contactPerson))
	{
		initializeAppt();
	
		localVar.slot.id.forEach(element => {
			let temp_ref={
				reference: ''
			};
			temp_ref.reference =  "Slot/" + element;
			appointmentJSONobj.slot.push(temp_ref);
		});
		appointmentJSONobj.status= 'waitlist';		
		appointmentJSONobj.participant[0].actor.reference= "Patient/" + localVar.patient.id;							//patient ID
		appointmentJSONobj.participant[0].actor.display= localVar.person.name;											//patient name
		appointmentJSONobj.participant[1].actor.reference= "PractitionerRole/" +  localVar.schedule.practitionerRoleID;	//PractitionerRole ID
		appointmentJSONobj.participant[1].actor.display= localVar.schedule.practitionerName;							//PractitionerRole name
		appointmentJSONobj = JSON.stringify(appointmentJSONobj);
		postResource(FHIRURL, 'Appointment', '', FHIRResponseType, "readGroup", appointmentJSONobj);
	}
}

//read Group to get max participant quota
function readGroup(str){
	let obj= JSON.parse(str);
	if (!isError(obj.resourceType, "Error in create FHIR Appointment. " + message.contactPerson))
	{
		apptJSON= obj;
		localVar.appointment.id= obj.id;
		getResource(FHIRURL, 'Group', '?identifier=' + localVar.schedule.code + '&code=201', FHIRResponseType, "getMaxParticipant");
	}
}

//Get max participant quota
function getMaxParticipant(str){
	let obj= JSON.parse(str);
	if (!isError(obj.resourceType, "Error in read FHIR Group. " + message.contactPerson))
	{
		if (obj.total == 1)
		{			
			localVar.schedule.maxParticipant = obj.entry[0].resource.quantity ? obj.entry[0].resource.quantity : "";
		}
		getResource(FHIRURL, 'Appointment', '?slot=Slot/' + localVar.slot.id[0] + '&status=booked', FHIRResponseType, 'getCurrentParticipant');
	}
}

//Get current participant quota
function getCurrentParticipant(str){
	let obj= JSON.parse(str);
	if (!isError(obj.resourceType, "Error in read FHIR Appointment. " + message.contactPerson))
	{
		localVar.schedule.currentParticipant= obj.total;
		let freeQuota=localVar.schedule.maxParticipant - localVar.schedule.currentParticipant;
		//using manual check mechanism
		if(freeQuota>0)
		{
			getResource(FHIRURL, 'Appointment', '?slot=Slot/' + localVar.slot.id[0] + '&status=waitlist&_sort=_lastUpdated', FHIRResponseType, 'checkCourseAvailability');
		}
		else
		{
			let str="{status='waitlist'}";
			signUpResult(str);
		}
	}
}

//Check course availability
function checkCourseAvailability(str){
	let obj= JSON.parse(str);
	let freeQuota=localVar.schedule.maxParticipant - localVar.schedule.currentParticipant;
	
    for(let i=0;i<freeQuota;i++)
	{
		let apptID= obj.entry[i].resource.id;
		if(localVar.appointment.id == apptID)
		{
			localVar.appointment.bookingsuccess=true;
			break;
		}
	}
	if(localVar.appointment.bookingsuccess)
	{
		updateAppointment();
	}
	else{
		let str="{status='waitlist'}";
		signUpResult(str);
	}
}

function updateAppointment(){
	apptJSON.status= 'booked';
	putResource(FHIRURL, 'Appointment', '/' + localVar.appointment.id, FHIRResponseType, "signUpResult", JSON.stringify(apptJSON));
}

function getSlotByApptID(str){
	let obj= JSON.parse(str);
	//If patient doesn't have appointment -> check free Slot -> create new appointment
	if (obj.total == 0){
		for(let i=101; i<= 100+course1.totalSlotSession ; i++){
			getResource(FHIRURL, 'Slot', '?identifier=' + course1.scheduleCode + i + "&status=free&_count=102&_sort:asc=_lastUpdated", FHIRResponseType, 'createAppointment');
		}
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

function signUpResult(str){
	let obj= JSON.parse(str);
	if (!isError(obj.resourceType, message.signUpFail + message.contactPerson))
	{
		document.getElementById("loadingPage").style.display = "none";
		if(obj.status=="booked")
			alert(message.signUpOK);
		else if(obj.status=="waitlist")
			alert("Course full slot!<br>Please contact your administrator for further information.");
		
		window.close();
	}
}

function isError(resourceType, msg){
	if(resourceType=="OperationOutcome")
	{
		document.getElementById("loadingPage").style.display = "none";
		alert(msg);
		return 1;
	}
	else
		return 0;
}