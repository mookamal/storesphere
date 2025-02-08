import { z } from "zod";

export const seoSchema = z.object({
  title: z
    .string()
    .max(60, { message: "SEO title cannot exceed 60 characters" })
    .optional(),
  description: z
    .string()
    .max(160, { message: "SEO description cannot exceed 160 characters" })
    .optional(),
});
