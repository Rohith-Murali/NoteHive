import asyncHandler from "express-async-handler";
import * as notebookService from "../services/notebookService.js";
import { sendSuccess } from "../utils/response.js";
import logger from "../utils/logger.js";

export const createNotebook = asyncHandler(async (req, res) => {
  logger.info(`Creating notebook for user ${req.user._id}`);
  const notebook = await notebookService.createNotebookService(
    req.user._id,
    req.body,
  );
  return sendSuccess(res, 201, notebook, "Notebook created successfully");
});

export const getNotebooks = asyncHandler(async (req, res) => {
  const notebooks = await notebookService.getAllNotebooksService(req.user._id);
  return sendSuccess(res, 200, notebooks, "Notebooks fetched successfully");
});

export const getNotebook = asyncHandler(async (req, res) => {
  const notebook = await notebookService.getNotebookByIdService(
    req.user._id,
    req.params.notebookId,
  );
  return sendSuccess(res, 200, notebook, "Notebook fetched successfully");
});

export const updateNotebook = asyncHandler(async (req, res) => {
  const updatedNotebook = await notebookService.updateNotebookService(
    req.user._id,
    req.params.notebookId,
    req.body,
  );
  return sendSuccess(
    res,
    200,
    updatedNotebook,
    "Notebook updated successfully",
  );
});

export const deleteNotebook = asyncHandler(async (req, res) => {
  const result = await notebookService.deleteNotebookService(
    req.user._id,
    req.params.notebookId,
  );
  return sendSuccess(res, 200, result, "Notebook deleted successfully");
});

export const moveToTrashNotebook = asyncHandler(async (req, res) => {
  const result = await notebookService.moveToTrashNotebookService(
    req.user._id,
    req.params.notebookId,
  );
  return sendSuccess(res, 200, result, "Notebook moved to trash successfully");
});
