import asyncHandler from "express-async-handler";
import * as taskService from "../services/taskService.js";
import { sendSuccess } from "../utils/response.js";
import logger from "../utils/logger.js";

export const createTask = asyncHandler(async (req, res) => {
  logger.info(
    `Creating task in notebook ${req.params.notebookId} for user ${req.user._id}`,
  );
  const task = await taskService.createTask(
    req.user._id,
    req.params.notebookId,
    req.body,
  );
  return sendSuccess(res, 201, task, "Task created successfully");
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasksByNotebook(
    req.user._id,
    req.params.notebookId,
  );
  return sendSuccess(res, 200, tasks, "Tasks fetched successfully");
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.user._id, req.params.taskId);
  return sendSuccess(res, 200, task, "Task fetched successfully");
});

export const updateTask = asyncHandler(async (req, res) => {
  const updatedTask = await taskService.updateTask(
    req.user._id,
    req.params.taskId,
    req.body,
  );
  return sendSuccess(res, 200, updatedTask, "Task updated successfully");
});

export const deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTask(req.user._id, req.params.taskId);
  return sendSuccess(res, 200, result, "Task deleted successfully");
});

export const moveToTrashTask = asyncHandler(async (req, res) => {
  const result = await taskService.moveToTrashTask(
    req.user._id,
    req.params.taskId,
  );
  return sendSuccess(res, 200, result, "Task moved to trash successfully");
});

export const toggleTask = asyncHandler(async (req, res) => {
  const updatedSubTask = await taskService.toggleTask(
    req.user._id,
    req.params.taskId,
    req.body.subTaskId,
  );
  return sendSuccess(res, 200, updatedSubTask, "Task updated successfully");
});

export const addSubtask = asyncHandler(async (req, res) => {
  const subtask = await taskService.addSubtask(
    req.user._id,
    req.params.taskId,
    req.body,
  );
  return sendSuccess(res, 201, subtask, "Subtask created successfully");
});

export const updateSubtask = asyncHandler(async (req, res) => {
  const subtask = await taskService.updateSubtask(
    req.user._id,
    req.params.taskId,
    req.params.subtaskId,
    req.body,
  );
  return sendSuccess(res, 200, subtask, "Subtask updated successfully");
});

export const deleteSubtask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteSubtask(
    req.user._id,
    req.params.taskId,
    req.params.subtaskId,
  );
  return sendSuccess(res, 200, result, "Subtask deleted successfully");
});
