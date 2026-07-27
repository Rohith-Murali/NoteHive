import Note from "../models/Note.js";
import Notebook from "../models/Notebook.js";
import Task from "../models/Task.js";

export const getTrashItems = async (userId) => {
  const [notes, notebooks, tasks] = await Promise.all([
    Note.find({ user: userId, isDeleted: true }).lean(),
    Notebook.find({ user: userId, isDeleted: true }).lean(),
    Task.find({ user: userId, isDeleted: true }).lean(),
  ]);
  const deletedNotebookIds = new Set(notebooks.map((nb) => nb._id.toString()));
  const notesWithParent = notes.map((note) => ({
    ...note,
    parentInTrash: deletedNotebookIds.has(note.notebook.toString()),
  }));
  const tasksWithParent = tasks.map((task) => ({
    ...task,
    parentInTrash: deletedNotebookIds.has(task.notebook.toString()),
  }));
  return {
    notes: notesWithParent,
    notebooks,
    tasks: tasksWithParent,
  };
};

export const restoreItem = async (type, id, userId) => {
  const Model = getModel(type);
  const item = await Model.findOne({
    _id: id,
    user: userId,
  });
  if (!item) throw new Error(`${type} not found`);
  if (type !== "notebook") {
    const notebook = await Notebook.findOne({
      _id: item.notebook,
      user: userId,
    });

    if (notebook?.isDeleted) {
      throw new Error("Restore the notebook first");
    }
  }
  item.isDeleted = false;
  return await item.save();
};

export const permanentDeleteItem = async (type, id, userId) => {
  const Model = getModel(type);
  const item = await Model.findOne({ _id: id, user: userId, isDeleted: true });
  if (!item) throw new Error(`${type} not found or already deleted`);
  return item;
};

// helper
function getModel(type) {
  switch (type) {
    case "note":
      return Note;
    case "notebook":
      return Notebook;
    case "task":
      return Task;
    default:
      throw new Error("Invalid type");
  }
}
