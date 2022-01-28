
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
if (id){
    getResource(FHIRURL, 'Slot', '?schedule=' + id + "&_count=306", FHIRResponseType, 'setSlotListData');
}
else
    getResource(FHIRURL, 'Slot', '', FHIRResponseType, 'setSlotListData');

/*
    說明：點擊"新增"後，切換至Add.html新增子組織
*/
// document.querySelector('.Btn.Add.Slot').onclick = function () {
    // location.href = '../Slot/Add.html?id=' + id;
// }
// document.querySelector('.Btn.Add.Patient').onclick = function () {
//     location.href = '../Patient/Add.html?id=' + id;
// }
// document.querySelector('.Btn.Add.PractitionerRole').onclick = function () {
//     location.href = '../PractitionerRole/Add.html?id=' + id;
// }

function setSlotListData(obj) {
    //let obj = JSON.parse(str);
    let template = [];
	let arrScheduleCode= [];
	let indexNo=0;
    obj.entry.map((entry, i) => {
        let id = (entry.resource.id) ? entry.resource.id : '';
        let scheduleCode = (entry.resource.identifier) ? entry.resource.identifier[0].value : '';
		
		if (!arrScheduleCode.includes(scheduleCode)){
			indexNo++;
			arrScheduleCode.push(scheduleCode);
			//let comment = (entry.resource.comment && entry.resource.comment.length) ? entry.resource.comment : '';
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
			<li class="L1 child i${indexNo} ${id}">
				<div class="Num">${indexNo}</div>
				<div class="Id">${id}</div>
				<div class="ScheduleCode">${scheduleCode}</div>
				<div class="StartDate">${startDate}</div>
				<div class="EndDate">${endDate}</div>
				<div class="Tool">
					<ul class="L2s">
						<li class="L2 i1">
							<div class="${scheduleCode} Btn Detail Title">查看</div>
						</li>
						<li class="L2 i1">
							<div class="${id} Btn Edit Title">修改</div>
						</li>
					</ul>
				</div>
				<div class="Clear"></div>
				<table class="CourseMaterialTable" id=${id}>${content}</table>
			</li>`);
		}
		
    })
    document.getElementById('List').getElementsByClassName('List-Slot')[0].getElementsByClassName('Bodyer')[0].getElementsByClassName('L1s')[0].innerHTML += template.join('');
	tablePagination("List-Slot", 5);
	
    document.getElementById('List').getElementsByClassName('List-Slot')[0].getElementsByClassName('Bodyer')[0].addEventListener('click', e => {
        if (e.target.tagName.toUpperCase() === 'DIV') {
            if (e.target.classList[2] === 'Detail') {
                let id = e.target.classList[0];
                location.href = `../Person/index.html?id=${id}`;
            }
            else if (e.target.classList[2] === 'Edit') {
                let id = e.target.classList[0];
                location.href = `../Slot/Edit.html?id=${id}`;
            }
        }
    });
	
	getResource(FHIRURL, 'PlanDefinition', '?composed-of=Schedule/' + id, FHIRResponseType, 'getMaterialByScheduleID');
}

class CSchedule{
	constructor(p1) {
		this.scheduleID= p1;
		this.material=[];
		this.materialJSON="";
	}
}

class CMaterial{
	constructor(ptitle, purl, plabel) {
		this.title= ptitle;
		this.url= purl;
		this.label= plabel;
	}
}
let courseSchedule;

function getMaterialByScheduleID(obj){
	if (obj.total == 0)	alert('No Course Material!');
	else{
		obj.entry.map((entry, i) => {
			var index=1;	//since relatedArtifact[0] store Schedule information instead of material 
			let scheduleID= entry.resource.relatedArtifact ? entry.resource.relatedArtifact[0].resource.split("/")[1] : "";
			courseSchedule= new CSchedule(scheduleID);
			courseSchedule.materialJSON=entry.resource;
			let relatedArtifactLen= entry.resource.relatedArtifact ? entry.resource.relatedArtifact.length : 0;
			while(index < relatedArtifactLen)
			{
				let title= entry.resource.relatedArtifact[index].display;
				let url= entry.resource.relatedArtifact[index].url? entry.resource.relatedArtifact[index].url : '';
				let label= entry.resource.relatedArtifact[index].label? entry.resource.relatedArtifact[index].label : '';
				let material= new CMaterial(title, url, label);
				courseSchedule.material.push(material); //must only return 1 row
				index++;
			}
		});
	}
	showMyCourse();
}


function showMyCourse(){
	var table= document.getElementById("TableCourseMaterial");
	var cellIndex;
	var row, noIndex=1, videoName;
	
	//check per organization
	let indexTable;					
	table.innerHTML+= '<tr><th>Slot No.</th><th>Slot Date</th><th>Type</th><th>Title</th><th>URL</th><th></th></tr>';
	var indexNo=1;
	//check per slot
	courseSchedule.material.forEach(item2 => {		//per Slot
		let temp=item2.title.split("-");
		addParameter(temp[0], item2.label, temp[1], temp[2], item2.url);
	});
}

function addParameter(v1, v2, v3, v4, v5){
	var tableParam = document.getElementById("TableCourseMaterial");
	var row = tableParam.insertRow(-1);
	row.align="left";
	//row.insertCell(1).innerHTML = '<select id="materialType"><option value="courseMaterial">courseMaterial</option><option value="questionnaire">questionnaire</option><option value="video">video</option></select>';
	row.insertCell(0).innerHTML = '<input type="text" value="' + v1 + '">';
	row.insertCell(1).innerHTML = '<input type="text" value="' + v2 + '">';
	row.insertCell(2).innerHTML = '<input type="text" value="' + v3 + '">';
	row.insertCell(3).innerHTML = '<input type="text" value="' + v4 + '">';
	row.insertCell(4).innerHTML = '<input type="text" value="' + v5 + '">';
	row.insertCell(5).innerHTML = '<button onclick="delParam(this)">delete</button>'
}		

function delParam(row){
	var index= row.parentNode.parentNode.rowIndex;
	var tableParam = document.getElementById('TableCourseMaterial');
	var count = tableParam.rows.length;
	tableParam.deleteRow(index);
	for (var c=index;c<count;c++){
		tableParam.rows[c].cells[0].innerHTML=c;
	}
}


function updateSlot(){
	var tableParam = document.getElementById('TableCourseMaterial');
	// document.getElementById("loader").style.display = "block";
	// document.getElementById("myModal").style.display = "block";
	
	var count = tableParam.rows.length;
	var codingJSON = '{"relatedArtifact":[]}';
	let temp= courseSchedule.materialJSON;
	
	if (temp.relatedArtifact)
	{	//{ "relatedArtifact": 
		let str='[' + JSON.stringify(temp.relatedArtifact[0]) + ',';
		for(var i=1;i<count;i++)
		{
			let display= tableParam.rows[i].cells[0].children[0].value + '-' + tableParam.rows[i].cells[2].children[0].value + '-' + tableParam.rows[i].cells[3].children[0].value;
			let label= tableParam.rows[i].cells[1].children[0].value;
			let url= tableParam.rows[i].cells[4].children[0].value;
			str+= '{"type": "composed-of","display": "' + display + '","label": "' + label + '" ';
			if (url != "") str+= ', "url": "' + url + '"}';
			else str+= '}';
			
			//if item in array last then add ']}', else add ','
			if(i<count-1) str+= ',';
			else if(i==count-1) str+= ']';
		}
		
		let resID= temp.id;
		temp.relatedArtifact= JSON.parse(str);
		putResource(FHIRURL, 'PlanDefinition', '/' + resID, FHIRResponseType, "updateResult", JSON.stringify(temp));
	}
	
	// for (var i=1;i<count;i++){
		// temp= '{"display": "' + tableParam.rows[i].cells[1].children[0].value + '","url": "' + tableParam.rows[i].cells[3].children[0].value + '","display": "' + tableParam.rows[i].cells[2].children[0].value + '"}';
		// <!-- //if(i==count-1)	temp.slice(0, -1);  //remove ',' for the last element in json -->
		// <!-- var codingJSON= slotJSONobj.appointmentType; -->
		// <!-- codingJSON['coding'].push(JSON.parse(temp)); -->
		
		// var obj = JSON.parse(codingJSON);
		// obj['coding'].push(JSON.parse(temp));
		// codingJSON = JSON.stringify(obj);
	// }
	// slotJSONobj.appointmentType= JSON.parse(codingJSON);
	// HTTPPutData(FHIRserver + 'Slot/' + arrSlotID[0], JSON.stringify(slotJSONobj), 1, "updateSlot");
}

document.getElementById('Detail').getElementsByClassName('Toggle')[0].onclick = function (e) {
    let newClassName = 'Bodyer-Close';
    let elem = document.getElementById('Detail');
    if(elem.className.match(/Bodyer-Close/))
        newClassName = 'Bodyer-Open';
    elem.className = newClassName;
}

function updateResult(obj){
	if (!isError(obj.resourceType, "Update failed!"))
	{
		alert("Update complete!");
		location.reload();
	}
}

function isError(resourceType, msg){
	if(resourceType=="OperationOutcome")
	{
		//document.getElementById("loadingPage").style.display = "none";
		alert(msg);
		return 1;
	}
	else
		return 0;
}
	