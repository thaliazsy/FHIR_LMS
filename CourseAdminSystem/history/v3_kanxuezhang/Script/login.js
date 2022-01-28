//Set table field
let field= {
	//field code	
	code: ["Username", "Password"],
	//field name
	desc: [],
	//field required or not
	isRequired: [1,1],		
	//field type e.g. text, number, password
	type: ["text", "password"],
	signUpPage: ""
};

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

let temp="";
//Show Login Form field
$(document).ready(function(){
	//clear session
	let stringValue = window.sessionStorage.getItem("loginAccount")
    if (stringValue != null) 
	{
		window.sessionStorage.removeItem("loginAccount");
	}
	
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
	document.getElementById('linkToSignUpPage').innerHTML= field.signUpPage;
});

//Show Page Title and Header (need to initialize info.pageName beforehand)
document.title= info.websiteName + " - " + info.pageName;
document.getElementById("header").innerHTML= info.websiteName + "<br>" + info.pageName;
document.getElementById("cp").innerHTML= message.signInFail + message.contactPerson;	

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
	let retID="", retName="", retUsername="", retPassword="", memberID="";
	let arrmemberID= new Array();
	
	if (obj.total == 0) alert(message.accountUnexist);
	else if (obj.total == 1){
		retID = (obj.entry[0].resource.id) ? obj.entry[0].resource.id : '';
		retName = (obj.entry[0].resource.name) ? obj.entry[0].resource.name[0].text : '';
		retUsername= (obj.entry[0].resource.identifier[0])? obj.entry[0].resource.identifier[0].value : '';
		retPassword= (obj.entry[0].resource.identifier[1])? obj.entry[0].resource.identifier[1].value : '';
		if(obj.entry[0].resource.link)
		{
			for(var i=0;i< obj.entry[0].resource.link.length;i++)
			{
				let memberID= obj.entry[0].resource.link[i].target.reference;
				if(memberID.split('/')[0] == "Practitioner") 
					arrmemberID.push(memberID);
			}
		}
		
		
		if(encPassword!=retPassword)	alert(message.passwordWrong);
		else if(arrmemberID.length == 0)	alert(message.authorizeFail);
		else {
			sessionSet("loginAccount", retID, retName, retUsername, arrmemberID);
			//location.href = './Schedule/index2.html';
			window.open('./Organization/index.html',"_self");
		}
	}
	else{
		alert(message.systemError + " " + message.contactPerson);
	}
}