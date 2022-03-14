import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import { getUser } from "../services/api/auth";
import { User } from "../types/auth";

interface AuthState {
	isLoggedIn: boolean;
	loading: boolean;
	user?: User;
	error?: string;
}

const initialState: AuthState = {
	isLoggedIn: false,
	loading: false,
};

export const fetchUser = createAsyncThunk<AuthState>(
	"auth/fetchUser",
	async () => {
		try {
			const { data } = await getUser();
			return { isLoggedIn: true, user: data, loading: false};
		} catch (e: any) {
			return { isLoggedIn: false, error: e.response.data.message, loading: false };
		}
	},
);

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setLoggedIn: (state, action: PayloadAction<boolean>) => {
			state.isLoggedIn = action.payload;
		},
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUser.fulfilled, (state, action) => {
			state.loading = false;
			state.isLoggedIn = action.payload.isLoggedIn;
			state.user = action.payload.user;
			state.error = action.payload.error;
		});
		builder.addCase(fetchUser.rejected, (state, _action) => {
			state.loading = false;
			state.isLoggedIn = false;
			state.error = "Something went wong";
		});
		builder.addCase(fetchUser.pending, (state, _action) => {
			state.loading = true;
		})
	},
});

export const { setLoggedIn, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
