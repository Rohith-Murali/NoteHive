import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { requestLogger } from "./utils/logger.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import notebookRoutes from "./routes/notebookRoutes.js";
import trashRoutes from "./routes/trashRoutes.js";
import userDetailsRoutes from "./routes/userDetailsRoute.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(requestLogger);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({ success: true, message: "NoteHive API is running..." });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notebook", notebookRoutes);
app.use("/api/notebook/:notebookId/notes", noteRoutes);
app.use("/api/notebook/:notebookId/tasks", taskRoutes);
app.use("/api/trash", trashRoutes);
app.use("/api/userDetails", userDetailsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
