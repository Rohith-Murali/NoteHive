import logger from "./logger.js";

export const sendSuccess = (
  res,
  statusCode = 200,
  data = {},
  message = "Success",
) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (
  res,
  statusCode = 500,
  message = "Something went wrong",
  details = null,
) => {
  if (statusCode >= 500) {
    logger.error(message);
  }

  const payload = { success: false, message };
  if (details) payload.details = details;

  return res.status(statusCode).json(payload);
};
