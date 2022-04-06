import axios, { AxiosResponse } from "axios";
import { MealTime, SleepStatus, User } from "../../types/auth";

const client = axios.create({baseURL:`${process.env.NEXT_PUBLIC_API_URL}/auth`, withCredentials: true});

export function getUser(){
	return client.get<any, AxiosResponse<User>>("/profile");
}

export function getAllUsers(){
	return client.get<any, AxiosResponse<User[]>>("/all");
}

export function changeStatus(sleepStatus: SleepStatus) {
	return client.post("/sleep-status", {sleepStatus});
}

export function changeMealTime(mealTime: MealTime[]) {
	return client.post("/meal-time", {mealTime});
}
