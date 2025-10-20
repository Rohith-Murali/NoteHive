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
