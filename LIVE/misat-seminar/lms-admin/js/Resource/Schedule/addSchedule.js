/*
    說明：新增資料儲存
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

//Variable Initialization
let user = new CPerson();
let practRoleID; 

//Function Initialization
$(document).ready(function(){
	loginData= sessionGet("loginAccount");
	if(loginData==null) {
		//redirect users to login page
		window.location.href = "https://tzfhir.ml/system/fhir-lms/misac/login.html";
		//history.back();
	} 
	else {
		//init page
		//document.getElementById("loadingPage").style.display = "block";
		user.id = ret.userLogin.id;
		user.name = ret.userLogin.name;
		user.username = ret.userLogin.username;
		
		if(sessionStorage.getItem("practRoleID"))
			practRoleID= sessionStorage.getItem("practRoleID");
	}
});

document.getElementById('Add').getElementsByClassName('CourseCodePK')[0].onchange = function (){
	var code = document.getElementById('Add').getElementsByClassName('CourseCodePK')[0].value;
    getResource(FHIRURL, 'Schedule', '?specialty=100000100' + code, FHIRResponseType, 'courseCodeIsExist');
}

let codeIsExist;
function courseCodeIsExist(str){
	let obj = JSON.parse(str);
	let total= obj.total? obj.total :"";
	if(total>0){
		alert("This course code already exist!");
		codeIsExist=1;
	}
	else if(total==0)
		codeIsExist=0;
}

document.getElementById('Add').getElementsByClassName('Save')[0].onclick = function () {
//function addCourse(){
	var partOfid = QueryString('id');
    var resource = 'Schedule';
    var code = document.getElementById('Add').getElementsByClassName('CourseCode')[0].getElementsByTagName('input')[0].value;
    var name = document.getElementById('Add').getElementsByClassName('CourseName')[0].getElementsByTagName('input')[0].value;
    var startDate = document.getElementById('Add').getElementsByClassName('PeriodDate')[0].getElementsByTagName('input')[0].value;
    var endDate = document.getElementById('Add').getElementsByClassName('PeriodDate')[0].getElementsByTagName('input')[1].value;
    var nameOfDay = document.getElementById('Add').getElementsByClassName('NameOfDay')[0].getElementsByTagName('input')[0].value;
    var startTime = document.getElementById('Add').getElementsByClassName('PeriodTime')[0].getElementsByTagName('input')[0].value;
    var endTime = document.getElementById('Add').getElementsByClassName('PeriodTime')[0].getElementsByTagName('input')[1].value;
    var startDateTime= startDate + 'T' + startTime + ':00';
	var endDateTime= endDate + 'T' + endTime + ':00';
	var maxParticipant = document.getElementById('Add').getElementsByClassName('MaxParticipant')[0].getElementsByTagName('input')[0].value;
    var status = document.getElementById('Add').getElementsByClassName('Status')[0].getElementsByTagName('input');
    status = status[0].checked ? status[0].value : status[1].value;

    let fhirJson = {
        'resourceType': resource,
		'serviceCategory': [ {
			'coding': [ {
			  'code': '100000',
			  'display': 'Course Schedule'
			} ]
		  } ],
		  'serviceType': [ {
			'coding': [ {
			  'code': '100000100',
			  'display': 'Educational Course Schedule'
			} ]
		  } ],
		   'specialty': [ {
			'coding': [ {
			  'code': '',
			  'display': ''
			} ]
		  } ],
		  'actor': [ {
			'reference': 'PractitionerRole/' + practRoleID,
			'display': user.name
		  } ]
    } 
	if (code)
        fhirJson['specialty'][0]['coding'][0]['code'] = '100000100' + code;
    if (name)
        fhirJson['specialty'][0]['coding'][0]['display'] = name;
	
	if (startDateTime)
        fhirJson['planningHorizon'] = {
										'start': startDateTime,
										'end': endDateTime
									  }
    if (nameOfDay)
        fhirJson['comment'] = "Every " + nameOfDay;
    if (status)
        fhirJson['active'] = status;
	// if (maxParticipant)
        // createGroup();
	//document.getElementById('Add').getElementsByClassName('Name')[0].getElementsByClassName('Message')[0].innerText = '* 請輸入名稱';
	
    postResource(FHIRURL, 'Schedule', '', FHIRResponseType, 'createPlanDefinition', JSON.stringify(fhirJson))
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
	let obj= JSON.parse(str);
	if(retValue(obj))
	{
		alert('Course successfully added!')
		window.open(`Detail.html?id=${obj.id}`,"_self");
	}
	else
		alert('Added failed!');
}

function createPlanDefinition(str){
	let obj= JSON.parse(str);
	var resource = 'PlanDefinition';
	let courseName=obj.specialty[0].coding[0].display;
	let fhirJson = {
        'resourceType': resource,
		'identifier': [ {
			'use': 'official'
		} ],
		'version': '1.0.0',
		'name': 'ScheduleSlotDocumentReference',
		'title': 'Oxford University-' + courseName + '-Teaching Plan',
		'status': 'active',
		'date': getTodayDate(),
		'purpose': 'This plan shows the instructions for the student who participates in the course.',
		'approvalDate': getTodayDate(),
		'lastReviewDate': getTodayDate(),
		'effectivePeriod': {
			'start': obj.planningHorizon.start.split('T')[0],
			'end': obj.planningHorizon.end.split('T')[0]
		},
		'relatedArtifact': [ {
			'type': 'composed-of',
			'display': 'CourseSchedule-' + courseName,
			'resource': 'Schedule/' + obj.id
		}],
		"author": [ {
			"name": user.name,
			"telecom": [ {
			  "system": "email",
			  "value": user.username,
			  "use": "work"
			} ]
		} ]
    }
	
	postResource(FHIRURL, 'PlanDefinition', '', FHIRResponseType, 'altMessage', JSON.stringify(fhirJson))
}