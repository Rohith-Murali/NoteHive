import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import logger from "../utils/logger.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("User not found, token invalid");
    }

    next();
  } catch (error) {
    logger.warn(`Auth failed: ${error.message}`);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});
