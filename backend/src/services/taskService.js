import Task from "../models/Task.js";

export const createTask = async (userId, notebookId, data) => {
  return await Task.create({ ...data, user: userId, notebook: notebookId });
};

export const getTasksByNotebook = async (userId, notebookId) => {
  return await Task.find({ user: userId, notebook: notebookId, isDeleted: false }).sort({ createdAt: -1 });
};

export const getTaskById = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new Error("Task not found");
  return task;
};

export const updateTask = async (userId, taskId, data) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new Error("Task not found");
  task.title = data.title || task.title;
  task.completed = data.completed ?? task.completed;
  task.dueDate = data.dueDate || task.dueDate;
  return await task.save();
};

export const deleteTask = async (userId, taskId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
  if (!task) throw new Error("Task not found");
  return { message: "Task deleted" };
};

export const moveToTrashTask = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new Error("Task not found");
  task.isDeleted = !task.isDeleted;
  await task.save();
  return ({ message: "Moved to Bin" });
};

export const toggleTask = async (userId, taskId, subTaskId) => {
  // Use findOne when using filter object
  const taskDoc = await Task.findOne({ _id: taskId, user: userId });
  if (!taskDoc) throw new Error("Task not found");

  // Support both Mongoose subdocuments (with .id) and plain objects
  let subTask = typeof taskDoc.tasks.id === 'function'
    ? taskDoc.tasks.id(subTaskId)
    : taskDoc.tasks.find((t) => t._id && t._id.toString() === subTaskId.toString());

  if (!subTask) throw new Error("Subtask not found");

  subTask.completed = !subTask.completed;
  return await taskDoc.save();
};

// Add a subtask
export const addSubtask = async (userId, taskId, data) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new Error("Task not found");
  task.tasks.push({ title: data.title, completed: false });
  return await task.save();
};

// Update a subtask
export const updateSubtask = async (userId, taskId, subtaskId, data) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new Error("Task not found");
  const subtask = task.tasks.id(subtaskId);
  if (!subtask) throw new Error("Subtask not found");
  subtask.title = data.title ?? subtask.title;
  subtask.completed = data.completed ?? subtask.completed;
  return await task.save();
};

// Delete a subtask
export const deleteSubtask = async (userId, taskId, subtaskId) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new Error("Task not found");
  const subtask = typeof task.tasks.id === 'function'
    ? task.tasks.id(subtaskId)
    : task.tasks.find((t) => t._id && t._id.toString() === subtaskId.toString());

  if (!subtask) throw new Error("Subtask not found");
  task.tasks = task.tasks.filter((t) => !(t._id && t._id.toString() === subtaskId.toString()));
  await task.save();

  return { message: "Subtask deleted" };
};
