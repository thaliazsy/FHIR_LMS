/*
	Desc: This login form is attached to 1 course. User must already have Person, Patient, and Appointment Resource for being able login successfully to the home screen.
	The login form also works as “select course" feature at the same time, but only limited to 1 course
*/

/* PAGE INITIALIZATION */
	//Set table field
	let field= {
		code: ["username", "ppassword"],
		desc: [],
		isRequired: [1,1],		
		type: ["text", "password"],
		signUpPage: ""
	};
	let personstr='';

	if(web_language=="CH")
	{
		field.desc= ["帳號 (Email)", "密碼"];
		pageName= "登入網頁";
		field.signUpPage= "報名請點我";
	}
	else if(web_language=="EN")
	{
		field.desc= ["Email", "Password"];
		pageName= "Login";
		field.signUpPage= "Click here to sign up";
	}

	//Step 1.Function Initialization
	$(document).ready(function(){
		// Clear session
		let stringValue = window.sessionStorage.getItem("loginAccount")
		if (stringValue != null) 
		{
			window.sessionStorage.removeItem("loginAccount");
		}
		showForm();
	});

	//Step 2. Show login form
	function showForm()
	{
		let temp="";
		// Show Login Form field
		for(let i=0; i<field.desc.length;i++){
			temp += '<tr><td>' + field.desc[i];
			if(field.isRequired[i])			
				temp += '<font color="red"> *</font>';
			
			temp += '</td><td>:&nbsp;<input type="' + field.type[i] + '" id="' + field.code[i] + '" name="' + field.code[i] + '"';
			
			if(field.type[i] == "password")
				temp += 'onkeyup="SHA256PWD.value = sha256(this.value);" ';
				
			if(field.isRequired[i])			
				temp += 'required';
				
			temp += '><br></td></tr>';
		}
		temp+= '<tr><td colspan="2" align="right"><input id="btnSubmit" type="button" value="Submit" onclick="validateData()"></td></tr>';
		$('#mainTable').html(temp);
		$('#linkToSignUpPage').html(field.signUpPage);
		
		// Get Organization Information
		getResource(FHIRURL, 'Organization', '/' + DB.organization, FHIRResponseType, 'getOrganization');
	}

	//Step 3. Get Organization information
	function getOrganization(str){
		let obj= JSON.parse(str);
		if(retValue(obj))
		{
			loginData.organization.id = (obj.id) ? obj.id : '';
			loginData.organization.identifier= (obj.identifier)? obj.identifier[0].value : '';
			loginData.organization.status= (obj.active == true) ? 'Active' : 'Inactive';
			loginData.organization.name= (obj.name) ? obj.name : '';
			if (obj.contact)
			{
				loginData.organization.cpname= obj.contact[0].name.text;
				obj.contact[0].telecom.map((telecom, i) => {
					if (telecom.system == "email")
						loginData.organization.cpemail= telecom.value;
					else if (telecom.system == "phone")
						loginData.organization.cpphone= telecom.value;
				});
			}
		}
		// Get Schedule Information
		getResource(FHIRURL, 'Schedule', '/' + DB.schedule, FHIRResponseType, 'getSchedule');
	}

	//Step 4. Get Course information
	function getSchedule(str){
		let obj= JSON.parse(str);
		if(retValue(obj))
		{
			loginData.schedule.id= (obj.id)? obj.id : '';
			loginData.schedule.code= (obj.specialty)? obj.specialty[0].coding[0].code : '';
			loginData.schedule.name= (obj.specialty)? obj.specialty[0].coding[0].display : '';
			loginData.schedule.practitionerRoleID= (obj.actor) ? obj.actor[0].reference.split('/')[1] : '';
			loginData.schedule.practitionerName= (obj.actor) ? obj.actor[0].display : '';
		}
		//Get Group to get max participant quota
		getResource(FHIRURL, 'Group', '?identifier=' + loginData.schedule.code + '&code=201', FHIRResponseType, "showWebsiteInfo");
	}

	//Step 5. Show Page Title and Header
	function showWebsiteInfo()
	{
		document.title= loginData.schedule.name + " - " + pageName;
		$("#header").html(loginData.schedule.name + "<br>" + pageName);
		message.contactPerson= "please contact " + loginData.organization.cpname + "<br>Phone No.：" + loginData.organization.cpphone + "<br>Email：" + loginData.organization.cpemail;
		$("#cp").html(message.signInFail + message.contactPerson);
	}
/* END PAGE INITIALIZATION */

