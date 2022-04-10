//Set FHIR Server URL and response type (json or xml)
let FHIRURL= 'https://203.64.84.213:52883/binus/fhir/'; //'http://hapi.fhir.org/baseR4/'; //'http://203.64.84.213:8080/fhir/';
let FHIRResponseType= 'json';
let web_language= "EN";
		
//Setting Course Information
let info={
	universityName: "Testing",
	universityDept: "",
	courseName: "Testing Course",
	pageName: "",
	cpName: "Victoria",
	cpPhone: "0812345678",
	cpEmail: "victoriatjiaa@gmail.com"
}
		
//Set course related information
let course1={
	organizationID: "Organization/12",	//organizationID used for create new FHIR Patient
	practitionerRoleID: "PractitionerRole/14", 
	scheduleID: "Schedule/16",
	scheduleCode: "100000100105",
	totalSlotSession: 1,
	courseMaterialID: "http://203.64.84.213:8080/fhir/PlanDefinition?composed-of=Schedule/16",
	practitionerName: "蕭嘉宏"
};