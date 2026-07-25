import express from "express";
import {
  getTrash,
  restore,
  permanentDelete,
} from "../controllers/trashController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { trashParamsSchema } from "../validators/trash.js";

const router = express.Router();

router.get("/", protect, getTrash);
router.put(
  "/:type/:id/restore",
  protect,
  validateRequest(trashParamsSchema, "params"),
  restore,
);
router.delete(
  "/:type/:id",
  protect,
  validateRequest(trashParamsSchema, "params"),
  permanentDelete,
);

export default router;
