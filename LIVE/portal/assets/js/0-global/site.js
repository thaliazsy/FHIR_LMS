/*
    Public variable area
*/
var partOfid = '';
var web_language= "EN";
var pageName='';

let message= {
	contactPerson: "",
	registerFail: "",
	registerOK: "",	
	loginFail: "",
	requiredField: "",
	emailFormatWrong: "",
	accountExist: "",
	accountUnexist: "",
	passwordWrong: "",
	authorizeFail: "",
	systemError: ""
}

if(web_language=="CH")
{
	// message.contactPerson= "請聯絡" + info.universityName + " " + info.universityDept +
				   // " " + info.cpName + "<br>電話：" + info.cpPhone + "<br>郵件：" + info.cpEmail;
	message.registerFail= "註冊失敗!";
	message.registerOK= "註冊成功";	//, 需等1-2分鐘才可以登入唷！";
	message.loginFail= "無法登入或忘記密碼";
	message.requiredField= "表單未填寫完畢";
	message.emailFormatWrong= "Email 格式錯誤";
	message.accountExist= "該帳號已註冊過!";
	message.accountUnexist= "帳號不存在!";
	message.passwordWrong= "密碼錯誤!";
	message.authorizeFail= "只有教師有權限!";
	message.systemError= "系統錯誤!";
}
else if(web_language=="EN")
{
	message.contactPerson='';
	message.registerFail= "Registration failed!";
	message.registerOK= "Registration completed!"; //, please wait 1-2 minutes for login！";
	message.loginFail= "Login failed or forget password, ";
	message.requiredField= "Required field must not be empty";
	message.emailFormatWrong= "Wrong email format";
	message.accountExist= "This email has been registered!";
	message.accountUnexist= "This user account is not registered!";
	message.updatePasswordOK= "Update password completed！";
	message.updatePasswordFail ="Update password fail!";
	message.passwordWrong= "Wrong password!";
	message.authorizeFail= "Only admin account may login!";
	message.systemError= "System error!";
}

