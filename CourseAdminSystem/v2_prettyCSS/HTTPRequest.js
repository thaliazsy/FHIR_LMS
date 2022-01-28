var ret, totalPost;
let arrSlotID= new Array();
var FHIRserver = 'http://203.64.84.213:8080/fhir/'; //'https://hapi.fhir.tw/fhir'; //"http://203.64.84.213:8080/fhir";
//Get FHIR data
function HTTPGetData(urlStr) {
    var HttpObj = new XMLHttpRequest();   
    HttpObj.onreadystatechange = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
            alert(ret);
            callBack(ret);
			//alert("data retrieved");
        }
    }
	HttpObj.open("GET", urlStr, true);
    HttpObj.send();
}

//Upload FHIR data
function HTTPPostData(urlStr, dataStr) {
    var HttpObj = new XMLHttpRequest();
	HttpObj.open("POST", urlStr, true);
	HttpObj.setRequestHeader("Content-type", "application/json+fhir");
    //HttpObj.setRequestHeader("Content-type", "application/xml+fhir");
    HttpObj.onreadystatechange = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
            alert(ret);
			totalPost--;
			if (totalPost>0) HTTPPostData(urlStr, dataStr ); 
        }
    }
    HttpObj.send(dataStr);
}

//Update FHIR data
function HTTPPutData(urlStr, dataStr, curIndex, type) {
    var HttpObj = new XMLHttpRequest();
	HttpObj.open("PUT", urlStr, true);
	HttpObj.setRequestHeader("Content-type", "application/json+fhir");
    HttpObj.onload = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
			alert(ret);
			if(type=="updateSlot")
			{
				if (curIndex<arrSlotID.length){
					slotJSONobj.id= arrSlotID[curIndex];
					HTTPPutData(FHIRserver + 'Slot/' + arrSlotID[curIndex], JSON.stringify(slotJSONobj), curIndex+1, "updateSlot");
				}
				else{
					document.getElementById("loader").style.display = "none";
					document.getElementById("myModal").style.display = "none";
					location.reload();
				}
			}
		}
    }
    HttpObj.send(dataStr);
}

//Delete FHIR Data
function HTTPDeleteData(urlStr) {
    var HttpObj = new XMLHttpRequest();   
    HttpObj.onreadystatechange = function () {
        if (HttpObj.readyState === 4) {
            ret = HttpObj.responseText;
            alert(ret);
        }
    }
	HttpObj.open("DELETE", urlStr, true);
    HttpObj.send();
}

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
*/
function postResource(URL, ResourceName, Parameter, ResponseType, callback, RequestData){
    //組欲向FHIR Server索取資料的路徑
    var url = URL + ResourceName + Parameter;
    //建立與伺服器互動元件
    var xhttp = new XMLHttpRequest();
    /*
        xhttp.open(method, url, async)
        說明：初始化元件
        參數：
            method：HTTP方法。分別有"GET、"POST"、"PUT"、"DELETE"
            url：要求路徑
            async：是否同步執行操作
    */
    xhttp.open("POST", url, true);
    /*
        xhttp.setRequestHeader(header, value)
        說明：設置HTTP標頭的值
        參數：
            header：標頭名稱
            value：標頭的值
    */
    xhttp.setRequestHeader("Content-type", 'text/' + ResponseType);
    /*
        xhttp.onreadystatechange = callback;
        說明：建立當readyState狀態改變時執行的部分
    */
    xhttp.onreadystatechange = function () {
        /*
            this.readyState
            說明：回傳XMLHttpRequest 客戶端物件目前的狀態
            值：
                0：UNSENT，物件已建立，但open()尚未被呼叫
                1：OPENED，open()已被呼叫
                2：HEADERS_RECEIVED，send()已被呼叫，並可取得header與status。
                3：LOADING，回應資料取得中
                4：DONE，完成
        */
        /*
            this.status
            說明：根據XMLHttpRequest的回應傳回的狀況編碼
            值：
                0：UNSENT or OPENED
                200：LOADING or DONE
        */
        // if (this.readyState == 4 && this.status == 201) {
            // var str = this.response;
            // /*
                // eval(string)
                // 說明：將字串轉為JavaScript Code執行
            // */
            // eval(callback)(str);
            // return str;
        // }else{
            // if(this.readyState == 4 && this.status != 201)
                // alert('資料取得錯誤。錯誤原因：'+this.readyState+':'+this.status)
        // }
		/*
			eval(string)
			說明：將字串轉為JavaScript Code執行
		*/
		eval(callback)(this);
		return this;
    };
    /*
        xhttp.send()
        說明：向指定Sever路徑發送請求
    */
    xhttp.send(RequestData);
}

/*
    getResource(URL, ResourceName, Parameter, ResponseType, AfterFun)
    說明：向Server取資料
    參數：
        URL：Server 路徑
        ResourceName：Resource名稱
        Parameter：向Server要求的參數
        ReponseType：要求Server 回傳的資料型態
        AfterFun：資料取得後欲執行的函式
*/
function getResource(URL, ResourceName, Parameter, ResponseType, AfterFun){
    //組欲向FHIR Server索取資料的路徑
    var url = URL + ResourceName + Parameter;
    //建立與伺服器互動元件
    var xhttp = new XMLHttpRequest();
    /*
        xhttp.open(method, url, async)
        說明：初始化元件
        參數：
            method：HTTP方法。分別有"GET、"POST"、"PUT"、"DELETE"
            url：要求路徑
            async：是否同步執行操作
    */
    xhttp.open("GET", url, true);
    /*
        xhttp.setRequestHeader(header, value)
        說明：設置HTTP標頭的值
        參數：
            header：標頭名稱
            value：標頭的值
    */
    xhttp.setRequestHeader("Content-type", 'text/' + ResponseType);
    /*
        xhttp.onreadystatechange = callback;
        說明：建立當readyState狀態改變時執行的部分
    */
    xhttp.onreadystatechange = function () {
        /*
            this.readyState
            說明：回傳XMLHttpRequest 客戶端物件目前的狀態
            值：
                0：UNSENT，物件已建立，但open()尚未被呼叫
                1：OPENED，open()已被呼叫
                2：HEADERS_RECEIVED，send()已被呼叫，並可取得header與status。
                3：LOADING，回應資料取得中
                4：DONE，完成
        */
        /*
            this.status
            說明：根據XMLHttpRequest的回應傳回的狀況編碼
            值：
                0：UNSENT or OPENED
                200：LOADING or DONE
        */
        if (this.readyState == 4 && this.status == 200) {
            var str = this.response;
			let obj = JSON.parse(str);
			if(obj.hasOwnProperty('total') && url.match(/_count/) == null){
				if(obj.total>20){
					let newParameter;
					if(Parameter=='')	
						newParameter= '?';
					else 
						newParameter= '&';
					
					newParameter += '_count=' + obj.total;
					getResource(URL, ResourceName, newParameter, ResponseType, AfterFun);	
				}
			}
            /*
                eval(json object)
                說明：將字串轉為JavaScript Code執行
            */
				eval(AfterFun)(obj);
            return obj;
        }else{
            if(this.readyState == 4 && this.status != 200)
                alert('資料取得錯誤。錯誤原因：'+this.readyState+':'+this.status)
        }
    };
    /*
        xhttp.send()
        說明：向指定Sever路徑發送請求
    */
    xhttp.send();
}