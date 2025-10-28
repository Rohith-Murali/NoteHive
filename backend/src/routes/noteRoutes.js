import express from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  moveToTrashNote,
} from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });
router.use(protect);
router.route("/").get(getNotes).post(createNote);
router.route("/:noteId").get(getNote).put(updateNote).delete(deleteNote);
router.put("/:noteId/trash",moveToTrashNote);

export default router;
