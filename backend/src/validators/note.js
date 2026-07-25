import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().min(2).max(200),
  content: z.string().max(10000).optional(),
});

export const noteParamsSchema = z.object({
  notebookId: z.string().regex(/^[a-fA-F0-9]{24}$/),
  noteId: z.string().regex(/^[a-fA-F0-9]{24}$/),
});
