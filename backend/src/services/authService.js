import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserDetails from "../models/UserDetails.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import logger from "../utils/logger.js";

let refreshTokens = [];

const registerUser = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    logger.warn(`Registration failed: email already exists - ${email}`);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });
  if (!user) throw new Error("Invalid user data");

  await UserDetails.create({
    user: user._id,
    name,
    joinedAt: new Date(),
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  refreshTokens.push(refreshToken);

  logger.info(`User registered: ${user._id}`);
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    accessToken,
    refreshToken,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    logger.warn(`Login failed for email: ${email}`);
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  refreshTokens.push(refreshToken);
  await UserDetails.findOneAndUpdate(
    { user: user._id },
    { lastLogin: new Date() },
  );

  logger.info(`User logged in: ${user._id}`);
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (token) => {
  if (!token) throw new Error("No token provided");
  if (!refreshTokens.includes(token)) throw new Error("Invalid refresh token");

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  logger.info(`Token refreshed for user: ${decoded.id}`);
  return { accessToken: generateAccessToken(decoded.id) };
};

const logoutUser = async (token) => {
  refreshTokens = refreshTokens.filter((t) => t !== token);
  logger.info("User logged out");
  return { message: "Logged out successfully" };
};

const updatePassword = async (oldPassword, newPassword, userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) throw new Error("Incorrect current password");

  user.password = newPassword;
  await user.save();

  await UserDetails.findOneAndUpdate(
    { user: user._id },
    { passwordLastChanged: new Date() },
  );

  logger.info(`Password updated for user: ${userId}`);
  return { message: "Password updated successfully" };
};

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  updatePassword,
};
