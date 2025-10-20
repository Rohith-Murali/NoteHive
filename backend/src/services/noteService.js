import Note from "../models/noteModel.js";

export const createNote = async (userId, data) => {
  const note = new Note({ ...data, user: userId });
  return await note.save();
};

export const getNotes = async (userId) => {
  return await Note.find({ user: userId }).sort({ updatedAt: -1 });
};

export const getNoteById = async (userId, id) => {
  const note = await Note.findOne({ _id: id, user: userId });
  if (!note) throw new Error("Note not found");
  return note;
};

export const updateNote = async (userId, id, data) => {
  const note = await Note.findOneAndUpdate({ _id: id, user: userId }, data, {
    new: true,
    runValidators: true,
  });
  if (!note) throw new Error("Note not found or unauthorized");
  return note;
};

export const deleteNote = async (userId, id) => {
  const note = await Note.findOneAndDelete({ _id: id, user: userId });
  if (!note) throw new Error("Note not found or unauthorized");
  return note;
};

// Add a new task to a task-list note
export const addTask = async (userId, noteId, taskText) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new Error("Note not found");
  if (note.type !== "task") throw new Error("Note is not a task list");

  note.tasks.push({ text: taskText });
  await note.save();
  return note;
};

// Update a single task's text
export const updateTask = async (userId, noteId, taskId, newText) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new Error("Note not found");
  if (note.type !== "task") throw new Error("Note is not a task list");

  const task = note.tasks.id(taskId);
  if (!task) throw new Error("Task not found");

  task.text = newText;
  await note.save();
  return note;
};

// Delete a single task
export const deleteTask = async (userId, noteId, taskId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new Error("Note not found");
  if (note.type !== "task") throw new Error("Note is not a task list");

  // Remove the task by filtering
  const initialCount = note.tasks.length;
  note.tasks = note.tasks.filter((t) => t._id.toString() !== taskId);

  if (note.tasks.length === initialCount) throw new Error("Task not found");

  await note.save();
  return note;
};

export const toggleTaskCompletion = async (userId, noteId, taskId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new Error("Note not found");
  if (note.type !== "task") throw new Error("Note is not a task list");

  const task = note.tasks.id(taskId);
  if (!task) throw new Error("Task not found");

  task.completed = !task.completed;
  await note.save();

  return note;
};
