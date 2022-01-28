//Set FHIR Server URL and response type (json or xml)
let FHIRURL= 'http://203.64.84.213:8080/fhir/'; //'http://hapi.fhir.org/baseR4/'; //'http://203.64.84.213:8080/fhir/';
let FHIRResponseType= 'json';

//Setting Course Information
let info={
	universityName: "陽明交大",
	universityDept: "",
	courseName: "醫學數位內容",
	pageName: "學習平台登入網頁",
	cpName: "施岳勳",
	cpPhone: "0955740405",
	cpEmail: "donaldonal71462@hotmail.com"
}
		
//Set course related information
let course1={
	organizationID: "Organization/1762",	//organizationID used for create new FHIR Patient
	practitionerRoleID: "PractitionerRole/1737", 
	scheduleID: "Schedule/1738",
	practitionerName: "蕭嘉宏"
};