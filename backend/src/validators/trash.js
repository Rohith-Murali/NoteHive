import { z } from "zod";

export const trashParamsSchema = z.object({
  type: z.enum(["note", "notebook", "task"]),
  id: z.string().regex(/^[a-fA-F0-9]{24}$/),
});
