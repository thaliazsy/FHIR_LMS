
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
		listUserRole(loginData);
	}
});
/*
DocumentRegistry	說明：列出所有使用者的角色
*/
function listUserRole(userLoginData) {
	userLoginData.roles.map((entry, i) => {

		let roleName = (entry.roleName) ? entry.roleName : '';
		let roleID = (entry.roleID) ? entry.roleID : '';
		let practID = (entry.practID) ? entry.practID : '';
		let organizationName = (entry.organizationName) ? entry.organizationName : '';
		let status = (entry.status) ? entry.status : '';
		let patientIdentifier = (entry.patientIdentifier) ? entry.patientIdentifier : '';

		var tr = document.createElement('tr');
		var temp = [i + 1, roleName, organizationName, roleID, status, patientIdentifier];
		var params = (window.location.href).split("?")[1];
		var createClickHandler =
			function (entry) {
				return function () {

					loginData.userSelectedRole = entry;
					loginData.organization.name = entry.organizationName;
					loginData.organization.id = entry.organizationID;
					loginData.patient.id = (entry.roleName == "Patient") ? entry.roleID : "";

					sessionSet("loginAccount", loginData, 30);

					if (entry.roleName == "Patient" && (entry.organizationID == "4533" || entry.organizationID == "MISAC")) {
						window.open('../learning-portal/index.html?' + params, "_self");
					}
					else {
						window.open('../authentication-service/index.html?' + params, "_self");
					}
				};
			};
		tr.onclick = createClickHandler(entry);

		for (var i = 0; i < temp.length; i++) {
			var td = document.createElement('td');
			td.innerHTML = temp[i];
			tr.appendChild(td);
		}
		document.getElementById('RoleTable').getElementsByTagName('tbody')[0].appendChild(tr);
	})
	document.getElementById("loadingPage").style.display = "none";
}
function authenticateRole(role) {
	alert(role);
}