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
		//Get user control access range
		displayDocument(FHIRURL, 'DocumentReference', '?author=' + loginData.userSelectedRole + "&_sort=-_lastUpdated", FHIRResponseType, 'listDocs');
	}
});

//Display document
function displayDocument()
{
    let obj = loginData.selectedDocRef;

    document.getElementById("DocRefID").innerHTML="DocumentReference/" + obj.fullUrl.split('/').pop();

    let date = (obj.resource.date)? obj.resource.date.replace("T", " ").substring(0, 16) : '';
    let category = (obj.resource.category)? obj.resource.category[0].coding[0].display : '';
    let subject = (obj.resource.subject.display)? obj.resource.subject.display : obj.resource.subject.reference;
    let author =  (obj.resource.author[0].display)? obj.resource.author[0].display : obj.resource.author[0].reference;
    let endPoints = "";
    obj.resource.content.map((endpoint, i) => {
        endPoints += endpoint.attachment.title + ": " + endpoint.attachment.url + "<br>";
    })

    let headers = ["Date", "Document Type", "Subject", "Author", "Endpoints"];
    let values = [date, category, subject, author, endPoints]
    
    for (i=0; i<headers.length; i++){
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.innerHTML=headers[i];
        let td = document.createElement("td");
        td.innerHTML=values[i];
        tr.appendChild(th);
        tr.appendChild(td);
        document.getElementById("DocTable").appendChild(tr);
    }

}