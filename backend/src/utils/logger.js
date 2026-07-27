import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `[${timestamp}] ${level}: ${message}\n${stack}`
        : `[${timestamp}] ${level}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

export const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};

export default logger;
