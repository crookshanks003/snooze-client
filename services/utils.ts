export function toNameCase(name?: string){
	if (!name){
		return name;
	}
	const fname = name.split(" ")[0];
	return fname.charAt(0).toUpperCase() + fname.toLowerCase().slice(1);
}

export function setToken(token: string){
	localStorage.setItem("token", token);
}

export function checkLoggedIn(){
	const token = localStorage.getItem("token");
	return !!token;
}

export function getToken(){
	return localStorage.getItem("token")!;
}
