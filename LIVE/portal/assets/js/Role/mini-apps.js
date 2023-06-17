
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
		let param = loginData.userSelectedRole;
		getResource(MiniAppsURL, "", "?userRole=" + loginData.userSelectedRole.roleName, FHIRResponseType, listMiniApps);
	}
});
/*
	說明：列出所有使用者的角色
*/
function listMiniApps(miniAppsData) {
	alert(miniAppsData);

	miniAppsData = JSON.parse(miniAppsData);

	miniAppsData.apps.map((entry, i) => {

		let appName = (entry.name) ? entry.name : '';
		let appUrl = (entry.url) ? entry.url : '';
		let imageSrc = (entry.imageSrc) ? entry.imageSrc : '';

		var button = document.createElement("button");
		button.className = "mini-apps";
		var createClickHandler =
			function (appUrl) {
				return function () {
					alert(appUrl);
				};
			};
		button.onclick = createClickHandler(appUrl);

		var image = document.createElement("img");
		image.src = imageSrc;
		image.alt = appName;
		image.width = 100;

		button.appendChild(image);
		button.innerHTML += ("<h3>" + appName + "</h3>");

		document.getElementById('MiniApps').appendChild(button);
	})
	document.getElementById("loadingPage").style.display = "none";
}