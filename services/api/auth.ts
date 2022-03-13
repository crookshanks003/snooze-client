import axios, { AxiosResponse } from "axios";
import { SleepStatus, User } from "../../types/auth";

const client = axios.create({baseURL:"http://localhost:5000/auth", withCredentials: true});

export function getUser(){
	return client.get<any, AxiosResponse<User>>("/profile");
}

export function getAllUsers(){
	return client.get<any, AxiosResponse<User[]>>("/all");
}

export function changeStatus(sleepStatus: SleepStatus) {
	return client.post("/status", {sleepStatus});
}
