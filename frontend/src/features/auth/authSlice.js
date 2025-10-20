import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { toast } from "react-toastify";
import { removeTokens } from "../../utils/token";

const initialState = {
    user: null,
    loading: false,
    error: null,
};

// Register thunk
export const register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
    try {
        return await authService.register(data);
    } catch (error) {
        const message = error.response?.data?.message || "Registration failed";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
});

// Login thunk
export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
    try {
        return await authService.login(data);
    } catch (error) {
        const message = error.response?.data?.message || "Login failed";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            removeTokens();
            toast.info("Logged out");
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                toast.success("Registration successful 🎉");
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                toast.success("Login successful 🎉");
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
