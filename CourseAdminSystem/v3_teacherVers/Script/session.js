// get from session (if the value expired it is destroyed)
function sessionGet(key) {
	let stringValue = window.sessionStorage.getItem(key)
    if (stringValue != null) {
		let value = JSON.parse(stringValue);
        let expirationDate = new Date(value.expirationDate);
        if (expirationDate > new Date()) {
			return value;
        } 
		else {
			window.sessionStorage.removeItem(key);
        }
    }
    return null;
}

// add into session
function sessionSet(key, pid, pname, pusername, ppatientID, expirationInMin = 15) {
	let expirationDate = new Date(new Date().getTime() + (60000 * expirationInMin))
	let newValue = {
		expirationDate: expirationDate.toISOString(),
		userLogin: {
			id: pid,
			name: pname,
			username: pusername
		},
		patientID: {}
	}
	let index=0;
	ppatientID.forEach(element => {
		newValue.patientID['id' + index] =  element;
		index++;
	});
	window.sessionStorage.setItem(key, JSON.stringify(newValue))
}