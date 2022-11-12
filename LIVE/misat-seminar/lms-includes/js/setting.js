//Set FHIR Server URL and response type (json or xml)
let FHIRURL= 'https://tzfhir.ml:53443/fhir/'; //default FHIR Server API 
let FHIRResponseType= 'json';					//Requested data type returned by the server

//Define required FHIR resources
let DB={
	organization: "854", 
	schedule: "860"
};