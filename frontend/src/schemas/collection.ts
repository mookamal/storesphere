import { z } from "zod";
import { seoSchema } from "@/schemas";

export const collectionSchema = z.object({
    title: z
      .string()
      .min(2, { message: "Title must be at least 2 characters" })
      .max(50, { message: "Title cannot exceed 50 characters" }),
  
    handle: z
      .string()
      .optional()
      .refine((val) => val === undefined || /^[a-z0-9-]+$/.test(val), {
        message: "Handle must contain lowercase letters, numbers, and hyphens",
      }),
  
    description: z
      .string()
      .max(500, { message: "Description cannot exceed 500 characters" })
      .optional(),
  
    seo: seoSchema,
    

    imageId: z.union([
      z.number().optional(), 
      z.string().optional(), 
      z.null()
    ]),
    
    image: z.union([z.object({
      imageId: z.union([z.number(), z.string()]).optional(),
      url: z.string().optional(),
    }).optional(), z.null()]),
});