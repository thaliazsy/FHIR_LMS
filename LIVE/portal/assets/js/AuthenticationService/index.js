
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
		window.location.href = "../login.html";
	}
	else {
		//Get user documents
		getResource(FHIRURL, 'DocumentReference', '?author=' + loginData.userSelectedRole + "&_sort=-_lastUpdated", FHIRResponseType, 'listDocs');
		getResource(FHIRURL, 'DocumentReference', '?subject=' + DB.organization + "&_sort=-_lastUpdated", FHIRResponseType, 'listDocs');
	}
});

/*
	說明：列出服務清單
*/

function listDocs(str) {
	let obj = JSON.parse(str);
	let tableName = obj.link[0].url.includes("author=")? "AuthorTable" : "SharedTable";
	if(obj.entry) {
		obj.entry.map((entry, i) => {
		let date = (entry.resource.date)? entry.resource.date.replace("T", " ").substring(0, 16) : '';
		let category = (entry.resource.category)? entry.resource.category[0].coding[0].display : '';
		let subject = (entry.resource.subject.display)? entry.resource.subject.display : entry.resource.subject.reference;
		let author =  (entry.resource.author[0].display)? entry.resource.author[0].display : entry.resource.author[0].reference;
		let endPoints = "";
		entry.resource.content.map((endpoint, i) => {
			endPoints += endpoint.attachment.title + ": " + endpoint.attachment.url + "<br>";
		})

		var tr = document.createElement('tr');
		var temp = (tableName=="AuthorTable")? [i + 1, date, category, subject, endPoints] : [i + 1, date, category, subject, author, endPoints];
		var params = (window.location.href).split("?")[1];
		var createClickHandler =
			function (selectedDocRef) {
				return function () {
					alert(selectedDocRef.fullUrl);
					loginData.selectedDocRef=selectedDocRef;
					sessionSet("loginAccount", loginData, 30);
					window.open('view-document.html', "_self");

					var str = selectedDocRef.split('<br>');
					var JWTEndpoint = "";
					str.map((endpoint, i) => {
						JWTEndpoint += JWTToken(loginData, endpoint) + ",";
						//endPoints += endpoint.attachment.title +" : "+endpoint.attachment.url +"<br>";
					})
					alert(JWTEndpoint);
					//var param = JWTToken(loginData);//AESencryptString(str)
					var decParam = AESdecryptString(params);
					var urlParams = new URLSearchParams(decParam);
					var useFor = urlParams.get('useFor')
					var redirect_uri = urlParams.get('redirect_uri')
					var param = AESencryptString(JWTEndpoint)
					//document.cookie = "token=asY-x34SfYPk";
					window.open(redirect_uri + '?token=' + encodeURI(param), "_self");
				};
			};
		tr.onclick = createClickHandler(entry);

		//Input data to table row
		for (var i = 0; i < temp.length; i++) {
			var td = document.createElement('td');
			td.innerHTML = temp[i];
			tr.appendChild(td);
		}
		document.getElementById(tableName).getElementsByTagName('tbody')[0].appendChild(tr);
	})
	}
	else {
		//No Data Available
		var tr = document.createElement('tr');
		var td = document.createElement('td');
			td.innerHTML = "No Data Available!";
			td.colSpan=6;
			tr.appendChild(td);
			document.getElementById(tableName).getElementsByTagName('tbody')[0].appendChild(tr);
	}
	
	document.getElementById("loadingPage").style.display = "none";
}
