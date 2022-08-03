//Set FHIR Server URL and response type (json or xml)
let FHIRURL= 'https://tzfhir1.ml/fhirvh/fhir/'; 		//LIVE Server: 'https://tzfhir1.ml/fhirvh/fhir/'; //TEST Server: 'https://tzfhir.ml/fhir/';		//default FHIR Server API 
let FHIRResponseType= 'json';					//Requested data type returned by the server

//Define required FHIR resources
let DB={
	organization: "170", 
	schedule: "1458"
};