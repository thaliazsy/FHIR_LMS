
/*
    說明：由網址列參數取得自身Id，當網址列中無Id，則作為查看第一層資料列表
*/
var id = (QueryString('id') == '') ? '' : QueryString('id');
/*
    getResource(URL, ResourceName, Parameter, ResponseType, AfterFun)
    說明：向Server取資料
    參數：
        URL：Server 路徑
        ResourceName：Resource名稱
        Parameter：向Server要求的參數
        ReponseType：要求Server 回傳的資料型態
        AfterFun：資料取得後欲執行的函式
    JavaScript檔案：getResource.js
    範例：
        取組織資料（自己）
        getResource(FHIRURL,'Slot','/1945606',FHIRResponseType,'showResource')
        取自組織資料（子層）
        getResource(FHIRURL,'Slot','?schedule=1945606',FHIRResponseType,'showResource')
*/

//Function Initialization
$(document).ready(function(){
	let ret= sessionGet("loginAccount");
	if(ret==null) {
		//redirect users to login page
		window.location.href = "../login.html";
	} 
	else {
		if (id){
			document.getElementById("loadingPage").style.display = "block";
			getResource(FHIRURL, 'Slot', '?identifier=' + id + "&status=busy&_count=150", FHIRResponseType, 'getAllBusySlotID');
		}
		else
			alert("No ID!"); //getResource(FHIRURL, 'Slot', '', FHIRResponseType, 'setSlotListData');
	}
});

/*
    說明：點擊"新增"後，切換至Add.html新增子組織
*/
document.querySelector('.Btn.Export.CSV').onclick = function () {
    generateCSV(participantArr);
}
// document.querySelector('.Btn.Add.Slot').onclick = function () {
    // location.href = '../Slot/Add.html?id=' + id;
// }
// document.querySelector('.Btn.Add.Patient').onclick = function () {
//     location.href = '../Patient/Add.html?id=' + id;
// }
// document.querySelector('.Btn.Add.PractitionerRole').onclick = function () {
//     location.href = '../PractitionerRole/Add.html?id=' + id;
// }

let globalTotalParticipant;
let participantArr=[["No.", "Person ID", "Name", "Email", "Highest Education Degree", "Institution", "Patient ID", "Account Created Date"]];
function getAllBusySlotID(obj){
	globalTotalParticipant= obj.total;
	if (globalTotalParticipant == 0)	alert('無資料');
	else{
		obj.entry.map((entry, i) => {
			let slotID= (entry.resource.id) ? entry.resource.id : '';
			getResource(FHIRURL, 'Appointment', '?slot=Slot/' + slotID, FHIRResponseType, 'getAppointmentBySlotID');
		});
	}
}

let multiAppt="";
function getAppointmentBySlotID(obj){
	if (obj.total == 0)	{
		let temp= JSON.stringify(obj.link[0].url);
		alert('無資料 '+ temp.split("Slot%2F")[1]);
	}
	else{
		obj.entry.map((entry, i) => {
			let appointmentID = (entry.resource.id) ? entry.resource.id : '';
			let patientID= (entry.resource.participant[0].actor) ? entry.resource.participant[0].actor.reference.split('/')[1] : '';
			let slotID= (entry.resource.slot[0].reference) ? entry.resource.slot[0].reference : '';
			if(i==0) 
				multiAppt+= slotID + ": "; 
			
			multiAppt+= patientID + ", ";
			if(i==(obj.total-1)){
				multiAppt+= "\n";
				getResource(FHIRURL, 'Person', '?link=Patient/' + patientID, FHIRResponseType, 'getPersonByID');
			}
		});
	}
}

let index=0, str="";
function getPersonByID(obj) {
    let template = [];
	if (obj.total == 0)	{
		alert('無資料 '+ obj.link[0].url);
	}
	else{
		obj.entry.map((entry, i) => {
			let id = (entry.resource.id) ? entry.resource.id : '';
			//let comment = (entry.resource.comment && entry.resource.comment.length) ? entry.resource.comment : '';
			let name = (entry.resource.name) ? entry.resource.name[0].text : '';
			let email = (entry.resource.identifier[0] && entry.resource.identifier[0].system == "UserID")? entry.resource.identifier[0].value : '';
			let highestEduDegree = (entry.resource.identifier[2] && entry.resource.identifier[2].system == "HighestEduDegree")? entry.resource.identifier[2].value : '';
			let institution = (entry.resource.identifier[3] && entry.resource.identifier[3].system == "Institution")? entry.resource.identifier[3].value : '';
			let patientID = (entry.resource.link[0].target) ? entry.resource.link[0].target.reference : '';
			let lastUpdatedDate = (entry.resource.meta.lastUpdated) ? entry.resource.meta.lastUpdated.split("+")[0] : '';
			lastUpdatedDate= lastUpdatedDate.replace(/T/g,' ').substring(0, lastUpdatedDate.length - 4);
			let status = (entry.resource.active || entry.resource.active =="true") ? "active" : 'not active';
			
			
			// insert participant data into 2d Array (used to generate CSV file)
			participantArr.push( [] );
			participantArr[participantArr.length-1].push(index + 1, id, name, email, highestEduDegree, institution, patientID, lastUpdatedDate); 
			template.push(`
			<li class="L1 child i${index + 1} ${id}">
				<div class="Num">${index + 1}</div>
				<div class="Id">${id}</div>
				
				<div class="Name">${name}</div>
				<div class="Email">${email}</div>
				<div class="HighestEduDegree">${highestEduDegree}</div>
				<div class="Institution">${institution}</div>
				<div class="PatientID">${patientID}</div>
				<div class="CreatedDate">${lastUpdatedDate}</div>
				
				<div class="Clear"></div>
			</li>`);
			
			// <div class="Tool">
					// <ul class="L2s">
						// <li class="L2 i1">
							// <div class="${id} Btn Edit Title">修改</div>
						// </li>
					// </ul>
				// </div>
			
		})
	}
	index++;
	str+= template.join('');
    if(index==globalTotalParticipant){
		document.getElementById("loadingPage").style.display = "none";
		document.getElementById('textarea1').innerHTML= multiAppt;
		document.getElementById('List').getElementsByClassName('List-Person')[0].getElementsByClassName('Bodyer')[0].getElementsByClassName('L1s')[0].innerHTML+= str;
		tablePagination("List-Person", 5);
	}
}