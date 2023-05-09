//Function Initialization
$(document).ready(function () {
    document.getElementById("loadingPage").style.display = "block";
    /* Check session */
    loginData = sessionGet("loginAccount");
    if (loginData == null) {
        //redirect users to login page
        window.location.href = "../login.html";
    }
    else {
        //Display document
        displayDocument(FHIRURL, 'DocumentReference', '?author=' + loginData.userSelectedRole + "&_sort=-_lastUpdated", FHIRResponseType, 'listDocs');
    }
});

//Display document
function displayDocument() {
    let obj = loginData.selectedDocRef;
    document.getElementById("DocRefID").innerHTML = "DocumentReference/" + obj.fullUrl.split('/').pop();

    let docType = (obj.resource.type) ? obj.resource.type.coding[0].code : null;


    let date = (obj.resource.date) ? obj.resource.date.replace("T", " ").substring(0, 16) : '';
    let type = (obj.resource.type) ? obj.resource.type.coding[0].display : '';
    let subject = (obj.resource.subject.display) ? obj.resource.subject.display : obj.resource.subject.reference;
    let author = (obj.resource.author[0].display) ? obj.resource.author[0].display : obj.resource.author[0].reference;
    let endPoints = "";
    obj.resource.content.map((endpoint, i) => {
        endPoints += endpoint.attachment.title + ": " + endpoint.attachment.url + "<br>";
    })

    let headers = ["Date", "Document Type", "Subject", "Author", "Endpoints"];
    let values = [date, type, subject, author, endPoints]

    for (i = 0; i < headers.length; i++) {
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.innerHTML = headers[i];
        let td = document.createElement("td");
        td.innerHTML = values[i];
        tr.appendChild(th);
        tr.appendChild(td);
        document.getElementById("DocTable").appendChild(tr);
    }
    //Add Viewer list
    let selection = document.createElement("select");
    selection.id = "viewer";
    selection.options[0] = new Option("Please choose a viewer.");

    if (obj.resource.type.coding[0].code == "skinlesion.report.document") {

        selection.options[1] = new Option("Skin Lesion Report Viewer", "skinlesion.report.document");
    }


    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.innerHTML = "Document Viewer";
    let td = document.createElement("td");
    td.appendChild(selection);
    tr.appendChild(th);
    tr.appendChild(td);
    document.getElementById("DocTable").appendChild(tr);
}

function getAccessToken() {

    //Using XMLHttpRequest component to interact with the server
    var xhttp = new XMLHttpRequest();
    /*
        xhttp.open(method, url, async)
        @desc： Initialize components
        @param： 
            method： Using HTTP "GET" method
            url： Request path
            async： synchronously(false) or asynchronously(true)
    */
    xhttp.open("POST", JWTAPIURL, false);
    /*
        xhttp.setRequestHeader(header, value)
        @desc： Set the value of the HTTP header
        @param：
            header： Header name
            value： Header value
    */
    xhttp.setRequestHeader("Content-type", 'text/' + FHIRResponseType);
    /*
        xhttp.onreadystatechange = callback;
        @desc：Stores a function to be called automatically each time the readyState property changes
    */
    xhttp.onreadystatechange = function () {
        /*
            this.readyState
            @desc： Return the current status of the XMLHttpRequest
            @value：
                0: request not initialized
                1: server connection established
                2: request received (can obtained header & status)
                3: processing request
                4: request finished and response is ready
        */
        /*
            this.status
            @desc：HTTP status messages that might be returned
            @value：
                0：UNSENT or OPENED
                200：LOADING or DONE
                403:FORBIDDEN
                404:PAGE NOT FOUND
        */
        if (this.readyState == 4 && (this.status == 200 || this.status == 201)) {
            var str = this.response;
            alert("token: " + str);
            let viewer = document.getElementById("viewer");

            if (viewer.value == "skinlesion.report.document") {
                //Open Viewer
                window.open("dummy-viewer.html", "_self");
            }
            else {
                alert("Viewer not available!");
            }
        }
        else if (this.readyState == 4 && (this.status != 200 || this.status != 201)) {
            alert(this.response);
        }
    };
    /*
        xhttp.send()
        @desc： Send a request to the specified server path
    */

    xhttp.send(JSON.stringify(loginData));
}

