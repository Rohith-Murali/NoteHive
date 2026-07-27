import app from "./app.js";
import connectDB, { closeDB } from "./config/db.js";
import { validateEnv } from "./config/env.js";
import logger from "./utils/logger.js";

validateEnv();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    logger.info(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });

  const shutdown = async () => {
    logger.info("Shutting down server...");
    server.close(async () => {
      await closeDB();
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer().catch((err) => {
  logger.error(err.message);
  process.exit(1);
});
