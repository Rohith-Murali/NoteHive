import asyncHandler from "express-async-handler";
import * as noteService from "../services/noteService.js";
import { sendSuccess } from "../utils/response.js";
import logger from "../utils/logger.js";

export const createNote = asyncHandler(async (req, res) => {
  logger.info(
    `Creating note in notebook ${req.params.notebookId} for user ${req.user._id}`,
  );
  const note = await noteService.createNoteService(
    req.user._id,
    req.params.notebookId,
    req.body,
  );
  return sendSuccess(res, 201, note, "Note created successfully");
});

export const getNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.getNotesByNotebookService(
    req.user._id,
    req.params.notebookId,
  );
  return sendSuccess(res, 200, notes, "Notes fetched successfully");
});

export const getNote = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteByIdService(
    req.user._id,
    req.params.noteId,
  );
  return sendSuccess(res, 200, note, "Note fetched successfully");
});

export const updateNote = asyncHandler(async (req, res) => {
  const updatedNote = await noteService.updateNoteService(
    req.user._id,
    req.params.noteId,
    req.body,
  );
  return sendSuccess(res, 200, updatedNote, "Note updated successfully");
});

export const deleteNote = asyncHandler(async (req, res) => {
  const result = await noteService.deleteNoteService(
    req.user._id,
    req.params.noteId,
  );
  return sendSuccess(res, 200, result, "Note deleted successfully");
});

export const moveToTrashNote = asyncHandler(async (req, res) => {
  const result = await noteService.moveToTrashNoteService(
    req.user._id,
    req.params.noteId,
  );
  return sendSuccess(res, 200, result, "Note moved to trash successfully");
});
