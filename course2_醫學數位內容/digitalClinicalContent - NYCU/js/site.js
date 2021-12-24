let message= {
	contactPerson: "請聯絡" + info.universityName + " " + info.universityDept +
				   " " + info.cpName + "<br>電話：" + info.cpPhone + "<br>郵件：" + info.cpEmail,
	signUpFail: "註冊失敗!",
	signUpOK: "註冊成功, 需等1-2分鐘才可以登入唷！",	
	accountExist: "該帳號已註冊過!"
}

//Declare variable
let globalPatientID, globalName, globalPersonID;
let globalScheduleExist;
let index=0, iOrganization=-1, iAppointment=0, iSlot=0, iSchedule=0,  i3=0, i4=0;
let iTeacher=0;
let curOrganizationID, curOrganizationName;
let tableValue, arrTempSlot, arrSchedule;	
let arrTeacherID= new Array();
let iSchedule2= [0, 0];
tableValue=createMultiArray(tableValue, 4, 5, 5, 10, 30);		//total Organization (patient or practitioner) //total Schedule （Course taken） //total slot //0.userID(Patient or Practitioner), 1.organizationName, 2.slotID, 3.Slot startTime, 4.Slot endTime, 5.scheduleID, 6.videoName, 7.courseName, 8.videoURL, 9.questionnaireURL, 10.practitionerRoleID, 11.Course start date, 12.Course end date, 13.practitionerName
arrTempSlot= createMultiArray(arrTempSlot, 2, 10, 4, 0, 0);	//temporary store all slot of this member	//slot id, start date, end date, schedule id
arrSchedule= createMultiArray(arrSchedule, 2, 5, 6, 0, 0);		//store Schedule id	//course name, teacher name, start date, end date, questionnaire1 URL, total slot
let arrTempSchedule= new Array();							//store Schedule id
let personJSONobj, patientJSONobj, appointmentJSONobj;
//END: Declare variable

class CPerson{
	constructor() {
		this.id="";
		this.name="";
		this.username="";
	}
}

class CPatient{
	constructor(id, OID) {
		this.patientID=id;
		this.organizationID= OID;
		this.organizationName='';
	}
}

class CAppointment{
	constructor(AID, SID) {
		this.appointmentID= AID;
		this.slotID= SID;
	}
}

class CSchedule{
	constructor() {
		this.scheduleID= '';
		this.appointment=[];
	}
	newAppointment(p){
		this.appointment.push(p)
		return p;
	}
}

class CPatients {
	constructor(){
		this.patient = [];
		this.course= [];
	}
	// create a new patient and save it in the collection
	newMember(p){
		this.patient.push(p);
		return p;
	}
	newCourse(p){
		this.course.push(p);
		return p;
	}
	get allMember(){
		return this.patient;
	}
	
	// get someCourse(scheduleID){
		// return this.course.filter;
	// }
	
	courseIsExist(pScheduleID, pSlotID){
		this.course.forEach(item => { 
			let scheduleID= item.scheduleID;
			item.appointment.forEach(item2 => { 
				let slotID= item2.slotID;
				if(slotID == pSlotID){
					if(item.scheduleID == "")  item.scheduleID=pScheduleID;
					return 
				}
			});
		});
		//return this.course.filter(x => x.scheduleID == scheduleID)
	}
	
	// get indexMember(){
		// return this.patient.forEach(item => {
			// item.
		// });
	// }
	// get total patient
	get numberOfMember(){
		return this.patient.length;
	}
}

let groupMember= new CPatients();

