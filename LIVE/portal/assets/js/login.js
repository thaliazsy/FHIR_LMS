/*
	Desc: This login form is attached to 1 course. User must already have Person, Patient, and Appointment Resource for being able login successfully to the home screen.
	The login form also works as “select course" feature at the same time, but only limited to 1 course
*/

/* PAGE INITIALIZATION */
//Set table field
let field = {
	code: ["email", "password"],
	desc: [],
	isRequired: [1, 1],
	type: ["text", "password"],
};
let personstr = '';

if (web_language == "CH") {
	field.desc = ["帳號 (Email)", "密碼"];
	field.register = "註冊";
	field.login = "登入";
	pageName = "登入網頁";
}
else if (web_language == "EN") {
	field.desc = ["Email", "Password"];
	field.register = "Register";
	field.login = "Login";
	pageName = "Login";
}

//Step 1.Function Initialization
$(document).ready(function () {
	// Clear session
	let stringValue = window.sessionStorage.getItem("loginAccount")
	if (stringValue != null) {
		window.sessionStorage.removeItem("loginAccount");
	}
	showForm();
});

//Step 2. Show login form
function showForm() {
	let temp = "";
	// Show Login Form field
	for (let i = 0; i < field.desc.length; i++) {
		temp += '<tr><td>' + field.desc[i];
		if (field.isRequired[i])
			temp += '<font color="red"> *</font>';

		temp += '</td><td>:&nbsp;<input type="' + field.type[i] + '" id="' + field.code[i] + '" name="' + field.code[i] + '"';

		if (field.type[i] == "password")
			temp += 'onkeyup="SHA256PWD.value = sha256(this.value);" ';

		if (field.isRequired[i])
			temp += 'required';

		temp += '><br></td></tr>';
	}
	url = "'lms-register.html';";
	temp += '<tr><td align="right"><input id="btnRegister" type="button" value="' + field.register + '" onclick="window.location.href=' + url + '" /></td>';
	temp += '<td align="right"><input id="btnLogin" type="button" value="' + field.login + '" onclick="validateData()" /></td></tr>'
	$('#mainTable').html(temp);

	showWebsiteInfo();
}

//Step 3. Get Organization information
function getOrganization(str) {
	let obj = JSON.parse(str);
	if (retValue(obj)) {
		loginData.organization.id = (obj.id) ? obj.id : '';
		loginData.organization.identifier = (obj.identifier) ? obj.identifier[0].value : '';
		loginData.organization.status = (obj.active == true) ? 'Active' : 'Inactive';
		loginData.organization.name = (obj.name) ? obj.name : '';
		if (obj.contact) {
			loginData.organization.cpname = obj.contact[0].name.text;
			obj.contact[0].telecom.map((telecom, i) => {
				if (telecom.system == "email")
					loginData.organization.cpemail = telecom.value;
				else if (telecom.system == "phone")
					loginData.organization.cpphone = telecom.value;
			});
		}
	}
	// Get Schedule Information
	getResource(FHIRURL, 'Schedule', '/' + DB.schedule, FHIRResponseType, 'getSchedule');
}

//Step 4. Get Course information
function getSchedule(str) {
	let obj = JSON.parse(str);
	if (retValue(obj)) {
		loginData.schedule.id = (obj.id) ? obj.id : '';
		loginData.schedule.code = (obj.specialty) ? obj.specialty[0].coding[0].code : '';
		loginData.schedule.name = (obj.specialty) ? obj.specialty[0].coding[0].display : '';
		loginData.schedule.practitionerRoleID = (obj.actor) ? obj.actor[0].reference.split('/')[1] : '';
		loginData.schedule.practitionerName = (obj.actor) ? obj.actor[0].display : '';
	}
	//Get Group to get max participant quota
	getResource(FHIRURL, 'Group', '?identifier=' + loginData.schedule.code + '&code=201', FHIRResponseType, "showWebsiteInfo");
}

//Step 5. Show Page Title and Header
function showWebsiteInfo() {
	document.title = loginData.organization.name + " - " + pageName;
	$("#header").html(loginData.organization.name + "<br>" + pageName);
	message.contactPerson = "請聯絡 " + loginData.organization.cpname + "<br>Phone No.：" + loginData.organization.cpphone + "<br>Email：" + loginData.organization.cpemail;
	$("#cp").html(message.loginFail + message.contactPerson);
}
/* END PAGE INITIALIZATION */

/* WHEN USER SUBMIT LOGIN FORM */
//Step 1. Validate login form data (e.g. required field, field format)
function validateData() {
	if (checkRequiredField(field)) {
		$("#global-loader").show();
		var formData = urlEncodeFormData(document.getElementById('loginForm'));
		//function getAuthentication(url, FHIRResponseType, RequestData, redirect_uri){
		getAuthentication(FHIRURLLogin, 'application/x-www-form-urlencoded', formData, 'role/index.html');
		//postResource(FHIRURLLogin, '', '', 'application/x-www-form-urlencoded', 'getUserInformation', formData);
	}
}

