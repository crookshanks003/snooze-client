import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/auth";

export interface ChatState {
	connectedUsers: { id: string; user: User }[];
}

const initialState: ChatState = {
	connectedUsers: [],
};

export const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		setConnectedUsers: (
			state,
			action: PayloadAction<{ id: string; user: User }[]>,
		) => {
			state.connectedUsers = action.payload;
		},
		addConnectedUser: (
			state,
			action: PayloadAction<{ id: string; user: User }>,
		) => {
			state.connectedUsers.push(action.payload);
		},

		removeConnectedUser: (state, action: PayloadAction<string>) => {
			state.connectedUsers = state.connectedUsers.filter(
				(user) => user.id !== action.payload,
			);
		},
	},
});

export const { addConnectedUser, removeConnectedUser, setConnectedUsers} = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