/* WHEN USER SUBMIT LOGIN FORM */
	//Step 1. Validate login form data (e.g. required field, field format)
	function validateData(){
		if(checkRequiredField(field)){
			$("#global-loader").show();
			var formData = urlEncodeFormData(document.getElementById('loginForm'));
			postResource(FHIRURL.replace('fhir/', 'r4/rest/login'), '', '', 'application/x-www-form-urlencoded', 'getUserInformation', formData);
		}
	}

	//Step 2. Verify login account username and password
	function getUserInformation(res)
	{
		var obj = JSON.parse(res.response);
		var token= res.getResponseHeader("Authorization");
		//2.1.1 Get account information
		loginData.person.id = (obj.id) ? obj.id : '';
		loginData.person.name = (obj.name) ? obj.name[0].text : '';
		loginData.person.username= (obj.identifier[0])? obj.identifier[0].value : '';
		
		//2.1.2 Get user role (teacher or student)
		if(obj.link)
		{
			obj.link.map((link, i) => {
				let roleID= link.target.reference;
				if(roleID.split('/')[0] == "Practitioner") 
				{
					CPractitioner.roleName= "Practitioner";
					CPractitioner.practID= roleID.split('/')[1];
					getResource(FHIRURL, 'PractitionerRole', '?practitioner=' + CPractitioner.practID, FHIRResponseType, 'getPractitionerRole');
					if(CPractitioner.organizationID == DB.organization)
						loginData.role.push(CPractitioner);
				}
				if(roleID.split('/')[0] == "Patient") 
				{
					CPatient.roleName= "Patient";
					CPatient.patientID= roleID.split('/')[1];
					getResource(FHIRURL, 'Patient', '/' + CPatient.patientID, FHIRResponseType, 'getPatient');
					if(CPatient.organizationID == DB.organization)
						loginData.role.push(CPatient);
				}
			});
		}
		
		//Step 2.2.1 If Person exist, but Patient unexist, then create Patient and Appointment
		if(loginData.role.length == 0)	
		{
			//alert(message.authorizeFail);
			personstr= res.response;
			getResource(FHIRURL, 'Slot', '?schedule=' + DB.schedule, FHIRResponseType, 'getSlotID');
			createPatient(personstr);
		}
		//Step 2.2.2 If Person and Patient exist, then direct to student homescreen (appointment will be created in the index.html)
		else if(loginData.role.length >= 1 && loginData.role[0].roleName == "Patient")
		{
			directToHomePage();
		}
		//Step 2.2.4 If Person and Practitioner exist, then direct to admin homescreen 
		else if(loginData.role.length >= 1 && loginData.role[0].roleName == "Practitioner"){
			window.open('https://tzfhir.ml/system/fhir-lms/lmsAdmin/Organization/index.html',"_self");
		}
		//Step 2.2.5 If Person has 2 roles (teacher and student), then direct to choose-role.html 
		else if(loginData.role.length > 1){
			sessionSet("loginAccount", loginData, 30);
			window.open('choose-role.html',"_self");
		}
		else
		{
			alert(message.systemError + " " + message.contactPerson);
			$("#global-loader").hide();
		}
	}
/* END WHEN USER SUBMIT LOGIN FORM */

//Get all slot ID 
function getSlotID(str){ 
	let obj= JSON.parse(str);
	
	obj.entry.map((entry, i) => {
		loginData.slot.id.push(entry.resource.id);
	});
	initialize();
}

function getPractitionerRole(str)
{ 
	let obj= JSON.parse(str);
	obj.entry.map((entry, i) => {
		CPractitioner.practRoleID = entry.resource.id? entry.resource.id : '';
		CPractitioner.organizationID = entry.resource.organization? entry.resource.organization.reference.split('/')[1] : '';
		CPractitioner.organizationName = entry.resource.organization.display? entry.resource.organization.display : '';
		if(entry.resource.code)
		{
			entry.resource.code[0].coding.map((coding, i) => {
				CPractitioner.roleCode.push(coding.code);
			});
		}
	});
}

function getPatient(str)
{ 
	let obj= JSON.parse(str);
	CPatient.organizationID = obj.managingOrganization.reference.split('/')[1];
	CPatient.organizationName = obj.managingOrganization.display;
}

function finalResult(str){
	let obj= JSON.parse(str);
	if (!isError(obj.resourceType, message.signUpFail + message.contactPerson))
	{
		//Add patient ID to list
		CPatient.roleName= "Patient";
		CPatient.patientID= loginData.patient.id;
		loginData.role.push(CPatient);
		
		$("#global-loader").hide();
		alert(loginData.schedule.name + " course have successfully added to your course list!");
		directToHomePage();
	}
}

function urlEncodeFormData(form) {
	var i, e, data = [];
	for (i = 0; i < form.elements.length; i++) {
		e = form.elements[i];
		if (e.type !== 'button' && e.type !== 'submit' && e.type !== 'password') {
			data.push(encodeURIComponent(e.name) + '=' + encodeURIComponent(e.value)); 
		}
	}
	return data.join('&');
}
	
function directToHomePage()
{
	sessionSet("loginAccount", loginData, 30);
	window.open('lms-content/index.html',"_self");
}