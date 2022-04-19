//Set FHIR Server URL and response type (json or xml)
let FHIRURL= 'https://tzfhir.ml/fhir/';		//default FHIR Server API 
//let FHIRURL= 'https://59.126.145.136:53443/binus/fhir/';
let FHIRResponseType= 'json';				//Requested data type returned by the server

//Define required FHIR resources
let DB={
	organization: "170",
	schedule: "174"
};

// let course1={
	// organizationID: "Organization/17",	//organizationID used for create new FHIR Patient
	// practitionerRoleID: "PractitionerRole/20", 
	// scheduleID: "Schedule/21",
	// scheduleCode: "100000100105",
	// totalSlotSession: 1,
	// courseMaterialID: "https://tzfhir.ml/fhir/PlanDefinition?composed-of=Schedule/21",
	// practitionerName: "蕭嘉宏"
// };