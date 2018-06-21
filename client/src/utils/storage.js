export function getFromStorage(key) {
	if (!key) {
		return null;
	}

	try {
		const valueStr= localStorage.getItem(key);
		if (valueStr) {
			return JSON.parse(valueStr);
		}
		return null;

	}catch(error){
		return null;
	}
}

export function removeFromStorage(key) {
	localStorage.removeItem(key);
}

export function setInStorage(key, obj) {
	if (!key) {
		console.log("error: key is missing");
	}

	try {
		localStorage.setItem(key, JSON.stringify(obj))
	}catch (error) {
		console.log(error);
	}
}