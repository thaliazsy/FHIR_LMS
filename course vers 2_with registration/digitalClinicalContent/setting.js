//Set FHIR Server URL and response type (json or xml)
let FHIRURL= 'http://203.64.84.213:8080/fhir/'; //'http://hapi.fhir.org/baseR4/'; //'http://203.64.84.213:8080/fhir/';
let FHIRResponseType= 'json';

//Setting Course Information
let info={
	universityName: "慈濟大學",
	universityDept: "醫資",
	courseName: "醫學數位內容",
	pageName: "",
	cpName: "龍昱璇學姊",
	cpPhone: "0965006102",
	cpEmail: "108316107@gms.tcu.edu.tw"
}
		
//Set course related information
let course1={
	organizationID: "Organization/2220",	//organizationID used for create new FHIR Patient
	practitionerRoleID: "PractitionerRole/1737", 
	scheduleID: "Schedule/1738",
	practitionerName: "蕭嘉宏"
};