
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
if (id)
    getResource(FHIRURL, 'Slot', '?schedule=' + id, FHIRResponseType, 'setSlotListData');
else
    getResource(FHIRURL, 'Slot', '', FHIRResponseType, 'setSlotListData');

/*
    說明：點擊"新增"後，切換至Add.html新增子組織
*/
document.querySelector('.Btn.Add.Slot').onclick = function () {
    location.href = '../Slot/Add.html?id=' + id;
}
// document.querySelector('.Btn.Add.Patient').onclick = function () {
//     location.href = '../Patient/Add.html?id=' + id;
// }
// document.querySelector('.Btn.Add.PractitionerRole').onclick = function () {
//     location.href = '../PractitionerRole/Add.html?id=' + id;
// }

function setSlotListData(str) {
    let obj = JSON.parse(str);
    let template = [];

    obj.entry.map((entry, i) => {
        let id = (entry.resource.id) ? entry.resource.id : '';
        let comment = (entry.resource.comment && entry.resource.comment.length) ? entry.resource.comment : '';
		let appointmentType = entry.resource.appointmentType? entry.resource.appointmentType.coding.length : '';
        let startDate = (entry.resource.start) ? entry.resource.start.substring(0,10) : '';
		let endDate = (entry.resource.end) ? entry.resource.end.substring(0,10) : '';
		let status = (entry.resource.status && entry.resource.status.length) ? entry.resource.status : '';
		let content="";
		
		for(var j=0; j<appointmentType;j++){
			content+= "<tr><td>" + entry.resource.appointmentType.coding[j].system + "</td>";
			content+= "<td>" + entry.resource.appointmentType.coding[j].code + "</td>";
			content+= "<td>" + entry.resource.appointmentType.coding[j].display + "</td></tr>";
		}
	
        template.push(`
        <li class="L1 child i${i + 1} ${id}">
			<div class="Num">${i + 1}</div>
			<div class="Id">${id}</div>
			<div class="Comment">${comment}</div>
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
			<table class="CourseMaterialTable" id=${id}>${content}</table>
        </li>`);
    })
    document.getElementById('List').getElementsByClassName('List-Slot')[0].getElementsByClassName('Bodyer')[0].getElementsByClassName('L1s')[0].innerHTML += template.join('');
	tablePagination("List-Slot", 2);
	
    document.getElementById('List').getElementsByClassName('List-Slot')[0].getElementsByClassName('Bodyer')[0].addEventListener('click', e => {
        if (e.target.tagName.toUpperCase() === 'DIV') {
            if (e.target.classList[2] === 'Detail') {
                let id = e.target.classList[0];
                location.href = `../Slot/Detail.html?id=${id}`;
            }
            else if (e.target.classList[2] === 'Edit') {
                let id = e.target.classList[0];
                location.href = `../Slot/Edit.html?id=${id}`;
            }
        }
    });
}