let loginData = {
	token: '',
	expirationDate: '',
	person:{
		id: '',
		identifier: '',
		name: '',
		email: '',
		jobPosition: '',
		institution: '',
		gender: ''
	},
	patient:{
		id: ''
	},
	roles: [],
	roleAccess:[],
	organization: {
		id: '',
		identifier: '',
		status: '',	
		name: 'TCUMI Portal',		
		cpname: 'Thalia',
		cpphone: '+886 901-162-106',
		cpemail: '110325102@gms.tcu.edu.tw'
	},
	schedule: {
		id: '860',
		code: '100001101100',
		name: 'Tel-Conference for Standardized Medical Document and Image Sharing',		
		practitionerRoleID: '856',
		practitionerName: '蕭嘉宏',
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

let CPatient= {
	roleName: '',
	patientID: '',
	organizationID: '',
	organizationName: ''
}

let CPractitioner= {
	roleName: '',
	practID: '',
	practRoleID: '',
	organizationID: '',
	organizationName: ''
}

//Declare variable
let globalPatientID, globalName, globalPersonID;
let personJSONobj, patientJSONobj, appointmentJSONobj, registerJSONobj;
//END: Declare variable

class CPerson{
	constructor() {
		this.id="";
		this.name="";
		this.email="";
		this.jobPosition="";
		this.highestEduDegree="";
		this.institution="";
		this.gender="";
		this.nationality="";
	}
}

// class CPatient{
	// constructor(id, OID) {
		// this.patientID=id;
		// this.organizationID= OID;
		// this.organizationName='';
	// }
// }

class CSchedule{
	constructor(p1, p2, p3) {
		this.scheduleID= '';
		this.courseName= '';
		this.courseStartDate= '';
		this.courseEndDate= '';
		this.practitionerRoleID= ''
		this.apptID= p1;
		this.apptStatus= p2;
		this.slotID= p3;
		this.material=[];
	}
	newAppointment(p){
		this.appointment.push(p)
		return p;
	}
	updateScheduleData(pName, pStartDate, pEndDate, pPRId){
		this.courseName= pName;
		this.courseStartDate= pStartDate;
		this.courseEndDate= pEndDate;
		this.practitionerRoleID= pPRId;
	}
	newSchedule(pId, pName, pStartDate, pEndDate, pPRId){
		this.scheduleID= pId;
		this.courseName= pName;
		this.courseStartDate= pStartDate;
		this.courseEndDate= pEndDate;
		this.practitionerRoleID= pPRId;
	}
	newSlot(id){
		this.slot= id;
	}
}

class CMaterial{
	constructor(ptitle, ptype, purl) {
		this.title= ptitle;
		this.type= ptype;
		this.url= purl;
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
	
	
	updateScheduleID(pSlotID, pScheduleID){
		this.course.forEach(item => { 
			if(item.slotID == pSlotID){
				if(item.scheduleID == "")  item.scheduleID=pScheduleID;
			}
		});
	}
	
	updateScheduleData(pScheduleID, pName, pStartDate, pEndDate, pPRId){
		this.course.forEach(item => { 
			if(item.scheduleID == pScheduleID){
				item.courseName= pName;
				item.courseStartDate= pStartDate;
				item.courseEndDate= pEndDate;
				item.practitionerRoleID= pPRId;
			}
		});
	}
	
	courseIsExist(pScheduleID){
		var exist=false;
		this.course.forEach(item => { 
			let scheduleID= item.scheduleID;
			if(pScheduleID == scheduleID)
			{
				exist=true;
			}
		});
		return exist;
		// if(!exist){
			// let schedule = new CSchedule();
			// schedule.newSchedule(pScheduleID);
			// groupMember.newCourse(schedule);
		// }
		//return this.course.filter(x => x.scheduleID == scheduleID)
	}
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
		"identifier": [ 
			{
				"system": "UserID",
				"value": ""
			}, 
			{
				"system": "Password",
				"value": ""
			},
			{
				"system": "jobPosition",
				"value": ""
			},
			{
				"system": "institution",
				"value": ""
			},
			{
				"system": "nationality",
				"value": ""
			}
		],
		"gender": "",
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
			"reference": "Organization/98a6f5c5-af58-41b5-bd6f-d8ca996b5580"
		},
	};
	
	registerJSONobj= {
		"Person":{},
		"Patient":{}
	};
	initializeAppt();
}
		
		
function initializeAppt(){
	appointmentJSONobj = {
	  "resourceType": "Appointment",
	  "status": "booked",
	  "slot": [],
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


/* Data Field Validation */
function checkRequiredField(fieldArr){
	var count = 0;
	var isEmpty=false, formatIsWrong= false;
	for (var k = 0; k < fieldArr.code.length; k++) {
		let obj= document.getElementById(fieldArr.code[k]);
		if(fieldArr.isRequired[k])
		{
			if (fieldArr.type[k] == "radio" && !obj.checked) {
				isEmpty=true;
				break;
			}
			if ((fieldArr.type[k] == "text" || fieldArr.type[k] == "password") && obj.value == "") { 
				isEmpty=true;
				break;
			}
			if (fieldArr.type[k] == "email") { 
				var emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
				if (obj.value == ""){
					isEmpty=true;
					break;
				}
				else if (obj.value != "" && !emailFormat.test(obj.value)){
					formatIsWrong= true;
					break;
				}
			}
		}
	}
	if (isEmpty || formatIsWrong){
		if (isEmpty) alert(message.requiredField);
		if (formatIsWrong) alert(message.emailFormatWrong);
		document.getElementById("btnLogin").disabled = false;
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

// ______________ PAGE LOADING
$(window).on("load", function(e) {
	$("#global-loader").hide();
})



function urlEncodeFormData(form) {
	var i, e, data = [];
	for (i = 0; i < form.elements.length; i++) {
		e = form.elements[i];
		if(e.name == "email") {e.value=e.value.toLowerCase();}
		if (e.type !== 'button' && e.type !== 'submit' && e.type !== 'password' && !(e.type=='radio' && !e.checked)) {
			data.push(encodeURIComponent(e.name) + '=' + encodeURIComponent(e.value)); 
		}
	}
	return data.join('&');
}