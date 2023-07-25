//Initialize temporary variable

loginData = {
	person: {
		id: '',
		identifier: '',
		name: '',
		email: '',
		gender: '',
		nationality: '',
		jobPosition: '',
		highestEduDegree: '',
		institution: ''
	},
	patient: {
		id: ''
	},
	role: [],
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
	slot: {
		id: []
	},
	appointment: {
		id: '',
		bookingsuccess: false
	}
}

var registeredUser = {
	patientId: "",
	personId: ""
}
//Set table field
let field = {
	code: ["name", "email", "ppassword", "gender", "institution", "jobPosition", "nationality"],
	placeholder: ["", "", "", "例如： 慈濟大學 / 慈濟醫院", "例如： 學生 / 教授 / 護理人員",],
	desc: [],
	isRequired: [1, 1, 1, 0, 0, 0, 0],
	type: ["text", "email", "password", "radio", "text", "text", "text", "text"]
};

if (web_language == "CH") {
	field.desc = ["姓名（暱稱）", "Email", "密碼", "就讀機構", "職稱"];
	siteName = "TCUMI 平台"
	pageName = "註冊網頁";
}
else if (web_language == "EN") {
	field.desc = ["Name (nickname)", "Email", "Password", "Gender", "Educational/Working Institution", "Job Position", "Nationality"];
	field.placeholder = ["", "", "", "", "e.g. Tzu Chi University", "", ""];
	siteName = "TCUMI Portal"
	pageName = "Register";
}

//local variable for store temporary json obj
let personJSON, apptJSON;

//Function Initialization
$(document).ready(function () {
	// Clear session
	let stringValue = window.sessionStorage.getItem("loginAccount")
	if (stringValue != null) {
		window.sessionStorage.removeItem("loginAccount");
	}
	showForm();
});


function showForm() {
	let temp = "";
	// Show Login Form field
	for (let i = 0; i < field.desc.length; i++) {
		temp += '<tr><td class="col-01">' + field.desc[i];
		if (field.isRequired[i])
			temp += '<font color="red"> *</font>';

		temp += '</td><td class="col-02">:&nbsp;';

		if (field.type[i] == "radio")
		{
			temp += '<input type="radio" id="male" name="gender" value="male" ><label for="male"> &nbsp;male</label> &nbsp;'+
					'<input type="radio" id="female" name="gender" value="female"><label for="female"> &nbsp;female</label> &nbsp;'+
					'<input type="radio" id="other" name="gender" value="other" checked><label for="other"> &nbsp;other</label';
		}
		else
			temp += '<input class="register-field" type="' + field.type[i] + '" id="' + field.code[i] + '" name="' + field.code[i] + '" placeholder="' + field.placeholder[i] + '" ';

		if (field.type[i] == "password")
			temp += 'onkeyup="SHA256PWD.value = sha256(this.value);" ';

		if (field.isRequired[i])
			temp += 'required';

		temp += '><br></td></tr>';
	}
	temp += '<tr><td colspan="2" align="right"><input id="register-btn" type="button" value="Submit" onclick="validateData()"></td></tr>';
	$("#register-table").html(temp);

	showWebsiteInfo();
}

//Show Page Title and Header (need to initialize page name beforehand)
function showWebsiteInfo() {
	document.title = loginData.organization.name + " - " + pageName;
	$("#header").html(loginData.organization.name + "<br>" + pageName);
}

//Validate data input by user
function validateData() {
	let str = "{status='waitlist'}";
	if (checkRequiredField(field)) {
		$("#global-loader").show();
		loginData.person.name = $('#name').val();
		loginData.person.email = $("#email").val();
		loginData.person.institution = $("#institution").val();
		loginData.person.jobPosition = $("#jobPosition").val();
		loginData.person.nationality = $("#nationality").val();
		loginData.person.gender = document.querySelector('input[name="gender"]:checked').value;
		createPerson();
		createPatient();
		registerJSONobj.Person = personJSONobj;
		registerJSONobj.Patient = patientJSONobj;
		let registerStr = JSON.stringify(registerJSONobj);
		//let str= personJSONobj
		postResource(FHIRURLRegister, '', '', 'text/' + FHIRResponseType, 'setToken', registerStr);
	}
}

//Verify FHIR Person & Patient exist or not 
function verifyUser(str) {
	let obj = JSON.parse(str);
	//if person exist -> alert "user exist"
	if (obj.total > 0) {
		alert(message.accountExist + '\n' + 'If you are the owner of "' + loginData.person.email + '" this account, please login directly');
		$("#global-loader").hide();
	}
	//if person unexist -> check slot availability -> create new Person ->  create new Patient
	else {
		getResource(FHIRURL, 'Slot', '?schedule=' + DB.schedule, FHIRResponseType, 'getSlotID');
	}
}

//Get all slot ID 
function getSlotID(str) {
	let obj = JSON.parse(str);

	obj.entry.map((entry, i) => {
		loginData.slot.id.push(entry.resource.id);
	});
	createPerson();
}

//Create new FHIR Patient
function createPatient() {
	patientJSONobj.name[0].text = loginData.person.name;
	patientJSONobj.managingOrganization.reference = 'Organization/98a6f5c5-af58-41b5-bd6f-d8ca996b5580';	// Organization: Tzu Chi Hospital
	patientJSONobj.managingOrganization.display = 'Tzu Chi Hospital';
}

//Create new FHIR Person
function createPerson() {
	initialize();
	personJSONobj.identifier[0].value = loginData.person.email;
	personJSONobj.identifier[1].value = $('#SHA256PWD').val();
	personJSONobj.identifier[2].value = loginData.person.jobPosition;
	personJSONobj.identifier[3].value = loginData.person.institution;
	personJSONobj.identifier[4].value = loginData.person.nationality;
	personJSONobj.name[0].text = loginData.person.name;
	personJSONobj.telecom[0].value = loginData.person.email;
	personJSONobj.gender = document.querySelector('input[name="gender"]:checked').value;
	//personJSONobj = JSON.stringify(personJSONobj);
}

function finalResult(res) {
	var obj = JSON.parse(res);
	//2.1.1 Get account information
	let token = res.getResponseHeader("Authorization");
	if (!isError(obj.resourceType, message.registerFail + message.contactPerson)) {
		$("#global-loader").hide();
		alert(message.registerOK);
		window.close();
	}
}

function setToken(res) {
	var obj = JSON.parse(res);
	//2.1.0 Alert account existed
	if (obj.msg != undefined) {
		alert(obj.msg)
		location.reload();
	}
	else {
		alert("Register success.");
		registeredUser.patientId = obj.patient;
		registeredUser.personId = obj.person;
		formData = 'email=' + personJSONobj.identifier[0].value + '&password=' + personJSONobj.identifier[1].value;
		//postResource(FHIRURLLogin, '', '', 'application/x-www-form-urlencoded', 'createAppointment', formData);
		getAuthentication(FHIRURLLogin, 'application/x-www-form-urlencoded', formData, 'role/index.html');
	}

}
function createAppointment(res) {
	var obj = JSON.parse(res);
	//2.1.1 Post selected course
	loginData.token = res.getResponseHeader("Authorization");
	let registerStr = JSON.stringify(registeredUser);
	postResource(SelectCourseAPI, '', '', 'text/' + FHIRResponseType, 'callLoginAPI', registerStr);

}

function callLoginAPI(res) {
	formData = 'username=' + personJSONobj.identifier[0].value + '&password=' + personJSONobj.identifier[1].value;
	postResource(FHIRURLLogin, '', '', 'application/x-www-form-urlencoded', 'getUserInformation', formData);
}