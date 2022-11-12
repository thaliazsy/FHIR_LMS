
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
        getResource(FHIRURL,'Questionnaire','/1945606',FHIRResponseType,'showResource')
        取自組織資料（子層）
        getResource(FHIRURL,'Questionnaire','?schedule=1945606',FHIRResponseType,'showResource')
*/

//Function Initialization
$(document).ready(function(){
	loginData= sessionGet("loginAccount");
	if(loginData==null) {
		//redirect users to login page
		window.location.href = "https://tzfhir.ml/system/fhir-lms/misac/login.html";
		//history.back();
	} 
	else {
		if (id){
			document.getElementById("loadingPage").style.display = "block";
			getResource(FHIRURL, 'QuestionnaireResponse', '?questionnaire=' + id + '&_count=50', FHIRResponseType, 'getQuestionnaireResponseByQuesID');
		}
		else
			alert("No ID!");
	}
});

let arrayCSV=[["No.", "Person ID", "WG Code", "WG Desc", "Submit Date"]];
function getQuestionnaireResponseByQuesID(str) {
	let index=0, temp='';
	let obj= JSON.parse(str);
    let template = [];
	if (obj.total == 0)	{
		alert('無資料 '+ obj.link[0].url);
	}
	else{
		obj.entry.map((entry, i) => {
			let PersonID = (entry.resource.subject) ? entry.resource.subject.reference.split('/')[1] : '';
			let CreatedDate = (entry.resource.authored) ? entry.resource.authored : '';
			
			entry.resource.item.forEach(element => {
				let WGCode =  element.linkId;
				let WGDesc =  element.text;
				
				// insert participant data into 2d Array (used to generate CSV file)
				arrayCSV.push( [] );
				arrayCSV[arrayCSV.length-1].push(index + 1, PersonID, WGCode, WGDesc, CreatedDate); 
			
				template.push(`
				<li class="L1 child i${index + 1} ${id}">
					<div class="Num">${index + 1}</div>
					<div class="PersonID">${PersonID}</div>
					<div class="WGCode">${WGCode}</div>
					<div class="WGDesc">${WGDesc}</div>
					<div class="CreatedDate">${CreatedDate}</div>
					<div class="Clear"></div>
				</li>`);
				index++;
			});
		})
		document.getElementById("loadingPage").style.display = "none";
		document.getElementById('List').getElementsByClassName('List-QuestionnaireResponse')[0].getElementsByClassName('Bodyer')[0].getElementsByClassName('L1s')[0].innerHTML+= template.join('');
		tablePagination("List-QuestionnaireResponse", 10);
	}
}

document.querySelector('.Btn.Export.CSV').onclick = function () {
    generateCSV(arrayCSV);
}