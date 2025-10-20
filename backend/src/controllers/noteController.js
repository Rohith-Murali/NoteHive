import asyncHandler from "express-async-handler";
import * as noteService from "../services/noteService.js";

export const createNote = asyncHandler(async (req, res) => {
  const note = await noteService.createNote(req.user._id, req.body);
  res.status(201).json(note);
});

export const getNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.getNotes(req.user._id);
  res.json(notes);
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteById(req.user._id, req.params.id);
  res.json(note);
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await noteService.updateNote(req.user._id, req.params.id, req.body);
  res.json(note);
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await noteService.deleteNote(req.user._id, req.params.id);
  res.json({ message: "Note deleted", note });
});

// Add a task
export const addTask = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error("Task text is required");
  }
  const note = await noteService.addTask(req.user._id, noteId, text);
  res.status(201).json(note);
});

// Update a task
export const updateTask = asyncHandler(async (req, res) => {
  const { noteId, taskId } = req.params;
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error("Task text is required");
  }
  const note = await noteService.updateTask(req.user._id, noteId, taskId, text);
  res.json(note);
});

// Delete a task
export const deleteTask = asyncHandler(async (req, res) => {
  const { noteId, taskId } = req.params;
  const note = await noteService.deleteTask(req.user._id, noteId, taskId);
  res.json(note);
});

export const toggleTask = asyncHandler(async (req, res) => {
  const { noteId, taskId } = req.params;
  const note = await noteService.toggleTaskCompletion(req.user._id, noteId, taskId);
  res.json(note);
});