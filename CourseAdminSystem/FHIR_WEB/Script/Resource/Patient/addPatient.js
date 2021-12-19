var today = getTodayDate();
document.getElementById('Add').getElementsByClassName('BirthDate')[0].getElementsByTagName('input')[0].setAttribute("max", today);


document.getElementById('Add').getElementsByClassName('Save')[0].onclick = function () {
    let resource = 'Patient';
    let managingOrganization = QueryString('id');
    let name = document.getElementById('Add').getElementsByClassName('Name')[0].getElementsByTagName('input')[0].value;
    let gender = document.getElementById('Add').getElementsByClassName('Gender')[0].getElementsByTagName('select')[0].value;
    let birthDate = document.getElementById('Add').getElementsByClassName('BirthDate')[0].getElementsByTagName('input')[0].value;
    let address = document.getElementById('Add').getElementsByClassName('Address')[0].getElementsByTagName('input')[0].value;
    let phone = document.getElementById('Add').getElementsByClassName('Phone')[0].getElementsByTagName('input')[0].value;
    let status = document.getElementById('Add').getElementsByClassName('Status')[0].getElementsByTagName('input');
    status = status[0].checked ? status[0].value : status[1].value;

    let fhirJson = {
        'resourceType': resource,
    }
    if (name)
        fhirJson['name'] = { 'text': name }
    if (gender)
        fhirJson['gender'] = gender;
    if (birthDate)
        fhirJson['birthDate'] = birthDate;
    if (address)
        fhirJson['address'] = { 'text': address }
    if (phone)
        fhirJson['telecom'] = { 'value': phone }
    if (managingOrganization)
        fhirJson['managingOrganization'] = { 'reference': `Organization/${managingOrganization}` }
    if (status)
        fhirJson['active'] = status;

    if (name.trim().length > 0) {
        postResource(FHIRURL, 'Patient', '', FHIRResponseType, 'altMessage', JSON.stringify(fhirJson))
    } else {
        document.getElementById('Add').getElementsByClassName('Name')[0].getElementsByClassName('Message')[0].innerText = '* 請輸入名稱';
    }
}

document.getElementById('Add').getElementsByClassName('Back')[0].onclick = function () {
    window.history.back();
}

function altMessage(str) {
    alert('新增成功');
    alert(str);
    location.href = `../Patient/Detail.html?id=${JSON.parse(str).id}`;
}