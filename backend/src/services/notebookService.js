import Notebook from "../models/Notebook.js";

export const createNotebookService = async (userId, data) => {
  return await Notebook.create({ ...data, user: userId });
};

export const getAllNotebooksService = async (userId) => {
  return await Notebook.find({ user: userId }).sort({ createdAt: -1 });
};

export const getNotebookByIdService = async (userId, notebookId) => {
  const notebook = await Notebook.findOne({ _id: notebookId, user: userId });
  if (!notebook) throw new Error("Notebook not found");
  return notebook;
};

// Update and Delete same pattern: filter by user
export const updateNotebookService = async (userId, notebookId, data) => {
  const notebook = await Notebook.findOne({ _id: notebookId, user: userId });
  if (!notebook) throw new Error("Notebook not found");
  notebook.title = data.title || notebook.title;
  notebook.description = data.description || notebook.description;
  return await notebook.save();
};

export const deleteNotebookService = async (userId, notebookId) => {
  const notebook = await Notebook.findOne({ _id: notebookId, user: userId });
  if (!notebook) throw new Error("Notebook not found");
  await notebook.remove();
  return { message: "Notebook deleted" };
};
