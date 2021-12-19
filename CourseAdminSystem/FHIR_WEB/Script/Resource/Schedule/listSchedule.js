
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
        getResource(FHIRURL,'Schedule','/1945606',FHIRResponseType,'showResource')
        取自組織資料（子層）
        getResource(FHIRURL,'Schedule','?partof=1945606',FHIRResponseType,'showResource')
*/
if (id)
    getResource(FHIRURL, 'Schedule', '?partof=' + id, FHIRResponseType, 'setScheduleListData');
else
    getResource(FHIRURL, 'Schedule', '', FHIRResponseType, 'setScheduleListData');

/*
    說明：點擊"新增"後，切換至Add.html新增子組織
*/
// document.querySelector('.Btn.Add.Schedule').onclick = function () {
    // location.href = '../Schedule/Add.html?id=' + id;
// }
// document.querySelector('.Btn.Add.Patient').onclick = function () {
//     location.href = '../Patient/Add.html?id=' + id;
// }
// document.querySelector('.Btn.Add.PractitionerRole').onclick = function () {
//     location.href = '../PractitionerRole/Add.html?id=' + id;
// }

function setScheduleListData(str) {
    let obj = JSON.parse(str);
    let template = [];

    obj.entry.map((entry, i) => {
        let id = (entry.resource.id) ? entry.resource.id : '';
        let serviceCategory =(entry.resource.serviceCategory) && entry.resource.serviceCategory.length? entry.resource.serviceCategory[0].coding[0].display : '';
        let serviceType = (entry.resource.serviceType && entry.resource.serviceType.length) ? entry.resource.serviceType[0].coding[0].display : '';
        let specialty = (entry.resource.specialty && entry.resource.specialty.length) ? entry.resource.specialty[0].coding[0].display : '';
		let actor = (entry.resource.actor && entry.resource.actor.length) ? entry.resource.actor[0].display : '';
		let startDate = (entry.resource.planningHorizon) ? entry.resource.planningHorizon.start.substring(0,10) : '';
		let endDate = (entry.resource.planningHorizon) ? entry.resource.planningHorizon.end.substring(0,10) : '';

        template.push(`
        <li class="L1 child i${i + 1} ${id}">
			<div class="Num">${i + 1}</div>
			<div class="Id">${id}</div>
			<div class="ServiceCategory">${serviceCategory}</div>
			<div class="ServiceType">${serviceType}</div>
			<div class="Specialty">${specialty}</div>
			<div class="Actor">${actor}</div>
			<div class="StartDate">${startDate}</div>
			<div class="EndDate">${endDate}</div>
            <div class="Tool">
                <ul class="L2s">
                    <li class="L2 i1">
                        <div class="${id} Btn Detail Title">查看</div>
                    </li>
                    <li class="L2 i1">
                        <div class="${id} Btn Edit Title">修改</div>
                    </li>
                </ul>
            </div>
            <div class="Clear"></div>
        </li>`);
    })
	//$("#basic-datatable tbody:first").html(content);
	document.getElementById('List').getElementsByClassName('List-Schedule')[0].getElementsByClassName('Bodyer')[0].getElementsByClassName('L1s')[0].innerHTML += template.join('');
	tablePagination("List-Schedule", 4);
    document.getElementById('List').getElementsByClassName('List-Schedule')[0].getElementsByClassName('Bodyer')[0].addEventListener('click', e => {
        if (e.target.tagName.toUpperCase() === 'DIV') {
            if (e.target.classList[2] === 'Detail') {
                let id = e.target.classList[0];
                location.href = `../Schedule/Detail.html?id=${id}`;
            }
            else if (e.target.classList[2] === 'Edit') {
                let id = e.target.classList[0];
                location.href = `../Schedule/Edit.html?id=${id}`;
            }
        }
    });
}