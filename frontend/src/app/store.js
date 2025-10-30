import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import settingsReducer from "../redux/slices/settingsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
    },
});
