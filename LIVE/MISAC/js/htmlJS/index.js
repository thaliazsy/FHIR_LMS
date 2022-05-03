//Language setting
if(web_language=="CH")
{
	pageName= "學習平台";
}
else if(web_language=="EN")
{
	pageName= "Learning Platform";
}

//Function Initialization
$(document).ready(function(){
	/* Check session */
	loginData= sessionGet("loginAccount");
	if(loginData==null) {
		//redirect users to login page
		window.location.href = "../login.html";
	}
	else {
		showWebsiteInfo();
		$("#intro").html("Welcome, " + loginData.person.name + "!");
		//Get user control access range
		//getResource(FHIRURL, 'Patient', '/' + loginData.role[0].patientID, FHIRResponseType, 'getPatientByID');
		getResource(FHIRURL, 'Appointment', '?actor=Patient/' + loginData.role[0].patientID, FHIRResponseType, 'getAppointmentByPatientID');
	}
});

//Show Page Title and Header (need to initialize page name beforehand)
function showWebsiteInfo()
{
	document.title= loginData.schedule.name + " - " + pageName;
	$("#header").html(loginData.schedule.name + "<br>" + pageName);
}

// function getPatientByID(obj){
	// let patientID = (obj.id) ? obj.id : '';
	// let organizationID =(obj.managingOrganization.reference) ? obj.managingOrganization.reference.split('/')[1] : '';
	// let p = new CPatient(patientID, organizationID)
	// groupMember.newMember(p);
	// getResource(FHIRURL, 'Organization', '/' + organizationID, FHIRResponseType, 'getOrganizationByID');
// }

// function getOrganizationByID(obj){
	// let organizationID = (obj.id) ? obj.id : '';
	// let organizationName = (obj.name) ? obj.name : '';
	// groupMember.patient.filter(x => x.organizationID == organizationID && x.organizationName == '')[0].organizationName = organizationName; //must only return 1 row
	// let patientID= groupMember.patient.filter(x => x.organizationID == organizationID)[0].patientID; 
	// //document.getElementById("titleDiv").innerHTML= organizationName + " - " + info.pageName;					//organizationName
	// getResource(FHIRURL, 'Appointment', '?actor=Patient/' + patientID, FHIRResponseType, 'getAppointmentByPatientID');
// }

//Retrieve: Slot ID
function getAppointmentByPatientID(str){
	let obj= JSON.parse(str);
	if (obj.total == 0)	alert('無資料');
	else{
		obj.entry.map((entry, i) => {
			let appointmentID = (entry.resource.id) ? entry.resource.id : '';
			let appointmentStatus = (entry.resource.status) ? entry.resource.status : '';
			if(appointmentStatus == 'waitlist')
			{
				$("#intro").html("Your current status is on <font color='red'>waiting</font> list.<br>Please contact your administrator for further information.");
			}
			else if(appointmentStatus == 'booked')
			{
			let slotID= (entry.resource.slot) ? entry.resource.slot[0].reference.split('/')[1] : '';
			//Jangan include appointment dan slot id ke dalam CSchedule, only include scheduleID dan material
			// let appointment = new CAppointment(appointmentID, slotID);
			// let schedule = new CSchedule();
			// schedule.newAppointment(appointment);
			// groupMember.newCourse(schedule);
			//#UbahIni
			if(i==0)
			getResource(FHIRURL, 'Slot', '/' + slotID, FHIRResponseType, 'getSlotByID');
			}
		});
	}
}

//Retrieve: Schedule ID
function getSlotByID(str){
	let obj= JSON.parse(str);
	let slotID= (obj.id) ? obj.id : '';
	let scheduleID= (obj.schedule) ? obj.schedule.reference.split('/')[1] : '';
	//groupMember.courseIsExist(scheduleID);
	getResource(FHIRURL, 'Schedule', '/' + scheduleID, FHIRResponseType, 'getSchedule');	//http://203.64.84.213:8080/fhir/PlanDefinition?composed-of=Schedule/1738
}

