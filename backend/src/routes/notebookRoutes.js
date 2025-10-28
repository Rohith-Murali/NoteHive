import express from "express";
import {
  createNotebook,
  getNotebooks,
  getNotebook,
  updateNotebook,
  deleteNotebook,
  moveToTrashNotebook,
} from "../controllers/notebookController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.route("/").get(getNotebooks).post(createNotebook);
router.route("/:notebookId").get(getNotebook).put(updateNotebook).delete(deleteNotebook);
router.put("/:notebookId/trash",moveToTrashNotebook);

export default router;
