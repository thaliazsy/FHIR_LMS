/*
    說明：點擊"查詢"後，依照所選條件與所輸入之關鍵字進行資料搜尋 
    條件類型：
        id：資料編號
            => 因id具唯一性，所以若以id進行搜尋，搜尋後直接進入查看個別資料
        partof：父層編號
        name：資料名稱
        address-city：資料所屬縣市
        address：資料地址
        
*/
document.getElementById('Search').getElementsByClassName('Search')[0].onclick = function(){
    var searchType = document.getElementById('Search').getElementsByTagName('select')[0].value;
    var searchValue = document.getElementById('Search').getElementsByTagName('input')[0].value;
    if(searchType=='id'){
        location.href = '../Organization/Detail.html?id=' + searchValue+'';
    }else{
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
        getResource(FHIRURL,'Organization','?'+ searchType +'='+searchValue,FHIRResponseType,'setListData');
    }
}

/*function setListData(str){
    var obj = JSON.parse(str)
    document.getElementById('List').getElementsByClassName('L1s')[1].innerHTML = '';
    for(var i = 0; i<obj.entry.length;i++){
        var id = (obj.entry[i].resource.id == undefined) ? '' : obj.entry[i].resource.id;
        var name = (obj.entry[i].resource.name == undefined) ? '' : obj.entry[i].resource.name;
        
        var city = (obj.entry[i].resource.address != undefined)?((obj.entry[i].resource.address[0].city == undefined) ? '' : obj.entry[i].resource.address[0].city):'';
        var address = (obj.entry[i].resource.address != undefined)?((obj.entry[i].resource.address[0].line == undefined) ? '' : obj.entry[i].resource.address[0].line):'';
        var phone = (obj.entry[i].resource.telecom != undefined)?((obj.entry[i].resource.telecom[0].value == undefined) ? '' : obj.entry[i].resource.telecom[0].value):'';
        var Status = (obj.entry[i].resource.active == undefined) ? 'T' : ((obj.entry[i].resource.active == true) ? 'T' : 'F');

        var str = '<li class="L1 i'+ (i+1) +' '+ id +'">';
        str = str + '<div class="Num">'+ (i+1) +'</div>';
        str = str + '<div class="Id">'+ id +'</div>';
        str = str + '<div class="Name">'+ name +'</div>';
        str = str + '<div class="City">'+ city +'</div>';
        str = str + '<div class="Addr">'+ address +'</div>';
        str = str + '<div class="Phone">'+ phone +'</div>';
        str = str + '<div class="Status">' + Status + '</div>';
        str = str + '<div class="Tool"><ul class="L2s"><li class="L2 i1"><div class="'+ id + ' Btn Detail Title">查看</div></li><li class="L2 i1"><div class="'+ id + ' Btn Edit Title">修改</div></li></ul></div>';
        str = str + '<div class="Clear"></div>';
        str = str + '</li>';

        var html = document.getElementById('List').getElementsByClassName('L1s')[0].innerHTML;
        document.getElementById('List').getElementsByClassName('L1s')[0].innerHTML = html + str;
    }
    for(var i = 0;i<obj.entry.length;i++){
        document.getElementById('List').getElementsByClassName('L1s')[0].getElementsByClassName('Detail')[i].onclick = function(){
            var id = this.classList[0];
            location.href = '../Organization/Detail.html?id=' + id+'';
        }
        document.getElementById('List').getElementsByClassName('L1s')[0].getElementsByClassName('Edit')[i].onclick = function(){
            var id = this.classList[0];
            location.href = '../Organization/Edit.html?id=' + id+'';
        }
    }
}*/