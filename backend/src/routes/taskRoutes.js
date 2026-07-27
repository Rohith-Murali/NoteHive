import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  toggleTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  moveToTrashTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  taskSchema,
  subtaskSchema,
  toggleTaskSchema,
  taskParamsSchema,
} from "../validators/task.js";

const router = express.Router({ mergeParams: true });
router.use(protect);
router.route("/").get(getTasks).post(validateRequest(taskSchema), createTask);
router
  .route("/:taskId")
  .get(validateRequest(taskParamsSchema, "params"), getTask)
  .put(
    validateRequest(taskParamsSchema, "params"),
    validateRequest(taskSchema),
    updateTask,
  )
  .delete(validateRequest(taskParamsSchema, "params"), deleteTask);
router.put(
  "/:taskId/trash",
  validateRequest(taskParamsSchema, "params"),
  moveToTrashTask,
);
router.put(
  "/:taskId/toggle",
  validateRequest(taskParamsSchema, "params"),
  validateRequest(toggleTaskSchema, "body"),
  toggleTask,
);
router.post(
  "/:taskId/subtask",
  validateRequest(taskParamsSchema, "params"),
  validateRequest(subtaskSchema),
  addSubtask,
);
router.put(
  "/:taskId/subtask/:subtaskId",
  validateRequest(taskParamsSchema, "params"),
  validateRequest(subtaskSchema),
  updateSubtask,
);
router.delete(
  "/:taskId/subtask/:subtaskId",
  validateRequest(taskParamsSchema, "params"),
  deleteSubtask,
);

export default router;
