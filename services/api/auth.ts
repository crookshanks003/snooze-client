import axios, { AxiosResponse } from "axios";
import { User } from "../../types/auth";

const client = axios.create({baseURL:"http://localhost:5000/auth/", withCredentials: true});

export function getUser(){
	return client.get<any, AxiosResponse<User>>("/profile");
}
