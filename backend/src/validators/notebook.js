import { z } from "zod";

export const notebookSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

export const notebookParamsSchema = z.object({
  notebookId: z.string().regex(/^[a-fA-F0-9]{24}$/),
});
