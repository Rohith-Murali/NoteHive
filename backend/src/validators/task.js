import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(2).max(200),
  completed: z.boolean().optional(),
  dueDate: z.coerce.date().optional(),
});

export const subtaskSchema = z.object({
  completed: z.boolean().optional(),
});

export const toggleTaskSchema = z.object({
  subTaskId: z.string().regex(/^[a-fA-F0-9]{24}$/),
});

export const taskParamsSchema = z.object({
  notebookId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  taskId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  subtaskId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/)
    .optional(),
});
