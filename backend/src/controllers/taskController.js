import asyncHandler from "express-async-handler";
import * as taskService from "../services/taskService.js";

// Create task
export const createTask = asyncHandler(async (req, res) => {
  // if (!req.body.title) {
  //   res.status(400);
  //   throw new Error("Task title is required");
  // }
  const task = await taskService.createTaskService(req.user._id,req.params.notebookId, req.body);
  res.status(201).json(task);
});

// Get all tasks for notebook
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasksByNotebookService(req.user._id,req.params.notebookId);
  res.json(tasks);
});

// Get single task
export const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskByIdService(req.user._id,req.params.taskId);
  res.json(task);
});

// Update task
export const updateTask = asyncHandler(async (req, res) => {
  const updatedTask = await taskService.updateTaskService(req.user._id,req.params.taskId, req.body);
  res.json(updatedTask);
});

// Delete task
export const deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTaskService(req.user._id,req.params.taskId);
  res.json(result);
});

export const toggleTask = asyncHandler(async (req, res) => {
    const updatedSubTask = await taskService.toggleTaskService(req.user._id,req.params.taskId, req.body.subTaskId);
    res.json(updatedSubTask);
});