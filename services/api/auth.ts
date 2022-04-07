import axios, { AxiosResponse } from "axios";
import { MealTime, SleepStatus, User } from "../../types/auth";
import { getToken } from "../utils";

const client = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
	withCredentials: true,
});

export function getUser() {
	return client.get<any, AxiosResponse<User>>("/profile", {
		headers: { jwt: getToken() },
	});
}

export function getAllUsers() {
	return client.get<any, AxiosResponse<User[]>>("/all", {
		headers: { jwt: getToken() },
	});
}

export function changeStatus(sleepStatus: SleepStatus) {
	return client.post(
		"/sleep-status",
		{ sleepStatus },
		{ headers: { jwt: getToken() } },
	);
}

export function changeMealTime(mealTime: MealTime[]) {
	return client.post(
		"/meal-time",
		{ mealTime },
		{ headers: { jwt: getToken() } },
	);
}

export function changeRoomNumber(num: number) {
	return client.post(
		"/room",
		{ roomNumber: num },
		{ headers: { jwt: getToken() } },
	);
}
