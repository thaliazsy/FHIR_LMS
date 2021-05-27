//Declare variable
let FHIRserver= 'http://hapi.fhir.org/baseR4/';
//'http://hapi.fhir.org/baseR4/';
//'http://203.64.84.213:8080/fhir/';

var index=0, iRole=-1, i1=0, i2=0, i3=0, i4=0;
let curUserID, curOrganizationID, curOrganizationName;
let tableValue= new Array(5);							//total role(patient or practitioner)
for (var i = 0; i < tableValue.length; i++) {
	tableValue[i] = new Array(5);						//total Appointment
}

for (var i = 0; i < tableValue.length; i++) {
	for (var j = 0; j < tableValue[i].length; j++) {
		tableValue[i][j] = new Array(10);				//userID(Patient or Practitioner), organizationName, appointmentID, slotID, courseName, startTime, endTime, scheduleID, practitionerRoleID, practitionerName
	}
}
//END: Declare variable

function retFHIR(retValue, type){
	var jsonOBJ =JSON.parse(retValue);
	
	if(type == "loginVerify")	checkUsername(ret);
	else if (type=="CheckPersonUsername"){
		checkUsername(jsonOBJ.total);
	}
	else if (type=="Patient"){
		iRole++;
		curUserID= jsonOBJ.id;
		curOrganizationID = jsonOBJ.managingOrganization.reference;
		let urlStr= FHIRserver + curOrganizationID;
		HTTPGetData(urlStr, "Organization");
	}
	else if (type=="Organization"){
		curOrganizationName = jsonOBJ.name;
		let urlStr= FHIRserver + 'Appointment?actor=reference|Patient/' + curUserID;
		HTTPGetData(urlStr, "Appointment");	
	}
	else if (type=="Appointment"){
		if (jsonOBJ.total == 0)	alert('data unexist');
		else{
			for (var i=0;i<((jsonOBJ.total>10)?10:jsonOBJ.total);i++){ 
				tableValue[iRole][i1][0] = curUserID;
				tableValue[iRole][i1][1] = curOrganizationName;
				tableValue[iRole][i1][2] = jsonOBJ.entry[i].resource.id;
				tableValue[iRole][i1][3] = jsonOBJ.entry[i].resource.slot[0].reference;
				i1++;
			}
			for (var i=0;i<i1;i++){ 
				let urlStr= FHIRserver + tableValue[iRole][i][3];
				HTTPGetData(urlStr, "Slot");
			}
		}
	}
	else if (type=="Slot"){
		tableValue[iRole][i2][4] = jsonOBJ.specialty[0].coding[0].display;
		tableValue[iRole][i2][5] = jsonOBJ.start;
		tableValue[iRole][i2][6] = jsonOBJ.end;
		tableValue[iRole][i2][7] = jsonOBJ.schedule.reference;
		i2++;
		
		if(i1==i2){
			for (var i=0;i<i1;i++){ 
				let urlStr= FHIRserver + tableValue[iRole][i][7];
				HTTPGetData(urlStr, "Schedule");
			}
		}
	}
	else if (type=="Schedule"){
		tableValue[iRole][i3][8] = jsonOBJ.actor[0].reference;
		i3++;
		
		if(i1==i3){
			for (var i=0;i<i1;i++){ 
				let urlStr= FHIRserver + tableValue[iRole][i][8];
				HTTPGetData(urlStr, "PractitionerRole");
			}
		}
	}
	else if (type=="PractitionerRole"){
		tableValue[iRole][i4][9] = jsonOBJ.practitioner.display;
		i4++;
		
		if(i1==i4) createTable();
	}
}

function createTable(){
	var table= document.getElementById("TableAppointment");
	var cellIndex;
	
	for (var index0=0;index0<=iRole;index0++){
		table.innerHTML+= '<tr><th colspan="6">Member ID: ' + tableValue[index0][0][0] + '   //   Organization Name: ' + tableValue[index0][0][1] + '</th></tr><tr><th>No.</th><th>Appointment ID</th><th>Course Name</th><th>Start</th><th>End</th><th>Teacher Name</th></tr>';
		for (var index1=0;index1<i1;index1++){
			var row = table.insertRow(-1);
			row.insertCell(0).innerHTML= index1+1;
			cellIndex=1;
			for (var index2=2;index2<10;index2++){
				if(index2!= 3 && index2!=7 && index2!=8 ){	
					row.insertCell(cellIndex).innerHTML = tableValue[index0][index1][index2];
					cellIndex++;
				}	
			}
		}
	}
}

function HTTPGetData(urlStr, type) {
	var HttpObj = new XMLHttpRequest();
	HttpObj.onreadystatechange = function () {
		if (this.readyState === 4) {
			ret = this.responseText;
			//alert(ret);
			retFHIR(ret, type);
		}
	}
	HttpObj.open("GET", urlStr, true);
	HttpObj.send();
}

function HTTPPostData(urlStr, dataStr) {
    var HttpObj = new XMLHttpRequest();
    HttpObj.open("POST", urlStr, true);
    HttpObj.setRequestHeader("Content-type", "application/json+fhir");
    //HttpObj.setRequestHeader("Content-type", "application/xml+fhir");
    HttpObj.onreadystatechange = function () {
        if (this.readyState === 4) {
            ret = this.responseText;
            alert(ret);
        }
    }
    HttpObj.send(dataStr);
}