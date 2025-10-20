import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.route("/")
  .get(protect, getNotes)
  .post(protect, createNote);

router.route("/:id")
  .get(protect, getNoteById)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

export default router;
