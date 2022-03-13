export function toNameCase(name: string){
	const fname = name.split(" ")[0];
	return fname.charAt(0).toUpperCase() + fname.toLowerCase().slice(1);
}
