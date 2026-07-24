import asyncHandler from "express-async-handler";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  updatePassword,
} from "../services/authService.js";
import { sendSuccess } from "../utils/response.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await registerUser({ name, email, password });
  return sendSuccess(res, 201, result, "User registered successfully");
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  return sendSuccess(res, 200, result, "Login successful");
});

const refresh = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const result = await refreshAccessToken(token);
  return sendSuccess(res, 200, result, "Token refreshed successfully");
});

const logout = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const result = await logoutUser(token);
  return sendSuccess(res, 200, result, "Logged out successfully");
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const result = await updatePassword(oldPassword, newPassword, req.user._id);
  return sendSuccess(res, 200, result, "Password updated successfully");
});

export { register, login, refresh, logout, changePassword };
