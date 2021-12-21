/*
    公用變數區
    FHIRURL：FHIR Server位址
    FHIRResponseType：要求FHIR Server回傳的資料型態
*/
//var FHIRURL = 'http://hapi.fhir.org/baseDstu3/';
//var FHIRURL = 'https://hapi.fhir.tw/fhir/';
//var FHIRURL = 'http://203.64.84.213:52888/r4/fhir/';
//var FHIRURL = 'http://hapi.fhir.org/baseR4/';
var FHIRURL =  'http://203.64.84.213:8080/fhir/';
var partOfid = '';
var FHIRResponseType = 'json';

/*
    showResource(str)
    說明：將資料顯示於網頁上
    參數：
        str：欲顯示資料
*/
function showResource(str) {
    console.log(str)
}

/*
    說明：點擊"Logo"後，返回主頁
*/
document.getElementById('Logo').onclick = function () {
    location.href = './Schedule/index2.html';
}

function getTodayDate() {
    var fullDate = new Date();
    var yyyy = fullDate.getFullYear();
    var MM = (fullDate.getMonth() + 1) >= 10 ? (fullDate.getMonth() + 1) : ("0" + (fullDate.getMonth() + 1));
    var dd = fullDate.getDate() < 10 ? ("0" + fullDate.getDate()) : fullDate.getDate();
    var today = yyyy + "-" + MM + "-" + dd;
    return today;
}

function getGender(str) {
    switch (str) {
        case 'male':
            return '男';
        case 'female':
            return '女';
        case 'unknown':
            return '未知';;
        default:
            return '其它';
    }
}

function tablePagination(id, row){
	let tableID= "#parent-" + id;
	$(tableID).after('<div id="nav"></div>');
	tableID+= " .child";
	var rowsShown = row;
	var rowsTotal = $(tableID).length;
	var numPages = rowsTotal/rowsShown;
	for(i = 0;i < numPages;i++) {
		var pageNum = i + 1;
		$('#nav').append('<a href="#" rel="'+i+'">'+pageNum+'</a> ');
	}
	$(tableID).hide();
	$(tableID).slice(0, rowsShown).show();
	$('#nav a:first').addClass('active');
	$('#nav a').bind('click', function(){

		$('#nav a').removeClass('active');
		$(this).addClass('active');
		var currPage = $(this).attr('rel');
		var startItem = currPage * rowsShown;
		var endItem = startItem + rowsShown;
		$(tableID).css('opacity','0.0').hide().slice(startItem, endItem).
				css('display','table-row').animate({opacity:1}, 300);
	});
}
