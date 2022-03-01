let message= {
	contactPerson: "",
	signUpFail: "",
	signUpOK: "",	
	signInFail: "",
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
	message.contactPerson= "請聯絡" + info.universityName + " " + info.universityDept +
				   " " + info.cpName + "<br>電話：" + info.cpPhone + "<br>郵件：" + info.cpEmail;
	message.signUpFail= "註冊失敗!";
	message.signUpOK= "註冊成功";	//, 需等1-2分鐘才可以登入唷！";
	message.signInFail= "無法登入或忘記密碼";
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
	message.contactPerson= "please contact " + info.cpName + "<br>Phone No.：" + info.cpPhone + "<br>Email：" + info.cpEmail;
	message.signUpFail= "Registration failed!";
	message.signUpOK= "Registration completed!"; //, please wait 1-2 minutes for sign in！";
	message.signInFail= "Sign in failed or forget password, ";
	message.requiredField= "Required field must not be empty";
	message.emailFormatWrong= "Wrong email format";
	message.accountExist="This email has been registered!";
	message.accountUnexist= "This user account is not registered!";
	message.updatePasswordOK= "Update password completed！";
	message.updatePasswordFail ="Update password fail!";
	message.passwordWrong= "Wrong password!";
	message.authorizeFail= "Only admin account may login!";
	message.systemError= "System error!";
}

//Declare variable
let globalPatientID, globalName, globalPersonID;
let personJSONobj, patientJSONobj, appointmentJSONobj;
//END: Declare variable

class CPerson{
	constructor() {
		this.id="";
		this.name="";
		this.username="";
		this.jobPosition="";
		this.highestEduDegree="";
		this.institution="";
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
	constructor(p1, p2, p3, p4, p5) {
		this.scheduleID= p1;
		this.courseName= p2;
		this.courseStartDate= p3;
		this.courseEndDate= p4;
		this.practitionerRoleID= p5;
		this.appointment=[];
		this.material=[];
	}
	newAppointment(p){
		this.appointment.push(p)
		return p;
	}
	newSchedule(id){
		this.scheduleID= id;
	}
}

class CMaterial{
	constructor(ptitle, purl) {
		this.title= ptitle;
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
	
	courseIsExist(pScheduleID){
		var exist=false;
		this.course.forEach(item => { 
			let scheduleID= item.scheduleID;
			if(pScheduleID == scheduleID)
			{
				exist=true;
			}
			// item.appointment.forEach(item2 => { 
				// let slotID= item2.slotID;
				// if(slotID == pSlotID){
					// if(item.scheduleID == "")  item.scheduleID=pScheduleID;
					// return 
				// }
			// });
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
				"value": "MWI0ZjBlOTg1MTk3MTk5OGU3MzIwNzg1NDRjOTZiMzZjM2QwMWNlZGY3Y2FhMzMyMzU5ZDZmMWQ4MzU2NzAxNA=="
			},
			{
				"system": "HighestEduDegree",
				"value": ""
			},
			{
				"system": "Institution",
				"value": ""
			}
		],
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
	
	initializeAppt();
}
		
		
function initializeAppt(){
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

function checkRequiredField(fieldArr){
	var count = 0; //計數器
	var isEmpty=false, formatIsWrong= false;
	for (var k = 0; k < fieldArr.code.length; k++) {
		let obj= document.getElementById("p" + fieldArr.code[k]);
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