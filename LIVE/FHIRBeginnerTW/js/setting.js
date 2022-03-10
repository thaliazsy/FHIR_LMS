//Set FHIR Server URL and response type (json or xml)
let FHIRURL= 'https://59.126.145.136:53443/binus/fhir/';
let FHIRResponseType= 'json';
let web_language= "EN";
		
//Setting Course Information
let info={
	universityName: "",
	universityDept: "",
	courseName: "FHIR Beginner Course",
	pageName: "",
	cpName: "LIN SHU YU / Coco Lin",
	cpPhone: "+886961409380",
	cpEmail: "coco2popo520@gmail.com"
}
		
//Set course related information
let course1={
	organizationID: "Organization/17",	//organizationID used for create new FHIR Patient
	practitionerRoleID: "PractitionerRole/20", 
	scheduleID: "Schedule/21",
	scheduleCode: "100000100105",
	totalSlotSession: 1,
	courseMaterialID: "http://203.64.84.213:8080/fhir/PlanDefinition?composed-of=Schedule/21",
	practitionerName: "蕭嘉宏"
};