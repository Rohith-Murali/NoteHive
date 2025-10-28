import express from "express";
import { getTrash, restore, permanentDelete } from "../controllers/trashController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTrash);
router.put("/:type/:id/restore", protect, restore);
router.delete("/:type/:id", protect, permanentDelete);

export default router;
