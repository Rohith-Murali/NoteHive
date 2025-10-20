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