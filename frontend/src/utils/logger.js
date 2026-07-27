const isProd = process.env.NODE_ENV === "production";

export const logger = {
  info: (...args) => {
    if (!isProd) console.info(...args);
  },
  warn: (...args) => {
    if (!isProd) console.warn(...args);
  },
  error: (...args) => {
    console.error(...args);
  },
};

export const logApiError = (error, context = "API") => {
  const message =
    error?.response?.data?.message || error?.message || "Unknown error";
  logger.error(`[${context}]`, message, error);
};
