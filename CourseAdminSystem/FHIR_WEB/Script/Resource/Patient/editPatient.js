var today = getTodayDate();
document.getElementById('Edit').getElementsByClassName('BirthDate')[0].getElementsByTagName('input')[0].setAttribute("max", today);


var id = (QueryString('id') == '') ? location.href = '../Patient/index.html' : QueryString('id');

getResource(FHIRURL, 'Patient', `/${id}`, FHIRResponseType, 'setEditData');

document.getElementById('Edit').getElementsByClassName('Back')[0].onclick = function () {
    window.history.back();
}

document.getElementById('Edit').getElementsByClassName('Save')[0].onclick = function () {
    let resource = 'Patient';
    let name = document.getElementById('Edit').getElementsByClassName('Name')[0].getElementsByTagName('input')[0].value;
    let gender = document.getElementById('Edit').getElementsByClassName('Gender')[0].getElementsByTagName('select')[0].value;
    let birthDate = document.getElementById('Edit').getElementsByClassName('BirthDate')[0].getElementsByTagName('input')[0].value;
    let address = document.getElementById('Edit').getElementsByClassName('Address')[0].getElementsByTagName('input')[0].value;
    let telecom = document.getElementById('Edit').getElementsByClassName('Phone')[0].getElementsByTagName('input')[0].value;
    let managingOrganization = document.getElementById('Edit').getElementsByClassName('Organization')[0].getElementsByTagName('input')[0].value;
    let status = document.getElementById('Edit').getElementsByClassName('Status')[0].getElementsByTagName('input');
    status = status[0].checked ? status[0].value : status[1].value;


    let fhirJson = {
        'resourceType': resource,
        'id': id
    }
    if (name)
        fhirJson['name'] = { 'text': name }
    if (gender)
        fhirJson['gender'] = gender;
    if (birthDate)
        fhirJson['birthDate'] = birthDate;
    if (address)
        fhirJson['address'] = { 'text': address }
    if (telecom)
        fhirJson['telecom'] = { 'value': telecom }
    if (status)
        fhirJson['active'] = status;
    if (managingOrganization)
        fhirJson['managingOrganization'] = { 'reference': `Organization/${managingOrganization}` }

    if (name.trim().length > 0) {
        putResource(FHIRURL, 'Patient', `/${id}`, FHIRResponseType, 'altMessage', JSON.stringify(fhirJson));
    } else {
        document.getElementById('Edit').getElementsByClassName('Name')[0].getElementsByClassName('Message')[0].innerText = '* 請輸入姓名';
    }
}

function setEditData(str) {
    let obj = JSON.parse(str);
    document.getElementById('Edit').getElementsByClassName('Name')[0].getElementsByTagName('input')[0].value = (obj.name && obj.name[0].text) ? obj.name[0].text : '';
    document.getElementById('Edit').getElementsByClassName('Gender')[0].getElementsByTagName('select')[0].value = obj.gender;
    document.getElementById('Edit').getElementsByClassName('BirthDate')[0].getElementsByTagName('input')[0].value = obj.birthDate ? obj.birthDate : '';
    document.getElementById('Edit').getElementsByClassName('Address')[0].getElementsByTagName('input')[0].value = (obj.address && obj.address[0].text) ? obj.address[0].text : '';
    document.getElementById('Edit').getElementsByClassName('Phone')[0].getElementsByTagName('input')[0].value = (obj.telecom && obj.telecom[0].value) ? obj.telecom[0].value : '';
    document.getElementById('Edit').getElementsByClassName('Organization')[0].getElementsByTagName('input')[0].value = (obj.managingOrganization && obj.managingOrganization.reference) ? obj.managingOrganization.reference.split('/')[1] : '';
    document.getElementById('Edit').getElementsByClassName('Status')[0].getElementsByTagName('input')[1].checked = (obj.active != undefined && obj.active === false) ? true : false;

    if (obj.active === false)
        document.getElementById('Edit').getElementsByClassName('Status')[0].getElementsByTagName('input')[1].checked = true;
}

function altMessage(str) {
    alert('儲存成功');
    alert(str);
    location.href = `../Patient/Detail.html?id=${id}`;
}