function getSchedule(str){
	let obj= JSON.parse(str);
	let scheduleID = (obj.id) ? obj.id : '';
	let courseName = (obj.specialty) ? obj.specialty[0].coding[0].display : '';
	let practitionerRoleID = (obj.actor) ? obj.actor[0].reference : '';				
	let courseStartDate= (obj.planningHorizon.start) ? obj.planningHorizon.start.split("T")[0] : '';
	let courseEndDate= (obj.planningHorizon.end) ? obj.planningHorizon.end.split("T")[0] : '';
	
	if(!groupMember.courseIsExist(scheduleID))
	{
		let schedule = new CSchedule(scheduleID, courseName, courseStartDate, courseEndDate, practitionerRoleID);
		groupMember.newCourse(schedule);
	}
	getResource(FHIRURL, 'PlanDefinition', '?composed-of=Schedule/' + scheduleID, FHIRResponseType, 'getMaterialByScheduleID');	//http://203.64.84.213:8080/fhir/PlanDefinition?composed-of=Schedule/1738
}

function getMaterialByScheduleID(str){
	let obj= JSON.parse(str);
	if (obj.total == 0)	alert('無資料');
	else{
		obj.entry.map((entry, i) => {
			var index=1;	//since relatedArtifact[0] store Schedule information instead of material 
			let scheduleID= entry.resource.relatedArtifact ? entry.resource.relatedArtifact[0].resource.split("/")[1] : "";
			let relatedArtifactLen= entry.resource.relatedArtifact ? entry.resource.relatedArtifact.length : 0;
			while(index < relatedArtifactLen)
			{
				let temp= entry.resource.relatedArtifact[index].display.split("-");
				let title= temp[2];
				let type= temp[1];
				let url= entry.resource.relatedArtifact[index].url? entry.resource.relatedArtifact[index].url : '';
				let material= new CMaterial(title, type, url);
				groupMember.course.filter(x => x.scheduleID == scheduleID)[0].material.push(material); //must only return 1 row
				index++;
			}
		});
	}
	showMyCourse();
}

function showMyCourse(){
	var table= document.getElementById("TableAppointment");
	var param= btoa("personID=" + loginData.person.id);
	var cellIndex;
	var row, noIndex=1, videoName;
	//check per organization
	let indexTable;
	//for (indexTable=0;indexTable<groupMember.patient.length;indexTable++){											
		table.innerHTML+= '<tr><th bgcolor="#ebebe0" colspan="2">My Course List</th></tr>';
		//check per schedule
		let namaDosen='';
		groupMember.course.forEach(item => {
			document.getElementById("intro").innerHTML+= '<br>Student ID: ' + loginData.role[0].patientID; //groupMember.patient[0].patientID;
			document.getElementById("intro").innerHTML+= '<br>Course Period: ' + item.courseStartDate + ' until ' + item.courseEndDate;
			table.innerHTML+= '<tr><th>No.</th><th>Course Material</th></tr>';
			var indexNo=1;
			//check per slot
			item.material.forEach(item2 => {		//per Slot
				row = table.insertRow(-1);
				row.align="left";
				row.insertCell(0).innerHTML= indexNo++ + ".";
				if(item2.url=="")
				{
					row.insertCell(1).innerHTML= item2.title + "<br>	(ppt will be upload soon)";
				}
				//When PPT url is provided, create anchor
				else
				{
					elLink = document.createElement('a');
					elLink.target= "_blank";
					elLink.innerHTML = item2.title;
					
					if(item2.type != 'ppt')
					{
						item2.url+= "?" + param;
					}
					elLink.href = item2.url;
					row.insertCell(1).appendChild(elLink);
				}
			});
		});
	//}
}

// <!-- function linkToCourseSelection(){ -->
	// <!-- var queryParam= 'personID=' + globalPersonID; -->
	// <!-- window.open('courseSelection.html?' + queryParam, "_blank"); -->
// <!-- } -->

function logOut(){			
	 window.sessionStorage.removeItem("loginAccount");
	 window.location.href = "login.html";
}
