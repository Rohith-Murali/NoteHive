import asyncHandler from "express-async-handler";
import {
  getUserDetailsService,
  updateUserDetailsService,
} from "../services/userDetailsService.js";
import { sendSuccess } from "../utils/response.js";
import logger from "../utils/logger.js";

export const getUserDetails = asyncHandler(async (req, res) => {
  logger.info(`Fetching user details for ${req.user._id}`);
  const details = await getUserDetailsService(req.user._id);
  return sendSuccess(res, 200, details, "User details fetched successfully");
});

export const updateUserDetails = asyncHandler(async (req, res) => {
  const updated = await updateUserDetailsService(req.user._id, req.body);
  return sendSuccess(res, 200, updated, "User details updated successfully");
});
