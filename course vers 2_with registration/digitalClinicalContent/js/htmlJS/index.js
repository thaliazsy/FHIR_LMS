//Show Page Title and Header
info.pageName= "學習平台";
document.title= info.universityName + " - " + info.courseName + " - " + info.pageName;
document.getElementById("titleDiv").innerHTML= info.universityName + " - 學習平台";					//organizationName

let user = new CPerson();
$(document).ready(function(){
	let ret= sessionGet("loginAccount");
	if(ret==null) {
		//redirect users to login page
		window.location.href = "loginPerson.html";
	} 
	else {
		//init page
		user.id = ret.userLogin.id;
		user.name = ret.userLogin.name;
		user.username = ret.userLogin.username;
		$("#intro").html("Hello, " + user.name + "!");
		
		let arr= ret.patientID;
		for(item in arr) {
			globalPatientID=arr[item].split('/')[1];
			let urlStr= FHIRURL + "Patient/" + globalPatientID;
			HTTPGetData(urlStr, "Patient");
			//getResource(FHIRURL, 'Patient', '/' + patientID, FHIRResponseType, 'getPatientByID');
		};
	}
});

// <!-- function linkToCourseSelection(){ -->
	// <!-- var queryParam= 'personID=' + globalPersonID; -->
	// <!-- window.open('courseSelection.html?' + queryParam, "_blank"); -->
// <!-- } -->

function logOut(){			
	 window.sessionStorage.removeItem("loginAccount");
	 window.location.href = "login.html";
}

function createTable(){
	var table= document.getElementById("TableAppointment");
	var cellIndex;
	var row, noIndex=1, videoName;
	
	//check per organization
	for (var index0=0;index0<=iOrganization;index0++){											
		table.innerHTML+= '<tr><th bgcolor="#ebebe0" colspan="2">My Course List</th></tr>';
		//check per schedule
		for (var index1=0;index1<iSchedule;index1++){			
			document.getElementById("intro").innerHTML+= '<br>教授: ' + arrSchedule[index1][1] + '<br>課程期間: ' + arrSchedule[index1][2] + ' 至 ' + arrSchedule[index1][3];
			table.innerHTML+= '<tr><th>No.</th><th>教材</th></tr>';
			var totSlot= arrSchedule[index1][5];
			var indexNo=1;
			//check per slot
			for (var index2=0;index2<totSlot;index2+=5){		//per Slot
				var totVideo=tableValue[index0][index1][index2][2];
				for (var index3=3;index3<(3+totVideo*2);index3+=2){	//total video
					row = table.insertRow(-1);
					row.align="center";
					row.insertCell(0).innerHTML= indexNo++ + ".";
					elLink = document.createElement('a');
					elLink.target= "_blank";
					elLink.innerHTML = tableValue[index0][index1][index2][index3];
					elLink.href = tableValue[index0][index1][index2][index3+1];
					row.insertCell(1).appendChild(elLink);
				}
			}
		}
	}
}