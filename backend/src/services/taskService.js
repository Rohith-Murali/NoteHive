import Task from "../models/Task.js";

export const createTaskService = async (userId, notebookId, data) => {
  return await Task.create({ ...data, user: userId, notebook: notebookId });
};

export const getTasksByNotebookService = async (userId, notebookId) => {
  return await Task.find({ user: userId, notebook: notebookId }).sort({ createdAt: -1 });
};

export const getTaskByIdService = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new Error("Task not found");
  return task;
};

export const updateTaskService = async (userId, taskId, data) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new Error("Task not found");
  task.title = data.title || task.title;
  task.completed = data.completed ?? task.completed;
  task.dueDate = data.dueDate || task.dueDate;
  return await task.save();
};

export const deleteTaskService = async (userId, taskId) => {
  const task = await Notebook.findByIdAndDelete({ _id: taskId, user: userId });
  if (!task) throw new Error("Task not found");
  return { message: "Task deleted" };
};

export const toggleTaskService = async (userId, taskId, subTaskId) => {
  const taskDoc = await Task.findById({ _id: taskId, user: userId });
  if (!taskDoc) throw new Error("Task page not found");
  const subTask = taskDoc.tasks.id(subTaskId);
  if (!subTask) throw Error("Subtask not found");
  subTask.completed = !subTask.completed;
  return await taskDoc.save();
};
