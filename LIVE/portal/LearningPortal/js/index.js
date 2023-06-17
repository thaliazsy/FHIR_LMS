/* LANGUAGE SETTING */
if(web_language=="CH")
{
	pageName= "學習平台";
}
else if(web_language=="EN")
{
	pageName= "Home";
}
/* END LANGUAGE SETTING */

/* GLOBAL VARIABLES DECLARE*/
let totalAppt=0;
let getScheduleIndex=0, getMaterialIndex=0;
/* END GLOBAL VARIABLES DECLARE*/

/* PAGE INITIALIZATION */
	//Step 1. Function Initialization
	$(document).ready(function(){
		$("#global-loader").show();
		/* Check session */
		loginData= sessionGet("loginAccount");
		if(loginData==null) {
			//redirect users to login page
			window.location.href = "../login.html";
		}
		else {
			showWebsiteInfo();
			$("#intro").html("Welcome, " + loginData.person.name + "!");
			getResource(FHIRURL, 'Appointment', '?actor=Patient/' + loginData.userSelectedRole.roleID, FHIRResponseType, 'getAppointmentByPatientID');
		}
	});

	//Show Page Title and Header (need to initialize page name beforehand)
	function showWebsiteInfo()
	{
		document.title= loginData.organization.name + " - " + pageName;
		$("#header").html(loginData.organization.name + "<br>" + pageName);
	}

	//Get Person by ID
	function getPerson(){
		initialize();
		getResource(FHIRURL, 'Person', '/' + loginData.person.id, FHIRResponseType, 'createPatient');
	}

	//Step 2. Get all Student's courses which belong to 1 Organization
	function getAppointmentByPatientID(str){
		let obj= JSON.parse(str);
		if (!isError(obj.resourceType, message.signUpFail + message.contactPerson))
		{
			totalAppt= obj.total;
			
			//Step 2.1 If student have not select any course
			if (totalAppt == 0)	
			{
				addNewCourseToList();
			}
			//Step 2.2 If student have select courses before, check whether the this course include in student course list
			else{
				//Query all appointment
				obj.entry.map((entry, i) => {
					let apptID = (entry.resource.id) ? entry.resource.id : '';
					let apptStatus = (entry.resource.status) ? entry.resource.status : '';
					let slotID= (entry.resource.slot) ? entry.resource.slot[0].reference.split('/')[1] : '';
					
					//Store appointment ID, slot ID, and appointment status(booked or waiting list) in CAppointment
					let schedule = new CSchedule(apptID, apptStatus, slotID);	//init empty CSchedule to store appointment and slot ID
					groupMember.newCourse(schedule);
					getResource(FHIRURL, 'Slot', '/' + slotID, FHIRResponseType, 'getSlotByID');
				});
			}
		}
	}

	//Retrieve: Schedule ID
	function getSlotByID(str){
		let obj= JSON.parse(str);
		if (!isError(obj.resourceType, message.signUpFail + message.contactPerson))
		{
			let slotID= (obj.id) ? obj.id : '';
			let scheduleID= (obj.schedule) ? obj.schedule.reference.split('/')[1] : '';
			groupMember.updateScheduleID(slotID, scheduleID);
			getResource(FHIRURL, 'Schedule', '/' + scheduleID, FHIRResponseType, 'getSchedule');
		}
	}

	function getSchedule(str){
		getScheduleIndex++;
		let obj= JSON.parse(str);
		if (!isError(obj.resourceType, message.signUpFail + message.contactPerson))
		{
			let scheduleID = (obj.id) ? obj.id : '';
			let courseName = (obj.specialty) ? obj.specialty[0].coding[0].display : '';
			let practitionerRoleID = (obj.actor) ? obj.actor[0].reference : '';				
			let courseStartDate= (obj.planningHorizon.start) ? obj.planningHorizon.start.split("T")[0] : '';
			let courseEndDate= (obj.planningHorizon.end) ? obj.planningHorizon.end.split("T")[0] : '';
			groupMember.updateScheduleData(scheduleID, courseName, courseStartDate, courseEndDate, practitionerRoleID);	
			
			if(getScheduleIndex == totalAppt)
			{
				// //If login schedule is not include in list
				// if (!groupMember.courseIsExist(loginData.schedule.id))
				// {
					// addNewCourseToList();
				// }
				// else
				// {}
					
				//Get all courses material
				groupMember.course.forEach(item => {
					getResource(FHIRURL, 'PlanDefinition', '?composed-of=Slot/' + item.scheduleID, FHIRResponseType, 'getMaterialByScheduleID');
				});					
			}
		}
	}

	function getMaterialByScheduleID(str){
		getMaterialIndex++;
		let obj= JSON.parse(str);
		if (!isError(obj.resourceType, message.signUpFail + message.contactPerson))
		{
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
						let url= entry.resource.relatedArtifact[index].document.url? entry.resource.relatedArtifact[index].document.url : '';
						let material= new CMaterial(title, type, url);
						groupMember.course.filter(x => x.scheduleID == scheduleID)[0].material.push(material); //must only return 1 row
						index++;
					}
				});
			}
			
			if(getMaterialIndex == groupMember.course.length)
			{
				showMyCourse();
			}
		}
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
			document.getElementById("intro").innerHTML+= '<br>User ID: ' + loginData.userSelectedRole.roleID; //groupMember.patient[0].patientID;
			//check per schedule
			groupMember.course.forEach(item => {
				table.innerHTML+= '<tr><th>No.</th><th>' + item.courseName + '</th></tr>';
				//'<br>' + '(' + item.courseStartDate + ' until '  + item.courseEndDate + ')';
				var indexNo=1;
				//check per slot
				if(item.apptStatus=="booked"){
					item.material.forEach(item2 => {		
						row = table.insertRow(-1);
						row.align="left";
						row.insertCell(0).innerHTML= indexNo++ + ".";
						if(item2.url=="")
						{
							row.insertCell(1).innerHTML= item2.title + "<br>	(ppt will be uploaded soon)";
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
				}
				else{
					row = table.insertRow(-1);
					row.insertCell(0).innerHTML = "You are still in waiting list. Please contact administrator."+ message.contactPerson;
					row.insertCell(0).colspan = 2;
				}
			});
			$("#global-loader").hide();
		//}
	}
	
	function addNewCourseToList(){
		let userInfo = {
			patientId: loginData.patient.id,
			personId: loginData.person.id
		}
		postResource(SelectCourseAPI, '', '', 'text/' + FHIRResponseType, 'getAppointmentByPatientID', JSON.stringify(userInfo));
		// loginData.patient.id= loginData.userSelectedRole.roleID;
		// var str = getResource(FHIRURL, 'Slot', '?schedule=' + DB.schedule, FHIRResponseType, 'getSlotID');
		// createAppointment(str); // in create-course.js
	}
/* END PAGE INITIALIZATION */

function finalResult(str){
	let obj= JSON.parse(str);
	if (!isError(obj.resourceType, message.signUpFail + message.contactPerson))
	{
		$("#global-loader").hide();
		alert(loginData.schedule.name + " course have successfully added to your course list!");
		location.reload();
		// groupMember.course.forEach(item => {
			// getResource(FHIRURL, 'PlanDefinition', '?composed-of=Schedule/' + item.scheduleID, FHIRResponseType, 'getMaterialByScheduleID');
		// });	
	}
}

//Get all slot ID 
function getSlotID(str){ 
	let obj= JSON.parse(str);
	
    obj.entry.map((entry, i) => {
		loginData.slot.id.push(entry.resource.id);
	});
}

function logOut(){			
	 window.sessionStorage.removeItem("loginAccount");
	 window.location.href = "../login.html";
}