function initialize(){
	personJSONobj = {
		"resourceType": "Person",
		"active": "true",
		"identifier": [ {
			"system": "UserID",
			"value": "test1"
		}, {
			"system": "Password",
			"value": "MWI0ZjBlOTg1MTk3MTk5OGU3MzIwNzg1NDRjOTZiMzZjM2QwMWNlZGY3Y2FhMzMyMzU5ZDZmMWQ4MzU2NzAxNA=="
		} ],
		"name": [ {
			"text": "testPerson1"
		} ],
		"telecom": [
			{
			  "system": "email",
			  "value": "Jim@example.org"
			}
		]
	};
	// "link": [ {
		// "target": {
			// "reference": "patient/2138343",
			// "display": "testpatient1"
		// }
	// } ]
	
	patientJSONobj = {
		"resourceType": "Patient",
		"active": "true",
		"name": [ {
			"text": "testPatient1"
		} ],
		"managingOrganization": {
			"reference": "Organization/2137917"
		},
	};
	
	appointmentJSONobj = {
	  "resourceType": "Appointment",
	  "status": "booked",
	  "slot": [ {
		"reference": "Slot/2138767"
	  } ],
	  "participant": [ {
		"actor": {
		  "reference": "Patient/2138343",
		  "display": "testPatient1"
		}
	  }, {
		"actor": {
		  "reference": "PractitionerRole/2138342",
		  "display": "testPractitionerRole"
		}
	  } ]
	};
}
		
