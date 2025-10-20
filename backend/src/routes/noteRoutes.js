import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  addTask, updateTask, deleteTask,toggleTask
} from "../controllers/noteController.js";

const router = express.Router();

router.route("/")
  .get(protect, getNotes)
  .post(protect, createNote);

router.route("/:id")
  .get(protect, getNoteById)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

router.post("/:noteId/tasks", protect, addTask);
router.put("/:noteId/tasks/:taskId", protect, updateTask);
router.delete("/:noteId/tasks/:taskId", protect, deleteTask);
router.patch("/:noteId/tasks/:taskId/toggle", protect, toggleTask);


export default router;
