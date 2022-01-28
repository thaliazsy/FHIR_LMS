var id = (QueryString('id') == '') ? '' : QueryString('id');

if (id)
    getResource(FHIRURL, 'Patient', '?organization=' + id, FHIRResponseType, 'setPatientListData');
else
    getResource(FHIRURL, 'Patient', '', FHIRResponseType, 'setPatientListData');

document.querySelector('.Btn.Add.Patient').onclick = function () {
    location.href = '../Patient/Add.html?id=' + id;
}

function setPatientListData(str) {
    let obj = JSON.parse(str);
    let template = [];

    obj.entry.map((entry, i) => {
        let id = entry.resource.id;
        let name = (entry.resource.name && entry.resource.name[0].text) ? entry.resource.name[0].text : '';
        let gender = getGender(entry.resource.gender);
        let address = (entry.resource.address && entry.resource.address[0].text) ? entry.resource.address[0].text : '';
        let phone = (entry.resource.telecom && entry.resource.telecom[0].value) ? entry.resource.telecom[0].value : '';
        let status = (entry.resource.active != undefined && entry.resource.active === false) ? '未啟用' : '啟用中';

        template.push(`
        <li class="L1 i${i + 1} ${id}">
            <div class="Num">${i + 1}</div>
            <div class="Id">${id}</div>
            <div class="Name">${name}</div>
            <div class="Gender">${gender}</div>
            <div class="Address">${address}</div>
            <div class="Phone">${phone}</div>
            <div class="Status">${status}</div>
            <div class="Tool">
                <ul class="L2s">
                    <li class="L2 i1">
                        <div class="${id} Btn Detail Title">查看</div>
                    </li>
                    <li class="L2 i1">
                        <div class="${id} Btn Edit Title">修改</div>
                    </li>
                </ul>
            </div>
            <div class="Clear"></div>
        </li>`);
    })
    document.getElementById('List').getElementsByClassName('List-Patient')[0].getElementsByClassName('Bodyer')[0].getElementsByClassName('L1s')[0].innerHTML += template.join('');

    document.getElementById('List').getElementsByClassName('List-Patient')[0].getElementsByClassName('Bodyer')[0].addEventListener('click', e => {
        if (e.target.tagName.toUpperCase() === 'DIV') {
            if (e.target.classList[2] === 'Detail') {
                let id = e.target.classList[0];
                location.href = `../Patient/Detail.html?id=${id}`;
            }
            else if (e.target.classList[2] === 'Edit') {
                let id = e.target.classList[0];
                location.href = `../Patient/Edit.html?id=${id}`;
            }
        }
    });
}