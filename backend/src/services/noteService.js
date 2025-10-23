import Note from "../models/Note.js";

export const createNoteService = async (userId, notebookId, data) => {
  return await Note.create({ ...data, user: userId, notebook: notebookId });
};

export const getNotesByNotebookService = async (userId, notebookId) => {
  return await Note.find({ user: userId, notebook: notebookId }).sort({ createdAt: -1 });
};

export const getNoteByIdService = async (userId, noteId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new Error("Note not found");
  return note;
};

export const updateNoteService = async (userId, noteId, data) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new Error("Note not found");
  note.title = data.title || note.title;
  note.content = data.content || note.content;
  return await note.save();
};

export const deleteNoteService = async (userId, noteId) => {
  const note = await Notebook.findByIdAndDelete({ _id: noteId, user: userId });
  if (!note) throw new Error("Note not found");
  return { message: "Note deleted" };
};


export const toggleTaskCompletion = async (userId, taskId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new Error("Note not found");
  if (note.type !== "task") throw new Error("Note is not a task list");

  const task = note.tasks.id(taskId);
  if (!task) throw new Error("Task not found");

  task.completed = !task.completed;
  await note.save();

  return note;
};