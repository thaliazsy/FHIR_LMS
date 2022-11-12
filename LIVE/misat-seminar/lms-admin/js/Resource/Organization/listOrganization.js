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
        getResource(FHIRURL,'Organization','/1945606',FHIRResponseType,'showResource')
        取自組織資料（子層）
        getResource(FHIRURL,'Organization','?partof=1945606',FHIRResponseType,'showResource')
*/

//Function Initialization
$(document).ready(function(){
	loginData= sessionGet("loginAccount");
	if(loginData==null) {
		//redirect users to login page
		window.location.href = "../../misac/login.html";
		//window.location.href = "https://tzfhir.ml/system/fhir-lms/misac/login.html";
		//history.back();
	} 
	else {
		//init page
		$("#intro").html("Welcome, " + loginData.person.name + "!");
		let roleList= loginData.role;
		roleList.forEach(role => {
			if(role.roleName == "Practitioner"){
				getResource(FHIRURL, 'PractitionerRole', '?practitioner=' + role.practID, FHIRResponseType, 'getPractitionerRoleByPractID');
			}
		});
	}
});

/*
    說明：點擊"新增"後，切換至Add.html新增子組織
*/
// document.querySelector('.Btn.Add.Organization').onclick = function () {
    // location.href = '../Organization/Add.html?id=' + id;
// }
// document.querySelector('.Btn.Add.Patient').onclick = function () {
//     location.href = '../Patient/Add.html?id=' + id;
// }
// document.querySelector('.Btn.Add.PractitionerRole').onclick = function () {
//     location.href = '../PractitionerRole/Add.html?id=' + id;
// }

function getPractitionerRoleByPractID(str) {
    obj= JSON.parse(str);
	let template = [];

    obj.entry.map((entry, i) => {
        let id = (entry.resource.id) ? entry.resource.id : '';
        let practitionerID =(entry.resource.practitioner) ? entry.resource.practitioner.reference.split('/')[1] : '';
        let organizationID =(entry.resource.organization) ? entry.resource.organization.reference.split('/')[1] : '';
        let organizationName =(entry.resource.organization) ? entry.resource.organization.display : '';
        
        template.push(`
        <li class="L1 i${i + 1} ${id}">
            <div class="Num">${i + 1}</div>
            <div class="OrganizationID">${organizationID}</div>
            <div class="OrganizationName">${organizationName}</div>
            <div class="PractitionerID">${practitionerID}</div>
            <div class="Tool">
                <ul class="L2s">
                    <li class="L2 i1">
                        <div class="${id} Btn Detail Title">View</div>
                    </li>
                </ul>
            </div>
            <div class="Clear"></div>
        </li>`);
    })
    document.getElementById('List').getElementsByClassName('List-Organization')[0].getElementsByClassName('Bodyer')[0].getElementsByClassName('L1s')[0].innerHTML += template.join('');

    document.getElementById('List').getElementsByClassName('List-Organization')[0].getElementsByClassName('Bodyer')[0].addEventListener('click', e => {
        if (e.target.tagName.toUpperCase() === 'DIV') {
            if (e.target.classList[2] === 'Detail') {
				let id = e.target.classList[0];
                location.href = `../Schedule/index.html?id=${id}`;
            }
            else if (e.target.classList[2] === 'Edit') {
                let id = e.target.classList[0];
                location.href = `../Organization/Edit.html?id=${id}`;
            }
        }
    });
}