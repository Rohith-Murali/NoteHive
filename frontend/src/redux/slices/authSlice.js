import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../features/auth/authService"
import { removeTokens } from "../../utils/token";

let userFromStorage = null;
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    if (parsed && typeof parsed === "object") {
      userFromStorage = parsed;
    } else {
      localStorage.removeItem("user");
    }
  }
} catch (error) {
  console.error("Error parsing user from localStorage:", error);
  localStorage.removeItem("user");
}

const initialState = {
  user: userFromStorage,
  loading: false,
  error: null,
};

// 🔹 Register thunk
export const register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const response = await authService.register(data);
    if (response?.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed";
    return thunkAPI.rejectWithValue(message);
  }
});

// 🔹 Login thunk
export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const response = await authService.login(data);
    if (response?.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    console.log(response)
    return response;
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    return thunkAPI.rejectWithValue(message);
  }
});

// 🔹 Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      removeTokens();
      localStorage.removeItem("user");
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
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
