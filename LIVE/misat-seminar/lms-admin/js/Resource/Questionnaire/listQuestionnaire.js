
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
			getResource(FHIRURL, 'Questionnaire', '?identifier=' + id, FHIRResponseType, 'getQuestionnaireBySchedule');
		}
		else
			alert("No ID!"); //getResource(FHIRURL, 'Questionnaire', '', FHIRResponseType, 'setQuestionnaireListData');
	}
});

/*
    說明：點擊"新增"後，切換至Add.html新增子組織
*/
// document.querySelector('.Btn.Export.CSV').onclick = function () {
    // generateCSV(participantArr);
// }

// document.querySelector('.Btn.SearchUser').onclick = function () {
    // location.href = 'search.html';
// }

// document.querySelector('.Btn.Add.Questionnaire').onclick = function () {
    // location.href = '../Questionnaire/Add.html?id=' + id;
// }
// document.querySelector('.Btn.Add.Patient').onclick = function () {
//     location.href = '../Patient/Add.html?id=' + id;
// }
// document.querySelector('.Btn.Add.PractitionerRole').onclick = function () {
//     location.href = '../PractitionerRole/Add.html?id=' + id;
// }

function getQuestionnaireBySchedule(str) {
	let index=0, temp='';
	let obj= JSON.parse(str);
    let template = [];
	if (obj.total == 0)	{
		alert('無資料 '+ obj.link[0].url);
	}
	else{
		obj.entry.map((entry, i) => {
			let id = (entry.resource.id) ? entry.resource.id : '';
			let createdDate = entry.resource.date? entry.resource.date : '';
			let title = (entry.resource.title) ? entry.resource.title : '';
			let status = entry.resource.status?  entry.resource.status : '';
			
			template.push(`
			<li class="L1 child i${index + 1} ${id}">
				<div class="Num">${index + 1}</div>
				<div class="CreatedDate">${createdDate}</div>
				<div class="Id">${id}</div>
				<div class="Title">${title}</div>
				<div class="Status">${status}</div>
				
				<div class="Clear"></div>
				<div class="Tool">
					<ul class="L2s">
						<li class="L2 i1">
							<div class="${id} Btn View">View</div>
						</li>
					</ul>
				</div>
			</li>`);
		})
	}
	index++;
	temp+= template.join('');
	
    if(index==obj.total){
		document.getElementById("loadingPage").style.display = "none";
		document.getElementById('List').getElementsByClassName('List-Questionnaire')[0].getElementsByClassName('Bodyer')[0].getElementsByClassName('L1s')[0].innerHTML+= temp;
		tablePagination("List-Questionnaire", 10);
		
		document.getElementById('List').getElementsByClassName('List-Questionnaire')[0].getElementsByClassName('Bodyer')[0].addEventListener('click', e => {
        if (e.target.tagName.toUpperCase() === 'DIV') {
            if (e.target.classList[2] === 'View') {
				let id = e.target.classList[0];
                location.href = `../QuestionnaireResponse/index.html?id=${id}`;
            }
        }
    });
	}
}