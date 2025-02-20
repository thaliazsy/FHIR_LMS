//Set FHIR Server URL and response type (json or xml)
let FHIRURLLogin= 'https://tzfhir.ml:53443/rest/login';
let FHIRURLRegister= 'https://tzfhir.ml:53443/process/register';
let FHIRURL= 'https://tzfhir.ml:53443/fhir/'; //default FHIR Server API 
let SelectCourseAPI= "https://tcumi.ml:443/api/LMSAPI/SelectCourse"; //Select course API
let FHIRResponseType= 'json';					//Requested data type returned by the server

//Define required FHIR resources
let DB={
	organization: "854", 
	schedule: "860"
};