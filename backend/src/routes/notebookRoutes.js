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
import { validateRequest } from "../middleware/validateRequest.js";
import {
  notebookSchema,
  notebookParamsSchema,
} from "../validators/notebook.js";

const router = express.Router();
router.use(protect);
router
  .route("/")
  .get(getNotebooks)
  .post(validateRequest(notebookSchema), createNotebook);
router
  .route("/:notebookId")
  .get(validateRequest(notebookParamsSchema, "params"), getNotebook)
  .put(
    validateRequest(notebookParamsSchema, "params"),
    validateRequest(notebookSchema),
    updateNotebook,
  )
  .delete(validateRequest(notebookParamsSchema, "params"), deleteNotebook);
router.put("/:notebookId/trash", moveToTrashNotebook);

export default router;
