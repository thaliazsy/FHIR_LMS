//Create new FHIR Patient
function createPatient(){
	patientJSONobj.name[0].text= loginData.person.name;
	patientJSONobj.managingOrganization.reference= 'Organization/' + DB.organization;
	//patientJSONobj = JSON.stringify(patientJSONobj);
}

//Update FHIR Person to connect it with FHIR Patient
function updatePerson(str){
	let obj= JSON.parse(str);
	if (!isError(obj.resourceType, "Error in create FHIR Patient. " + message.contactPerson))
	{
		loginData.patient.id= obj.id;
		let link= '{"link":[{"target":{"reference":"Patient/' + loginData.patient.id + '","display": "' + loginData.person.name + '"}}]}';
		link= JSON.parse(link);
		let target= '{"target":{"reference":"Patient/' + loginData.patient.id + '","display": "' + loginData.person.name + '"}}';
		target= JSON.parse(target);
		
		if(personJSON.link == null)
		{
			mergedObject = {
			  ...personJSON,
			  ...link,
			};
			personJSON = JSON.stringify(mergedObject);
		}
		else
		{
			personJSON.link.push(target);
			personJSON = JSON.stringify(personJSON);
		}
		
		putResource(FHIRURL, 'Person', '/' + loginData.person.id, FHIRResponseType, "createAppointment", personJSON);
	}
}

function createAppointment(str){
	var obj = JSON.parse(str.response);
	if (!isError(obj.resourceType, "Error in update FHIR Person. " + message.contactPerson))
	{
		initializeAppt();
	
		if(obj.entry)
		{
			obj.entry.map((entry, i) => {
				let res= entry.response.location.split("/");
				if(res[0] == "Patient")
					loginData.patient.id= res[1];
				else if(res[0] == "Person")
					loginData.person.id= res[1];
			});
		}
		loginData.slot.id.forEach(element => {
			let temp_ref={
				reference: ''
			};
			temp_ref.reference =  "Slot/" + element;
			appointmentJSONobj.slot.push(temp_ref);
		});
		appointmentJSONobj.status= 'waitlist';		
		appointmentJSONobj.participant[0].actor.reference= "Patient/" + loginData.patient.id;							//patient ID
		appointmentJSONobj.participant[0].actor.display= loginData.person.name;											//patient name
		appointmentJSONobj.participant[1].actor.reference= "PractitionerRole/" +  loginData.schedule.practitionerRoleID;	//PractitionerRole ID
		appointmentJSONobj.participant[1].actor.display= loginData.schedule.practitionerName;							//PractitionerRole name
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
		loginData.appointment.id= obj.id;
		getResource(FHIRURL, 'Group', '?identifier=' + loginData.schedule.code + '&code=201', FHIRResponseType, "getMaxParticipant");
	}
}

//Get max participant quota
function getMaxParticipant(str){
	let obj= JSON.parse(str);
	if (!isError(obj.resourceType, "Error in read FHIR Group. " + message.contactPerson))
	{
		if (obj.total == 1)
		{			
			loginData.schedule.maxParticipant = obj.entry[0].resource.quantity ? obj.entry[0].resource.quantity : "";
		}
		getResource(FHIRURL, 'Appointment', '?slot=Slot/' + loginData.slot.id[0] + '&status=booked', FHIRResponseType, 'getCurrentParticipant');
	}
}

//Get current participant quota
function getCurrentParticipant(str){
	let obj= JSON.parse(str);
	if (!isError(obj.resourceType, "Error in read FHIR Appointment. " + message.contactPerson))
	{
		loginData.schedule.currentParticipant= obj.total;
		let freeQuota=loginData.schedule.maxParticipant - loginData.schedule.currentParticipant;
		//using manual check mechanism
		if(freeQuota>0)
		{
			getResource(FHIRURL, 'Appointment', '?slot=Slot/' + loginData.slot.id[0] + '&status=waitlist&_sort=_lastUpdated', FHIRResponseType, 'checkCourseAvailability');
		}
		else
		{
			courseFullSlot();
		}
	}
}

//Check course availability
function checkCourseAvailability(str){
	let obj= JSON.parse(str);
	let freeQuota=loginData.schedule.maxParticipant - loginData.schedule.currentParticipant;
	
    for(let i=0;i<freeQuota;i++)
	{
		let apptID= obj.entry[i].resource.id;
		if(loginData.appointment.id == apptID)
		{
			loginData.appointment.bookingsuccess=true;
			break;
		}
	}
	if(loginData.appointment.bookingsuccess)
	{
		updateAppointment();
	}
	else{
		courseFullSlot();
	}
}

function updateAppointment(){
	apptJSON.status= 'booked';
	putResource(FHIRURL, 'Appointment', '/' + loginData.appointment.id, FHIRResponseType, "finalResult", JSON.stringify(apptJSON));
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

function courseFullSlot()
{
	document.getElementById("loadingPage").style.display = "none";
	alert("Course full slot!<br>Please contact your administrator for further information.");
}