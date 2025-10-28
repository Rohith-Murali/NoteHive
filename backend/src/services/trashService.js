import Note from "../models/Note.js";
import Notebook from "../models/Notebook.js";
import Task from "../models/Task.js";

export const getTrashItems = async (userId) => {
    const [notes, notebooks, tasks] = await Promise.all([
        Note.find({ user: userId, isDeleted: true }),
        Notebook.find({ user: userId, isDeleted: true }),
        Task.find({ user: userId, isDeleted: true }),
    ]);
    return { notes, notebooks, tasks };
};

export const restoreItem = async (type, id, userId) => {
    const Model = getModel(type);
    const item = await Model.findOne({ _id: id, user: userId });
    if (!item) throw new Error(`${type} not found`);
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
        case "note": return Note;
        case "notebook": return Notebook;
        case "task": return Task;
        default: throw new Error("Invalid type");
    }
}
