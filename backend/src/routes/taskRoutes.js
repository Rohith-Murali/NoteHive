import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });
router.use(protect);
router.route("/").get(getTasks).post(createTask);
router.route("/:taskId").get(getTask).put(updateTask).delete(deleteTask);
router.put("/:taskId/toggle", toggleTask);

export default router;
