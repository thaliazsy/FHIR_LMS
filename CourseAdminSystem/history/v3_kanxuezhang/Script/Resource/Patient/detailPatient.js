var id = (QueryString('id') == '') ? location.href = '../Patient/index.html' : QueryString('id');

getResource(FHIRURL, 'Patient', `/${id}`, FHIRResponseType, 'setDetailData');

document.getElementById('Detail').getElementsByClassName('Toggle')[0].onclick = function (e) {
    let newClassName = 'Bodyer-Close';
    let elem = document.getElementById('Detail');
    if(elem.className.match(/Bodyer-Close/))
        newClassName = 'Bodyer-Open';
    elem.className = newClassName;
}

document.getElementById('Detail').getElementsByClassName('Edit')[0].onclick = function () {
    location.href = `../Patient/Edit.html?id=${id}`;
}

function setDetailData(str) {
    let obj = JSON.parse(str);
    document.getElementById('Detail').getElementsByClassName('Name')[0].getElementsByClassName('Value')[0].textContent = (obj.name && obj.name[0].text) ? obj.name[0].text : '';
    document.getElementById('Detail').getElementsByClassName('Gender')[0].getElementsByClassName('Value')[0].textContent = getGender(obj.gender);
    document.getElementById('Detail').getElementsByClassName('BirthDate')[0].getElementsByClassName('Value')[0].textContent = obj.birthDate ? obj.birthDate.replace(/-/g, '/') : '';
    document.getElementById('Detail').getElementsByClassName('Address')[0].getElementsByClassName('Value')[0].textContent = (obj.address && obj.address[0].text) ? obj.address[0].text : '';
    document.getElementById('Detail').getElementsByClassName('Phone')[0].getElementsByClassName('Value')[0].textContent = (obj.telecom && obj.telecom[0].value) ? obj.telecom[0].value : '';
    document.getElementById('Detail').getElementsByClassName('Status')[0].getElementsByClassName('Value')[0].textContent = (obj.active != undefined && obj.active === false) ? '未啟用' : '啟用中';
    document.getElementById('Detail').getElementsByClassName('Organization')[0].getElementsByClassName('Value')[0].textContent = (obj.managingOrganization && obj.managingOrganization.reference) ? obj.managingOrganization.reference.split('/')[1] : '';
}