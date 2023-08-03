
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
		getResource(FHIRURL,'Practitioner','/1945606',FHIRResponseType,'showResource')
		取自組織資料（子層）
		getResource(FHIRURL,'Practitioner','?partof=1945606',FHIRResponseType,'showResource')
*/

//Function Initialization
$(document).ready(function () {
	document.getElementById("loadingPage").style.display = "block";
	/* Check session */
	loginData = sessionGet("loginAccount");
	if (loginData == null) {
		//redirect users to login page
		window.location.href = "../login.html?" + (window.location.href).split("?")[1];
	}
	else {
		//Set user name
		document.getElementById("username").innerHTML = "Hi, " + loginData.person.name;
		getResource(FHIRURL, 'Schedule', '?service-category=MISAC.seminar', FHIRResponseType, 'listCourses');

	}
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

let selectedCourses = [];

function listCourses(str) {
	selectedCourses = [];
	let obj = JSON.parse(str);
	var total = obj.entry ? obj.entry.length : 0;
	if (total > 0) {
		obj.entry.map((entry, i) => {

			let startDate = (entry.resource.planningHorizon.start) ? entry.resource.planningHorizon.start.split("T")[0] : '';
			let endDate = (entry.resource.planningHorizon.end) ? entry.resource.planningHorizon.end.split("T")[0] : '';


			let date = (startDate == endDate) ? startDate : startDate + "~" + endDate;
			let startTime = (entry.resource.planningHorizon.start) ? entry.resource.planningHorizon.start.split("T")[1].slice(0, 5) : '';
			let endTime = (entry.resource.planningHorizon.end) ? entry.resource.planningHorizon.end.split("T")[1].slice(0, 5) : '';
			let time = startTime + "~" + endTime;
			let dateTime = date + "<br>" + time;

			let scheduleName = (entry.resource.name) ? entry.resource.name : '';
			let scheduleID = (entry.resource.id) ? entry.resource.id : '';
			let practRoleID = (entry.resource.actor[0].reference) ? entry.resource.actor[0].reference : '';
			let practRoleName = (entry.resource.actor[0].display) ? entry.resource.actor[0].display : '';
			let serviceCategory = (entry.resource.serviceCategory[0].coding[0].display) ? entry.resource.serviceCategory[0].coding[0].display : '';

			let comment = (entry.resource.comment) ? entry.resource.comment : '';
			let location = "", posterUrl = "";
			if (comment != "") {
				var lines = comment.split("\n");
				lines.forEach(line => {
					if (line.split(": ")[0] == "Location") {
						location = line.split(": ")[1];
					}
					else if (line.split(": ")[0] == "Poster") {
						posterUrl = document.createElement("input");
						posterUrl.type = "button";
						posterUrl.style = "background-image:url(../assets/img/poster.png);background-size: 30px 30px;background-position:center;width:25px;height:30px;";

						posterUrl.addEventListener('click', function () {
							var modal = document.getElementById("myModal");
							modal.style.display = "block";
							var modalContent = document.getElementById("modal-content");
							var image = document.getElementById("modalImg");
							image.src = line.split(": ")[1];
						});

						//posterUrl = line.split(": ")[1]
					}
				});
			}

			var tr = document.createElement('tr');
			var temp = [i + 1, dateTime, scheduleName, location, practRoleName, serviceCategory, posterUrl];
			var params = (window.location.href).split("?")[1];
			// var createClickHandler =
			// 	function (entry) {
			// 		return function () {
			// 			loginData.schedule.id = scheduleID;
			// 			loginData.schedule.name = scheduleName;
			// 			loginData.schedule.serviceCategory = serviceCategory;
			// 			loginData.schedule.practitionerRoleID = practRoleID;
			// 			loginData.schedule.practitionerRoleName = practRoleName;

			// 			selectedCourses.push(loginData.schedule);
			// 			// sessionSet("loginAccount", loginData, 30);
			// 			// addNewCourseToList();
			// 			// window.open('../learning-portal/index.html?' + params, "_self");
			// 		};
			// 	};
			// tr.onclick = createClickHandler(entry);
			var td = document.createElement('td');
			const todayDate = new Date();
			let today = new Date();
			let date1 = new Date(startDate);

			if (today <= date1) {
				td.innerHTML = '<input type="checkbox" id="' + scheduleID + '" name="courses">';
				console.log(startDate + " course available");
			}

			tr.appendChild(td);
			for (var i = 0; i < temp.length; i++) {
				var td = document.createElement('td');
				if (temp[i] instanceof Element || temp[i] instanceof Document) {
					td.appendChild(temp[i]);
				}
				else {

					td.innerHTML = temp[i];
				}
				tr.appendChild(td);
			}
			document.getElementById('RoleTable').getElementsByTagName('tbody')[0].appendChild(tr);
		})
	}
	document.getElementById("loadingPage").style.display = "none";
}

function registerClicked() {
	$("#global-loader").show();
	let checkboxes = document.getElementsByName("courses");
	checkboxes.forEach(element => {
		scheduleID = element.id;
		if (document.getElementById(scheduleID).checked) {
			addNewCourseToList(scheduleID);
		}
	});
}

function addNewCourseToList(scheduleID) {
	let userInfo = {
		patientId: loginData.patient.id, //1234
		personId: loginData.person.id,	//2233
		scheduleId: scheduleID //3344
	}
	postResource(SelectCourseAPI, '', '', 'text/' + FHIRResponseType, 'window.location.href="index.html"', JSON.stringify(userInfo));
	// loginData.patient.id= loginData.userSelectedRole.roleID;
	// var str = getResource(FHIRURL, 'Slot', '?schedule=' + DB.schedule, FHIRResponseType, 'getSlotID');
	// createAppointment(str); // in create-course.js
}

function authenticateRole(role) {
	alert(role);
}

