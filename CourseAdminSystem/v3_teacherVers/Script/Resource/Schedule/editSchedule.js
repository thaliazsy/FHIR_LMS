/*
    說明：由網址列參數取得自身Id，當網址列中無Id，則返回主頁
*/
var id = (QueryString('id') == '') ? location.href = '../Schedule/index.html' : QueryString('id');
/*
    說明：初始化父層Id
*/
//var partOfid = '';
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
getResource(FHIRURL, 'Schedule', '/' + id, FHIRResponseType, 'setEditData');

/*
    說明：修改資料儲存
*/
/*
    json 範例：
        { 
            "resourceType" : "Schedule", 
            "partOf" : {"reference":"Schedule/2609086"}, 
            "name" : "慈濟醫院", 
            "telecom" : [{"system":"phone","value":"03-8574885" }], 
            "address" : [{"line":"中央路三段707號","city":"花蓮市" }]
        }
    json 說明：
        resourceType：Resource名稱
        partOf：父層資料
            reference：父層Resource名稱/父層Id
        name：資料名稱
            => 在此為組織名稱
        telecom：資料聯絡方式(非必填且可加入多個）
            => 在此為組織電話
            system：類型。例如："phone"-電話、"fax"-傳真、"email"-電子郵件
            value：值
        address：資料位址(非必填且可加入多個）
            => 在此為組織地址
            line：地址
            city：縣市
            postalCode：區碼
            country：國家

*/
document.getElementById('Edit').getElementsByClassName('Save')[0].onclick = function () {
    let resource = 'Schedule';
    let serviceCategory = document.getElementById('Edit').getElementsByClassName('ServiceCategory')[0].getElementsByTagName('input')[0].value;
    let serviceType = document.getElementById('Edit').getElementsByClassName('ServiceType')[0].getElementsByTagName('input')[0].value;
	let specialty = document.getElementById('Edit').getElementsByClassName('Specialty')[0].getElementsByTagName('input')[0].value;
    let actor = document.getElementById('Edit').getElementsByClassName('Actor')[0].getElementsByTagName('input')[0].value;
    let startDate = document.getElementById('Edit').getElementsByClassName('StartDate')[0].getElementsByTagName('input')[0].value;
    let endDate = document.getElementById('Edit').getElementsByClassName('EndDate')[0].getElementsByTagName('input')[0].value;
    let status = document.getElementById('Edit').getElementsByClassName('Status')[0].getElementsByTagName('input');
    status = status[0].checked ? status[0].value : status[1].value;

    let fhirJson = {
        'resourceType': resource,
        'id': id
    }
    if (serviceCategory)
        fhirJson['serviceCategory'] = { 'coding': [
									{
									  'display': serviceCategory
									}
								  ] 
							    }
    if (serviceType)
        fhirJson['serviceType'] = { 'coding': [
									{
									  'display': serviceType
									}
								  ] 
							    }
    if (specialty)
        fhirJson['specialty'] = { 'coding': [
									{
									  'display': specialty
									}
								  ] 
							    }
    if (actor)
        fhirJson['actor'] = { 'display': actor }
	if (startDate)
        fhirJson['planningHorizon'] = { 'start': startDate }
    if (endDate)
        fhirJson['planningHorizon'] = { 'end': endDate }
    if (status)
        fhirJson['active'] = status;

    if (name.trim().length > 0) {
        /*
            putResource(URL, ResourceName, Parameter, ResponseType, AfterFun, RequestData)
            說明：向Server修改資料
            參數：
                URL：Server 路徑
                ResourceName：Resource名稱
                Parameter：向Server要求的參數
                ReponseType：要求Server 回傳的資料型態
                AfterFun：資料取得後欲執行的函式
                RequestData：向Server傳送的參數
            JavaScript檔案：putResource.js
        */
        putResource(FHIRURL, 'Schedule', '/' + id, FHIRResponseType, 'altMessage', JSON.stringify(fhirJson))
    } else {
        /*
            說明：檢查組織名稱是否有輸入，若無輸入則在後方提示
        */
        document.getElementById('Edit').getElementsByClassName('Name')[0].getElementsByClassName('Message')[0].innerText = '* 請輸入名稱';
    }
}


/*
    說明：點擊"返回"後，返回至上一頁
*/
document.getElementById('Edit').getElementsByClassName('Back')[0].onclick = function () {
    window.history.back();
}

function setEditData(str) {
    let obj = JSON.parse(str);
    document.getElementById('Edit').getElementsByClassName('Name')[0].getElementsByTagName('input')[0].value = obj.name ? obj.name : '';
    document.getElementById('Edit').getElementsByClassName('Address')[0].getElementsByTagName('input')[0].value = (obj.address && obj.address[0].text) ? obj.address[0].text : '';
    document.getElementById('Edit').getElementsByClassName('Phone')[0].getElementsByTagName('input')[0].value = (obj.telecom && obj.telecom[0].value) ? obj.telecom[0].value : '';
    document.getElementById('Edit').getElementsByClassName('PartOf')[0].getElementsByTagName('input')[0].value = (obj.partOf && obj.partOf.reference) ? obj.partOf.reference.split('/')[1] : '';
    document.getElementById('Edit').getElementsByClassName('Status')[0].getElementsByTagName('input')[1].checked = (obj.active != undefined && obj.active === false) ? true : false;
}

/*
    altMessage(str)
    說明：彈出訊息
    參數：
        str：Server回應資料
*/
function altMessage(str) {
    alert('儲存成功');
    alert(str);
    location.href = `../Schedule/Detail.html?id=${id}`;
}