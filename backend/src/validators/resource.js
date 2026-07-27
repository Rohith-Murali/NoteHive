import Joi from "joi";

export const notebookSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
});

export const noteSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  content: Joi.string().max(10000).optional(),
});

export const taskSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  completed: Joi.boolean().optional(),
  dueDate: Joi.date().optional(),
});

export const subtaskSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  completed: Joi.boolean().optional(),
});

export const toggleTaskSchema = Joi.object({
  subTaskId: Joi.string().required(),
});

export const userDetailsSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  bio: Joi.string().max(500).optional(),
  avatar: Joi.string().uri().allow("").optional(),
  themePreference: Joi.string().valid("light", "dark", "system").optional(),
  fontSizePreference: Joi.number().integer().min(12).max(24).optional(),
});

export const trashParamsSchema = Joi.object({
  type: Joi.string().valid("note", "notebook", "task").required(),
  id: Joi.string().required(),
});
