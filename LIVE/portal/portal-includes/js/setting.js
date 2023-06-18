//Set FHIR Server URL and response type (json or xml)

//let FHIRURLLogin= 'http://203.64.84.33:33484/api/login';
//let JWTAPIURL= 'http://203.64.84.33:33484/api/jwt';

//let apiRoot = "https://localhost:44327/";	// Development
let apiRoot = "'http://203.64.84.33:33484/";	// Release

let FHIRURLLogin = apiRoot+ 'api/login';
let JWTAPIURL = apiRoot + 'api/jwt';
let MiniAppsURL = apiRoot + 'api/role/mini-apps';
let FHIRURLRegister = apiRoot + 'api/register';
let SelectCourseAPI = apiRoot + "api/select-course"; //Select course API

let FHIRURL = 'https://203.64.84.150:58443/r5/fhir/'; //default FHIR Server API
let SkinLesionReportViewer = 'http://203.64.84.32:9876/viewer';

let FHIRResponseType = 'json';					//Requested data type returned by the server

// let FHIRURLLogin= 'https://tzfhir.ml:53443/rest/login';
// let FHIRURLRegister= 'https://tzfhir.ml:53443/process/register';
// let FHIRURL= 'https://tzfhir.ml:53443/fhir/'; //default FHIR Server API 
// let SelectCourseAPI= "https://tcumi.ml:443/api/LMSAPI/SelectCourse"; //Select course API
// let FHIRResponseType= 'json';					//Requested data type returned by the server

//Define required FHIR resources
let DB = {
	organization: "4533",
	schedule: "4534"
};