function checkRequiredField(reqFieldNum){
	var count = 0; //計數器
	var Total_Obj = document.getElementsByTagName("input");
	//alert(Total_Obj.length);
	for (var k = 0; k < Total_Obj.length; k++) {
		if (Total_Obj[k].type == "radio") {
			if (Total_Obj[k].checked) count++;
		}
		if (Total_Obj[k].type == "text" || Total_Obj[k].type == "password") { 
			if (Total_Obj[k].value != "") count++
		}
		if (Total_Obj[k].type == "email") { 
			var emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			if (Total_Obj[k].value != ""){
				if(emailFormat.test(Total_Obj[k].value)) count++;
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

function createMultiArray(arrName, type, n1, n2, n3, n4){
	arrName= new Array(n1);
	for (var i = 0; i < arrName.length; i++) {
		arrName[i] = new Array(n2);						
	}
	
	if(type>=3){
		for (var i = 0; i < arrName.length; i++) {
			for (var j = 0; j < arrName[i].length; j++) {
				arrName[i][j] = new Array(n3);				
			}
		}
	}
	
	if(type==4){
		for (var i = 0; i < arrName.length; i++) {
			for (var j = 0; j < arrName[i].length; j++) {
				for (var k = 0; k < arrName[i].length; k++) {
					arrName[i][j][k] = new Array(n4);				
				}			
			}
		}
	}
	return arrName;
}

function getPatientByID(obj){
	let patientID = (obj.id) ? obj.id : '';
	let organizationID =(obj.managingOrganization.reference) ? obj.managingOrganization.reference.split('/')[1] : '';
	let p = new CPatient(patientID, organizationID)
	groupMember.newMember(p);
	getResource(FHIRURL, 'Organization', '/' + organizationID, FHIRResponseType, 'getOrganizationByID');
}

function getOrganizationByID(obj){
	let organizationID = (obj.id) ? obj.id : '';
	let organizationName = (obj.name) ? obj.name : '';
	groupMember.patient.filter(x => x.organizationID == organizationID && x.organizationName == '')[0].organizationName = organizationName; //must only return 1 row
	let patientID= groupMember.patient.filter(x => x.organizationID == organizationID)[0].patientID; 
	document.getElementById("titleDiv").innerHTML= organizationName + " - 學習平台";					//organizationName
	getResource(FHIRURL, 'Appointment', '?actor=Patient/' + patientID, FHIRResponseType, 'getAppointmentByPatientID');
}

function getAppointmentByPatientID(obj){
	if (obj.total == 0)	alert('無資料');
	else{
		obj.entry.map((entry, i) => {
			let appointmentID = (entry.resource.id) ? entry.resource.id : '';
			let slotID= (entry.resource.slot) ? entry.resource.slot[0].reference.split('/')[1] : '';
			let appointment = new CAppointment(appointmentID, slotID);
			let schedule = new CSchedule();
			schedule.newAppointment(appointment);
			groupMember.newCourse(schedule);
			getResource(FHIRURL, 'Slot', '/' + slotID, FHIRResponseType, 'getSlotByID');
		});
	}
}

function getSlotByID(obj){
	let slotID= (obj.id) ? obj.id : '';
	let scheduleID= (obj.schedule) ? obj.schedule.reference.split('/')[1] : '';
	let planDefinitionID= (obj.schedule) ? obj.schedule.reference.split('/')[1] : '';
	
	//let item= groupMember.courseIsExist(scheduleID);
	groupMember.course.forEach(item => { 
		item.appointment.forEach(item2 => { 
			let retslotID= item2.slotID;
			let retcomment= item2.comment;
			if(retslotID == slotID){
				if(item.scheduleID == "")  item.scheduleID=scheduleID;
			}
		});
	});
	//check course yg contain scheduleID	
	// if(!groupMember.course){
		// groupMember.course.filter(x => x.scheduleID == '').forEach(item => {
			// let appointment= item.appointment.contains(slotID);
			// let x=1;
		// });
	// }
	// var temp= jsonOBJ.schedule.reference;
	// if (!arrTempSchedule.includes(temp)){
		// arrTempSchedule.push(temp);
		// arrSchedule[iSchedule][5]=0;	//total slot
		// iSchedule++;
	// }
	// var index = arrTempSchedule.indexOf(temp);
	// var index1= arrSchedule[index][5];
	// tableValue[iOrganization][index][index1][0] = jsonOBJ.start;									//0.Slot startTime (use to paixu)
	// tableValue[iOrganization][index][index1][1] = jsonOBJ.end;										//1.Slot endTime
	// var totVideo= jsonOBJ.appointmentType.coding.length;
	// tableValue[iOrganization][index][index1][2]= totVideo;
	// var index2= 3;
	// for(var i=0; i<totVideo; i++)
	// {
		// let url= jsonOBJ.appointmentType.coding[i].code;
		// tableValue[iOrganization][index][index1][index2++] = jsonOBJ.appointmentType.coding[i].display;		//courseMaterial title
		// if(jsonOBJ.appointmentType.coding[i].system == "questionnaire")
			// url+= '?patientID=' + globalPatientID + '&subjectID=' + jsonOBJ.schedule.reference;
		// tableValue[iOrganization][index][index1][index2++] = url;		//courseMaterial URL
	// }
	// arrSchedule[index][5]++;
	// iSlot++;
	
	// if(iAppointment==iSlot){
		// for (var i=0;i<iSchedule;i++){ 
			// let urlStr= FHIRURL + arrTempSchedule[i];
			// HTTPGetData(urlStr, "Schedule");
		// }
	// }
}

function getSchedule(obj){
	let schedule = CSchedule();
		
}

function getPractitionerRole(obj){
	
}

function getFHIRMyCourse(jsonOBJ, type){	//我的課程
	if (type=="Patient"){
		iOrganization++;
		curOrganizationID = jsonOBJ.managingOrganization.reference;
		let urlStr= FHIRURL + curOrganizationID;
		HTTPGetData(urlStr, "Organization");
	}
	else if (type=="Organization"){
		//document.getElementById("titleDiv").innerHTML= jsonOBJ.name + " - 學習平台";					//organizationName
		let urlStr= FHIRURL + 'Appointment?actor=Patient/' + globalPatientID;
		HTTPGetData(urlStr, "Appointment");	
	}
	else if (type=="Appointment"){
		if (jsonOBJ.total == 0)	alert('無資料');
		else{
			for (var i=0;i<((jsonOBJ.total>10)?10:jsonOBJ.total);i++){ 
				arrTempSlot[iAppointment] = jsonOBJ.entry[i].resource.slot[0].reference;			//slotID
				iAppointment++;
				let urlStr= FHIRURL + arrTempSlot[i];
				HTTPGetData(urlStr, "Slot");
			}
		}
	}
	else if (type=="Slot"){
		var temp= jsonOBJ.schedule.reference;
		if (!arrTempSchedule.includes(temp)){
			arrTempSchedule.push(temp);
			arrSchedule[iSchedule][5]=0;	//total slot
			iSchedule++;
		}
		var index = arrTempSchedule.indexOf(temp);
		var index1= arrSchedule[index][5];
		tableValue[iOrganization][index][index1][0] = jsonOBJ.start;									//0.Slot startTime (use to paixu)
		tableValue[iOrganization][index][index1][1] = jsonOBJ.end;										//1.Slot endTime
		var totVideo= jsonOBJ.appointmentType.coding.length;
		tableValue[iOrganization][index][index1][2]= totVideo;
		var index2= 3;
		for(var i=0; i<totVideo; i++)
		{
			let url= jsonOBJ.appointmentType.coding[i].code;
			tableValue[iOrganization][index][index1][index2++] = jsonOBJ.appointmentType.coding[i].display;		//courseMaterial title
			if(jsonOBJ.appointmentType.coding[i].system == "questionnaire")
				url+= '?patientID=' + globalPatientID + '&subjectID=' + jsonOBJ.schedule.reference;
			tableValue[iOrganization][index][index1][index2++] = url;		//courseMaterial URL
		}
		arrSchedule[index][5]++;
		iSlot++;
		
		if(iAppointment==iSlot){
			for (var i=0;i<iSchedule;i++){ 
				let urlStr= FHIRURL + arrTempSchedule[i];
				HTTPGetData(urlStr, "Schedule");
			}
		}
	}
	else if (type=="Schedule"){
		var index = arrTempSchedule.indexOf("Schedule/" + jsonOBJ.id);								
		//var txt= jsonOBJ.specialty[0].coding[0].display.split('-');
		arrSchedule[index][0] = jsonOBJ.specialty[0].coding[0].display;	//0.courseName
		arrSchedule[index][1] = jsonOBJ.actor[0].reference;				//1.practitionerRoleID (temp)
		txt= jsonOBJ.planningHorizon.start.split("T");
		arrSchedule[index][2] = txt[0];									//2.Course start date
		txt= jsonOBJ.planningHorizon.end.split("T");
		arrSchedule[index][3] = txt[0];									//3.Course end date
		i3++;
		
		if(iSchedule==i3){
			for (var i=0;i<iSchedule;i++){ 
				let urlStr= FHIRURL + arrSchedule[i][1];							
				HTTPGetData(urlStr, "PractitionerRole");
			}
		}
	}
	else if (type=="PractitionerRole"){
		arrSchedule[i4][1] = jsonOBJ.practitioner.display;				////1.practitioner name
		i4++;
		
		if(iSchedule==i4) createTable();
	}
}

var curTotal, slotType=new Array();
function getFHIRSelectCourse(jsonOBJ, type){	//選課
	if (type=="getAppointment"){
		if (jsonOBJ.total == 0){
			let urlStr= FHIRURL + "Slot?schedule=reference|" + course1.scheduleID;
			HTTPGetData(urlStr, "getSlotOfSchedule");
		}
		else{
			for (var i=0;i<((jsonOBJ.total>10)?10:jsonOBJ.total);i++){ 
				arrTempSlot[iAppointment] = jsonOBJ.entry[i].resource.slot[0].reference;			//slotID
				iAppointment++;
			}
			globalScheduleExist=0;
			for (var i=0;i<iAppointment;i++){ 
				if(globalScheduleExist==1) break;
				let urlStr= FHIRURL + arrTempSlot[i];
				HTTPGetData(urlStr, "getSlotOfAppointment");
			}
		}
	}
	else if (type=="getSlotOfAppointment"){
		var temp= jsonOBJ.schedule.reference;
		if (temp == course1.scheduleID)	globalScheduleExist=1;
		if(globalScheduleExist==0){
			let urlStr= FHIRURL + "Slot?schedule=reference|" + course1.scheduleID;
			HTTPGetData(urlStr, "getSlotOfSchedule");
		}
	}
	else if (type=="getSlotOfSchedule"){
		slotExist=0;
		if (jsonOBJ.total == 0)	var iiii=0;
		else{
			curTotal= jsonOBJ.total;
			checkAllSlot(jsonOBJ);
		}
	}
}

function checkAllSlot(jsonOBJ){
	var i=0;
	while(i < ((curTotal>20)?20:curTotal)){
		if(!slotType.includes(jsonOBJ.entry[i].resource.appointmentType.coding[0].display) && jsonOBJ.entry[i].resource.status=="free"){
			slotType.push(jsonOBJ.entry[i].resource.appointmentType.coding[0].display);
			initialize();
			appointmentJSONobj.slot[0].reference= "Slot/" + jsonOBJ.entry[i].resource.id;							//slot ID
			appointmentJSONobj.participant[0].actor.reference= globalPatientID;										//patient ID
			appointmentJSONobj.participant[0].actor.display= globalName;											//patient name
			appointmentJSONobj.participant[1].actor.reference= course1.practitionerRoleID;			//PractitionerRole ID
			appointmentJSONobj.participant[1].actor.display= course1.practitionerName;		//PractitionerRole name
			appointmentJSONobj = JSON.stringify(appointmentJSONobj);
			HTTPPostData(FHIRURL + "Appointment", jsonOBJ.entry[i].resource, "PostAppointment");
			slotExist=1;
			//break;
		}
		i++;
	}
	
	curTotal-=20;
	if(slotExist==0){
		if(curTotal>0) HTTPGetData(jsonOBJ.link[1].url, "getNextSlot");
		else{
			alert("報名人數已額滿！");
			document.getElementById("btnSubmit").disabled = false;
		}
	}
}

function queryParam(){
	var url = location.href;
	if(url.indexOf('?')!=-1)
	{
		var ary = url.split('?')[1].split('&');
		for(i=0;i<=ary.length-1;i++)
		{
			if(ary[i].split('=')[0] == 'patientID')
				globalPatientID = ary[i].split('=')[1];
			else if(ary[i].split('=')[0] == 'name')
				globalName = decodeURIComponent(ary[i].split('=')[1]);
			else if(ary[i].split('=')[0] == 'personID')
				globalPersonID = ary[i].split('=')[1];
		}
	}
}

function HTTPGetData(urlStr, type) {
	var HttpObj = new XMLHttpRequest();
	HttpObj.onreadystatechange = function () {
		if (this.readyState === 4) {
			ret = this.responseText;
			//alert(ret);
			var jsonOBJ =JSON.parse(ret);
			if(type == "loginVerify")	verifyUser(jsonOBJ);
			else if(type == "CheckPersonUserID")	verifyUser(jsonOBJ);
			else if(type == "getAppointment" || type == "getSlotOfAppointment" || type == "getSlotOfSchedule")	getFHIRSelectCourse(jsonOBJ, type);
			else if(type == "getNextSlot")	checkAllSlot(jsonOBJ);
			else getFHIRMyCourse(jsonOBJ, type);
		}
	}
	HttpObj.open("GET", urlStr, true);
	HttpObj.send();
}

function HTTPPostData(urlStr, dataStr, type) {
    var HttpObj = new XMLHttpRequest();
    HttpObj.open("POST", urlStr, true);
    HttpObj.setRequestHeader("Content-type", "application/json+fhir");
    HttpObj.onreadystatechange = function () {
        if (this.readyState === 4) {
            ret = this.responseText;
            //alert(ret);
			var jsonOBJ =JSON.parse(ret);
			//check if error occured	//DIFFERENT PART
			if(jsonOBJ.resourceType == "OperationOutcome"){
				alert('系統錯誤! 請聯絡慈大醫資龍昱璇學姊，\n電話：0965006102\n郵件：108316107@gms.tcu.edu.tw')
				document.getElementById("btnSubmit").disabled = false;
				return 0;
			}
			
			if(type == "postPatient")	createPerson("Patient/" + jsonOBJ.id);	//after patient created, create person
			else if(type == "postPerson"){
				//check this patient has appointment to this schedule or not
				let urlStr= FHIRURL + 'Appointment?actor=reference|' + globalPatientID;
				HTTPGetData(urlStr, "getAppointment");
			}
			else if(type == "PostAppointment"){
				let slotID= dataStr.id;
				dataStr.status="busy";
				dataStr = JSON.stringify(dataStr);
				HTTPPutData(FHIRURL + 'Slot/' + slotID, dataStr);
			}
			else{
				alert(this.responseText);
			}
        }
    }
    if(type!= "PostAppointment") HttpObj.send(dataStr);
	else HttpObj.send(appointmentJSONobj);
}

function HTTPPutData(urlStr, dataStr) {
	var HttpObj = new XMLHttpRequest();
	HttpObj.open("PUT", urlStr, true);
	HttpObj.setRequestHeader("Content-type", "application/json+fhir");
    HttpObj.onload = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
			//alert(ret);
			alert("註冊成功，需等1-2分鐘才可以登入唷！");
			//document.getElementById("btnSubmit").disabled = false;
			window.close();
        }
    }
    HttpObj.send(dataStr);
}