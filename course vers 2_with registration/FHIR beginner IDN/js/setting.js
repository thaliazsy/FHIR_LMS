//Set FHIR Server URL and response type (json or xml)
let FHIRURL= 'http://203.64.84.213:8080/fhir/'; //'http://hapi.fhir.org/baseR4/'; //'http://203.64.84.213:8080/fhir/';
let FHIRResponseType= 'json';
let web_language= "EN";
		
//Setting Course Information
let info={
	universityName: "Indonesia Taiwan",
	universityDept: "",
	courseName: "FHIR Beginner Course",
	pageName: "",
	cpName: "Victoria",
	cpPhone: "6285373330117",
	cpEmail: "victoriatjiaa@gmail.com"
}
		
//Set course related information
let course1={
	organizationID: "Organization/5591",	//organizationID used for create new FHIR Patient
	practitionerRoleID: "PractitionerRole/1737", 
	scheduleID: "Schedule/5592",
	scheduleCode: "100000100103",
	totalSlotSession: 3,
	courseMaterialID: "http://203.64.84.213:8080/fhir/PlanDefinition?composed-of=Schedule/1738",
	practitionerName: "蕭嘉宏"
};