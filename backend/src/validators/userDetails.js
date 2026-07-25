import { z } from "zod";

export const userDetailsSchema = z.object({
  name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().or(z.literal("")).optional(),
  themePreference: z.enum(["light", "dark", "system"]).optional(),
  fontSizePreference: z.number().int().min(12).max(24).optional(),
});
