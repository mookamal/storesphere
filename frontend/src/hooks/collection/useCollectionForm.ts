import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "@/types"
import { seoSchema } from "@/schemas";
const collectionSchema = z.object({
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
  image: z.union([z.object({
    imageId: z.string().optional(),
    url: z.string().optional(),
  }).optional(), z.null()]),
});


type InitialValuesType = Partial<z.infer<typeof collectionSchema>>;

export function useCollectionForm(initialValues: InitialValuesType = {}) {


  const handleSetImage = (newImage: Image | null) => {
    setValue("image", newImage, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };


  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isDirty, dirtyFields },
    reset,
  } = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: initialValues,
  });


  const image = watch("image");

  const handleBlur = () => {
    const title = watch("title");
    const handle = watch("handle");
    const seoTitle = watch("seo.title");

    if (title) {
      if (!handle) {
        setValue("handle", title.replace(/\s+/g, "-").toLowerCase());
      }
      if (!seoTitle) {
        setValue("seo.title", title);
      }
    }
  };


  return {
    image,
    register,
    handleSubmit,
    errors,
    handleBlur,
    setValue,
    handleSetImage,
    watch,
    reset,
    control,
    formState: { isDirty, dirtyFields },
  };
}

export default useCollectionForm;