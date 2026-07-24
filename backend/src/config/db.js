import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB Connected");
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  if (mongoose.connection.readyState !== 1) return;
  await mongoose.connection.close();
};

export default connectDB;
