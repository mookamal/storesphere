import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Collection, Image } from "@/types"
import { collectionSchema } from "@/schemas";


type InitialValuesType = Partial<Collection>;

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


  const image = watch("image") ?? null;
  const title = watch("title");
  const handle: string = watch("handle") ?? "";
  const seoTitle = watch("seo.title");

  const handleBlur = () => {
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
    setImage: handleSetImage,
    watch,
    reset,
    control,
    handle,
    formState: { isDirty, dirtyFields },
  };
}

export default useCollectionForm;