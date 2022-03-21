//Set form field attribute
let field= {
	code: ["username", "Password"],
	desc: [],
	isRequired: [1,1],		
	type: ["text", "password"],
	signUpPage: ""
};

//Set form field name based on selected language
if(web_language=="CH")
{
	field.desc= ["帳號 (Email)", "密碼"];
	info.pageName= "登入網頁";
	field.signUpPage= "報名請點我";
}
else if(web_language=="EN")
{
	field.desc= ["Email", "Password"];
	info.pageName= "Login";
	field.signUpPage= "Click here to sign up";
}

//Show Page Title and Header (need to initialize info.pageName beforehand)
document.title= info.courseName + "-" + info.pageName;
document.getElementById("header").innerHTML= info.courseName + "<br>" + info.pageName;
document.getElementById("cp").innerHTML= message.signInFail + message.contactPerson;	

//Show login form field
$(document).ready(function(){
	let temp="";
	for(let i=0; i<field.desc.length;i++){
		temp += field.desc[i];
		if(field.isRequired[i])			
			temp += '<font color="red"> *</font>';
		
		temp += ':&nbsp;<input type="' + field.type[i] + '" id="p' + field.code[i] + '" name="' + field.code[i] + '"';
		
		if(field.code[i] == "Password")
			temp += 'onkeyup="SHA256PWD.value = sha256(this.value);" ';
			
		if(field.isRequired[i])			
			temp += ' required';
			
		temp += '><br>';
	}
	temp+= '<input id="btnSubmit" type="button" value="Submit" onclick="dataValidation()">';
	$('#loginForm').append(temp);
	$('#linkToSignUpPage').html(field.signUpPage);
});

//Validate data input by user
function dataValidation(){
	if(checkRequiredField(field)){
		var formData = new FormData(document.getElementById("loginForm"));
		postResource(FHIRURL.replace('fhir/', ''), 'rest/login', '', '', 'verifyUser', formData);
	}
}

//Verify login account username and password
function verifyUser(obj){ 
	let retID="", retName="", retUsername="", retPassword="", patientID="";
	let arrPatientID= new Array();
	
	//code 401 means account is not exist or password is wrong
	if (obj.code == 401) alert(message.accountUnexist);
	else
	{
		retID = (obj.id) ? obj.id : '';
		retName = (obj.name) ? obj.name[0].text : '';
		retUsername= (obj.identifier[0])? obj.identifier[0].value : '';
		retPassword= (obj.identifier[1])? obj.identifier[1].value : '';
		patientID = (obj.link) ? obj.link[0].target.reference:'';
		arrPatientID.push(patientID);
		sessionSet("loginAccount", retID, retName, retUsername, arrPatientID);
		window.open('index.html',"_self");
	}
	// else{
		// alert("This user has more than 1 account.\n" + message.contactPerson);
	// }
}