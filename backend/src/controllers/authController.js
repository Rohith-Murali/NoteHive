import asyncHandler from "express-async-handler";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  updatePassword
} from "../services/authService.js";

// Register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await registerUser({ name, email, password });
  res.status(201).json(result);
});

// Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  res.json(result);
});

// Refresh token
const refresh = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const result = await refreshAccessToken(token);
  res.json(result);
});

// Logout
const logout = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const result = await logoutUser(token);
  res.json(result);
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const result = await updatePassword(oldPassword, newPassword, req.user._id);
  res.json({ message: "Password updated successfully" });
});

export { register, login, refresh, logout, changePassword };
