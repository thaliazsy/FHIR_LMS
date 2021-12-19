/*
    說明：新增資料儲存
*/
/*
    json 範例：
        { 
            "resourceType" : "Organization", 
            "partOf" : {"reference":"Organization/2609086"}, 
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
document.getElementById('Add').getElementsByClassName('Save')[0].onclick = function () {
    var partOfid = QueryString('id');
    var resource = 'Organization';
    var name = document.getElementById('Add').getElementsByClassName('Name')[0].getElementsByTagName('input')[0].value;
    var address = document.getElementById('Add').getElementsByClassName('Address')[0].getElementsByTagName('input')[0].value;
    var phone = document.getElementById('Add').getElementsByClassName('Phone')[0].getElementsByTagName('input')[0].value;
    var status = document.getElementById('Add').getElementsByClassName('Status')[0].getElementsByTagName('input');
    status = status[0].checked ? status[0].value : status[1].value;

    let fhirJson = {
        'resourceType': resource,
    }
    if (name)
        fhirJson['name'] = name;
    if (address)
        fhirJson['address'] = { 'text': address }
    if (phone)
        fhirJson['telecom'] = { 'value': phone }
    if (partOfid)
        fhirJson['partOf'] = { 'reference': `Organization/${partOfid}` }
    if (status)
        fhirJson['active'] = status;

    if (name.trim().length > 0) {
        /*
            postResource(URL, ResourceName, Parameter, ResponseType, AfterFun, RequestData)
            說明：向Server送資料
            參數：
                URL：Server 路徑
                ResourceName：Resource名稱
                Parameter：向Server要求的參數
                ReponseType：要求Server 回傳的資料型態
                AfterFun：資料取得後欲執行的函式
                RequestData：向Server傳送的參數
            JavaScript檔案：postResource.js
        */
        postResource(FHIRURL, 'Organization', '', FHIRResponseType, 'altMessage', JSON.stringify(fhirJson))
    } else {
        /*
            說明：檢查組織名稱是否有輸入，若無輸入則在後方提示
        */
        document.getElementById('Add').getElementsByClassName('Name')[0].getElementsByClassName('Message')[0].innerText = '* 請輸入名稱';
    }
}


/*
    說明：點擊"返回"後，返回至上一頁
*/
document.getElementById('Add').getElementsByClassName('Back')[0].onclick = function () {
    window.history.back();
}

/*
    altMessage(str)
    說明：彈出訊息
    參數：
        str：Server回應資料
*/
function altMessage(str) {
    alert('新增成功');
    alert(str);
    location.href = `../Organization/Detail.html?id=${JSON.parse(str).id}`;
}