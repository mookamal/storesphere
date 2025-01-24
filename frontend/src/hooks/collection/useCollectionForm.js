import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

// Zod schema for collection form validation
const collectionSchema = z.object({
  // Replace Yup validation with Zod
  title: z.string()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(50, { message: "Title cannot exceed 50 characters" }),
  
  handle: z.string()
    .optional()
    .refine(
      (val) => val === undefined || /^[a-z0-9-]+$/.test(val), 
      { message: "Handle must contain lowercase letters, numbers, and hyphens" }
    ),
  
  description: z.string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional(),
  
  seoTitle: z.string()
    .max(60, { message: "SEO title cannot exceed 60 characters" })
    .optional(),
  
  seoDescription: z.string()
    .max(160, { message: "SEO description cannot exceed 160 characters" })
    .optional()
});

export function useCollectionForm(initialValues = {}) {
  const [image, setImage] = useState(null);

  // Use Zod resolver instead of Yup
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: initialValues
  });

  // Existing logic for handle and SEO title generation
  const handleBlur = () => {
    const title = watch('title');
    const handle = watch('handle');
    const seoTitle = watch('seoTitle');

    if (title) {
      if (!handle) {
        setValue('handle', title.replace(/\s+/g, '-').toLowerCase());
      }
      if (!seoTitle) {
        setValue('seoTitle', title);
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
    setImage,
    watch
  };
}

export default useCollectionForm;