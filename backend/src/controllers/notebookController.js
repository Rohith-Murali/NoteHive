import asyncHandler from "express-async-handler";
import * as notebookService from "../services/notebookService.js";

export const createNotebook = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Notebook title is required");
  }
  const notebook = await notebookService.createNotebookService(req.user._id, req.body);
  res.status(201).json(notebook);
});

export const getNotebooks = asyncHandler(async (req, res) => {
  const notebooks = await notebookService.getAllNotebooksService(req.user._id);
  res.json(notebooks);
});

export const getNotebook = asyncHandler(async (req, res) => {
  const notebook = await notebookService.getNotebookByIdService(req.user._id, req.params.notebookId);
  res.json(notebook);
});

export const updateNotebook = asyncHandler(async (req, res) => {
  const updatedNotebook = await notebookService.updateNotebookService(
    req.user._id,
    req.params.notebookId,
    req.body
  );
  res.json(updatedNotebook);
});

export const deleteNotebook = asyncHandler(async (req, res) => {
  const result = await notebookService.deleteNotebookService(req.user._id, req.params.notebookId);
  res.json(result);
});

export const moveToTrashNotebook = asyncHandler(async (req, res) => {
  const result = await notebookService.moveToTrashNotebookService(req.user._id, req.params.notebookId);
  res.json(result);
});
