//Set table field
let field= {
	//field code	
	code: ["Username", "Password"],
	//field name
	desc: [],
	//field required or not
	isRequired: [1,1],		
	//field type e.g. text, number, password
	type: ["email", "password"],
	signUpPage: ""
};

if(web_language=="CH")
{
	field.desc= ["帳號 (Email)", "密碼"];
	pageName= "登入網頁";
	field.signUpPage= "報名請點我";
}
else if(web_language=="EN")
{
	field.desc= ["Email", "New Password"];
	pageName= "Forget Password";
}
let temp="";
//Show Login Form field
$(document).ready(function(){
	for(let i=0; i<field.desc.length;i++){
		temp += '<tr><td>' + field.desc[i];
		if(field.isRequired[i])			
			temp += '<font color="red"> *</font>';
		
		temp += '</td><td>:&nbsp;<input type="' + field.type[i] + '" id="p' + field.code[i] + '" ';
		
		if(field.code[i] == "Password")
			temp += 'onkeyup="SHA256PWD.value = sha256(this.value);" ';
			
		if(field.isRequired[i])			
			temp += 'required';
			
		temp += '><br></td></tr>';
	}
	temp+= '<tr><td colspan="2" align="right"><input id="btnSubmit" type="button" value="Submit" onclick="dataValidation()"></td></tr>';
	document.getElementById('mainTable').innerHTML= temp;
	
	// Get Organization Information
	getResource(FHIRURL, 'Organization', '/' + DB.organization, FHIRResponseType, 'getOrganization');
});

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

function getSchedule(str){
	let obj= JSON.parse(str);
	if(retValue(obj))
	{
		loginData.schedule.code= (obj.specialty)? obj.specialty[0].coding[0].code : '';
		loginData.schedule.name= (obj.specialty)? obj.specialty[0].coding[0].display : '';
		loginData.schedule.practitionerRoleID= (obj.actor) ? obj.actor[0].reference.split('/')[1] : '';
		loginData.schedule.practitionerName= (obj.actor) ? obj.actor[0].display : '';
	}
	showWebsiteInfo();
}

//Show Page Title and Header (need to initialize page ame beforehand)
function showWebsiteInfo()
{
	document.title= loginData.schedule.name + " - " + pageName;
	$("#header").html(loginData.schedule.name + "<br>" + pageName);
	message.contactPerson= "please contact " + loginData.organization.cpname + "<br>Phone No.：" + loginData.organization.cpphone + "<br>Email：" + loginData.organization.cpemail;
	$("#cp").html(message.signInFail + message.contactPerson);
}

//Validate data input by user
function dataValidation(){
	if(checkRequiredField(field)){
		let id= $("#pUsername").val();
		getResource(FHIRURL, 'Person', '?identifier=' + id, FHIRResponseType, 'verifyUser');
	}
}

//Verify login account username and password
function verifyUser(obj){ 
	let encPassword= document.getElementById('SHA256PWD').value;
	let retID="", retName="", retUsername="", retPassword="", patientID="";
	let arrPatientID= new Array();
	
	if (obj.total == 0) alert(message.accountUnexist);
	else if (obj.total == 1){
		obj.entry[0].resource.identifier[1].value= encPassword;
		let personJSON = JSON.stringify(obj.entry[0].resource);
		retID = (obj.entry[0].resource.id) ? obj.entry[0].resource.id : '';
		putResource(FHIRURL, 'Person', '/' + retID, FHIRResponseType, "updatePasswordResult", personJSON)
	}
	else{
		alert(message.systemError + " " + message.contactPerson);
	}
}

function updatePasswordResult(obj){ 
	if (!isError(obj.resourceType, message.updatePasswordFail + message.contactPerson))
	{
		alert(message.updatePasswordOK);
		window.open('login.html',"_self");
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