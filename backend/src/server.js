import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true, 
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Example route
app.get("/", (req, res) => {
    res.send("NoteHive API is running...");
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
});