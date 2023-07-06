//Step 2. Verify login account username and password
function getUserInformation(res) {
    var obj = JSON.parse(res.response);
    //2.1.1 Get account information
    loginData.token = res.getResponseHeader("Authorization");
    loginData.person.id = (obj.id) ? obj.id : '';
    loginData.person.name = (obj.name) ? obj.name[0].text : '';
    loginData.person.email = (obj.identifier[0]) ? obj.identifier[0].value : '';

    //2.1.2 Get user role (teacher or student)
    if (obj.link) {
        obj.link.map((link, i) => {
            let roleID = link.target.reference;
            if (roleID.split('/')[0] == "Practitioner") {
                CPractitioner.roleName = "Practitioner";
                CPractitioner.practID = roleID.split('/')[1];
                getResource(FHIRURL, 'PractitionerRole', '?practitioner=' + CPractitioner.practID, FHIRResponseType, 'getPractitionerRole');
                if (CPractitioner.organizationID == DB.organization)
                    loginData.role.push(CPractitioner);
            }
            if (roleID.split('/')[0] == "Patient") {
                CPatient.roleName = "Patient";
                CPatient.patientID = roleID.split('/')[1];
                getResource(FHIRURL, 'Patient', '/' + CPatient.patientID, FHIRResponseType, 'getPatient');
                if (CPatient.organizationID == DB.organization)
                    loginData.role.push(CPatient);
            }
        });
    }

    //Step 2.2.1 If Person exist, but Patient unexist, then create Patient and Appointment
    if (loginData.role.length == 0) {
        //alert(message.authorizeFail);
        personstr = res.response;
        getResource(FHIRURL, 'Slot', '?schedule=' + DB.schedule, FHIRResponseType, 'getSlotID');
        createPatient(personstr);
    }
    //Step 2.2.2 If Person and Patient exist, then direct to student homescreen (appointment will be created in the index.html)
    else if (loginData.role.length >= 1 && loginData.role[0].roleName == "Patient") {
        directToHomePage();
    }
    //Step 2.2.4 If Person and Practitioner exist, then direct to admin homescreen 
    else if (loginData.role.length >= 1 && loginData.role[0].roleName == "Practitioner") {
        window.open('https://tzfhir.ml/system/fhir-lms/lmsAdmin/Organization/index.html', "_self");
    }
    //Step 2.2.5 If Person has 2 roles (teacher and student), then direct to choose-role.html 
    else if (loginData.role.length > 1) {
        sessionSet("loginAccount", loginData, 30);
        window.open('choose-role.html', "_self");
    }
    else {
        alert(message.systemError + " " + message.contactPerson);
        $("#global-loader").hide();
    }
}
/* END WHEN USER SUBMIT LOGIN FORM */

//Get all slot ID 
function getSlotID(str) {
    let obj = JSON.parse(str);

    obj.entry.map((entry, i) => {
        loginData.slot.id.push(entry.resource.id);
    });
    initialize();
}

function getPractitionerRole(str) {
    let obj = JSON.parse(str);
    obj.entry.map((entry, i) => {
        CPractitioner.practRoleID = entry.resource.id ? entry.resource.id : '';
        CPractitioner.organizationID = entry.resource.organization ? entry.resource.organization.reference.split('/')[1] : '';
        CPractitioner.organizationName = entry.resource.organization.display ? entry.resource.organization.display : '';
        if (entry.resource.code) {
            entry.resource.code[0].coding.map((coding, i) => {
                CPractitioner.roleCode.push(coding.code);
            });
        }
    });
}

function getPatient(str) {
    let obj = JSON.parse(str);
    CPatient.organizationID = obj.managingOrganization.reference.split('/')[1];
    CPatient.organizationName = obj.managingOrganization.display;
}

function finalResult(str) {
    let obj = JSON.parse(str);
    if (!isError(obj.resourceType, message.signUpFail + message.contactPerson)) {
        //Add patient ID to list
        CPatient.roleName = "Patient";
        CPatient.patientID = loginData.patient.id;
        loginData.role.push(CPatient);

        $("#global-loader").hide();
        alert(loginData.schedule.name + " course have successfully added to your course list!");
        directToHomePage();
    }
}

function directToHomePage() {
    sessionSet("loginAccount", loginData, 30);
    window.open('lms-content/index.html', "_self");
}