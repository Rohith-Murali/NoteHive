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
import { validateRequest } from "../middleware/validateRequest.js";
import { noteSchema, noteParamsSchema } from "../validators/note.js";

const router = express.Router({ mergeParams: true });
router.use(protect);
router.route("/").get(getNotes).post(validateRequest(noteSchema), createNote);
router
  .route("/:noteId")
  .get(validateRequest(noteParamsSchema, "params"), getNote)
  .put(
    validateRequest(noteParamsSchema, "params"),
    validateRequest(noteSchema),
    updateNote,
  )
  .delete(validateRequest(noteParamsSchema, "params"), deleteNote);
router.put("/:noteId/trash", moveToTrashNote);

export default router;
