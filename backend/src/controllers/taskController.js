import asyncHandler from "express-async-handler";
import * as taskService from "../services/taskService.js";

// Create task
export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user._id,req.params.notebookId, req.body);
  res.status(201).json(task);
});

// Get all tasks for notebook
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasksByNotebook(req.user._id,req.params.notebookId);
  res.json(tasks);
});

// Get single task
export const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.user._id,req.params.taskId);
  res.json(task);
});

// Update task
export const updateTask = asyncHandler(async (req, res) => {
  const updatedTask = await taskService.updateTask(req.user._id,req.params.taskId, req.body);
  res.json(updatedTask);
});

// Delete task
export const deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTask(req.user._id,req.params.taskId);
  res.json(result);
});

export const toggleTask = asyncHandler(async (req, res) => {
    const updatedSubTask = await taskService.toggleTask(req.user._id,req.params.taskId, req.body.subTaskId);
    res.json(updatedSubTask);
});

// Add a subtask
export const addSubtask = asyncHandler(async (req, res) => {
  const subtask = await taskService.addSubtask(req.user._id, req.params.taskId, req.body);
  res.status(201).json(subtask);
});

// Update a subtask
export const updateSubtask = asyncHandler(async (req, res) => {
  const subtask = await taskService.updateSubtask(req.user._id,req.params.taskId,req.params.subtaskId,req.body);
  res.json(subtask);
});

// Delete a subtask
export const deleteSubtask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteSubtask(req.user._id,req.params.taskId,req.params.subtaskId
  );
  res.json(result);
});
