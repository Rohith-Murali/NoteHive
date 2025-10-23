import asyncHandler from "express-async-handler";
import * as noteService from "../services/noteService.js";

// Create note
export const createNote = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Note title is required");
  }
  const note = await noteService.createNoteService(req.user._id,req.params.notebookId, req.body);
  res.status(201).json(note);
});

// Get all notes for notebook
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.getNotesByNotebookService(req.user._id,req.params.notebookId);
  res.json(notes);
});

// Get single note
export const getNote = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteByIdService(req.user._id,req.params.noteId);
  res.json(note);
});

// Update note
export const updateNote = asyncHandler(async (req, res) => {
  const updatedNote = await noteService.updateNoteService(req.user._id,req.params.noteId, req.body);
  res.json(updatedNote);
});

// Delete note
export const deleteNote = asyncHandler(async (req, res) => {
  const result = await noteService.deleteNoteService(req.user._id,req.params.noteId);
  res.json(result);
});
