/*
    說明：由網址列參數取得自身Id，當網址列中無Id，則返回主頁
*/
var id = (QueryString('id') == '') ? location.href = '../Schedule/index.html' : QueryString('id');
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
    getResource(FHIRURL,'Schedule','/1945606',FHIRResponseType,'showResource')
    取自組織資料（子層）
    getResource(FHIRURL,'Schedule','?partof=1945606',FHIRResponseType,'showResource')
*/
getResource(FHIRURL, 'Schedule', '/' + id, FHIRResponseType, 'setDetailData');

/*document.getElementById('Detail').getElementsByClassName('Toggle')[0].onclick = function (e) {
    let elem = document.getElementById('Detail').getElementsByClassName('Bodyer')[0];
    let orgHeight = parseInt(elem.style.height, 10);
    elem.style.height = (orgHeight > 0) ? '0px' : `${elem.scrollHeight}px`;
    e.target.textContent = (e.target.textContent === '展開') ? '隱藏' : '展開';
};*/

// document.getElementById('Detail').getElementsByClassName('Toggle')[0].onclick = function (e) {
    // let newClassName = 'Bodyer-Close';
    // let elem = document.getElementById('Detail');
    // if(elem.className.match(/Bodyer-Close/))
        // newClassName = 'Bodyer-Open';
    // elem.className = newClassName;
// }

/*document.getElementById('List').getElementsByClassName('Toggle')[0].onclick = function (e) {
    let elem = document.getElementById('List').getElementsByClassName('Bodyer')[0];
    if(isNaN(parseInt(elem.style.height, 10)))
        elem.style.height = `500px`;
    elem.offsetHeight;
    let orgHeight = parseInt(elem.style.height, 10);
    elem.style.height = (orgHeight > 0) ? '0px' : `500px`;
    e.target.textContent = (e.target.textContent === '展開') ? '隱藏' : '展開';
};*/

// document.getElementById('List').getElementsByClassName('List-Schedule')[0].getElementsByClassName('Toggle')[0].onclick = function (e) {
    // let newClassName = 'List-Schedule Bodyer-Open';
    // let elem = document.getElementById('List').getElementsByClassName('List-Schedule')[0];
    // if(elem.className.match(/Bodyer-Open/))
        // newClassName = 'List-Schedule Bodyer-Close';
    // elem.className = newClassName;
// }
// document.getElementById('List').getElementsByClassName('List-Slot')[0].getElementsByClassName('Toggle')[0].onclick = function (e) {
    // let newClassName = 'List-Patient Bodyer-Open';
    // let elem = document.getElementById('List').getElementsByClassName('List-Patient')[0];
    // if(elem.className.match(/Bodyer-Open/))
        // newClassName = 'List-Patient Bodyer-Close';
    // elem.className = newClassName;
// }


/*
    說明：點擊"修改"後，切換至Edit.html修改組織資料
*/
// document.getElementById('Detail').getElementsByClassName('Edit')[0].onclick = function () {
    // location.href = '../Schedule/Edit.html?id=' + id + '';
// }

/*
    說明：點擊"新增"後，切換至Add.html新增子組織
*/

function setDetailData(str) {
	let obj= JSON.parse(str);
    document.getElementById('Detail').getElementsByClassName('Bodyer')[0].getElementsByClassName('ServiceCategory')[0].getElementsByClassName('Value')[0].textContent = (obj.serviceCategory && obj.serviceCategory[0].coding[0].display)? obj.serviceCategory[0].coding[0].display : '';
    document.getElementById('Detail').getElementsByClassName('Bodyer')[0].getElementsByClassName('ServiceType')[0].getElementsByClassName('Value')[0].textContent = (obj.serviceType && obj.serviceType[0].coding[0].display) ? obj.serviceType[0].coding[0].display : '';
    document.getElementById('Detail').getElementsByClassName('Bodyer')[0].getElementsByClassName('Specialty')[0].getElementsByClassName('Value')[0].textContent = (obj.specialty && obj.specialty[0].coding[0].display) ? obj.specialty[0].coding[0].display : '';
    document.getElementById('Detail').getElementsByClassName('Bodyer')[0].getElementsByClassName('Actor')[0].getElementsByClassName('Value')[0].textContent = obj.actor ? obj.actor[0].display : '';
    document.getElementById('Detail').getElementsByClassName('Bodyer')[0].getElementsByClassName('StartDate')[0].getElementsByClassName('Value')[0].textContent = (obj.planningHorizon && obj.planningHorizon.start) ? obj.planningHorizon.start.substring(0,10) : '';
	document.getElementById('Detail').getElementsByClassName('Bodyer')[0].getElementsByClassName('EndDate')[0].getElementsByClassName('Value')[0].textContent = (obj.planningHorizon && obj.planningHorizon.end) ? obj.planningHorizon.end.substring(0,10) : '';
}