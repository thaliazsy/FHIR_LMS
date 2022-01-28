document.getElementById('Add').getElementsByClassName('Back')[0].onclick = function () {
    window.history.back();
}

document.getElementById('Add').getElementsByClassName('Save')[0].onclick = function () {
    let resource = 'PractitionerRole';
    let managingOrganization = QueryString('id');
    let phone = document.getElementById('Add').getElementsByClassName('Phone')[0].getElementsByTagName('input')[0].value;
    let time = document.getElementsByName('time');
    let status = document.getElementById('Add').getElementsByClassName('Status')[0].getElementsByTagName('input');
    status = status[0].checked ? status[0].value : status[1].value;

    let fhirJson = {
        'resourceType': resource,
    }
    if (phone)
        fhirJson['telecom'] = { 'value': phone }
    Array.from(time).map(t => {
        if (t.checked) {
            let index = t.classList[1];
            let value = t.classList[0];
            availableTimeTable[index]['daysOfWeek'].push(value);
        }
    })
    fhirJson['availableTime'] = availableTimeTable;
    if (managingOrganization)
        fhirJson['organization'] = { 'reference': `Organization/${managingOrganization}` }
    if (status)
        fhirJson['active'] = status;

    postResource(FHIRURL, 'PractitionerRole', '', FHIRResponseType, 'altMessage', JSON.stringify(fhirJson))

}

function altMessage(str) {
    alert('新增成功');
    alert(str);
    //location.href = `../PractitionerRole/Detail.html?id=${JSON.parse(str).id}`;
}


var availableTimeTable = [
    {
        "daysOfWeek": [
        ],
        "availableStartTime": "08:00:00",
        "availableEndTime": "12:00:00"
    },
    {
        "daysOfWeek": [
        ],
        "availableStartTime": "13:30:00",
        "availableEndTime": "17:30:00"
    }
]