"use client";

import { useParams, useRouter } from "next/navigation";
import { FC, useCallback } from "react";
import GeneralInputs from "@/components/admin/collection/GeneralInputs";
import SeoInputs from "@/components/admin/collection/SeoInputs";
import useCollectionForm from "@/hooks/collection/useCollectionForm";
import { useCreateCollection } from "@/hooks/collection/useCreateCollection";
import SubmitButton from "@/components/common/SubmitButton";
import { Collection } from "@/types";



interface CreateCollectionPayload {
  domain: string;
  collectionInputs: {
    title: string;
    handle: string;
    imageId?: string;
    seo: {
      title?: string;
      description?: string;
    };
  };
}

const CreateCollection: FC = () => {
  const { domain } = useParams() as { domain: string };
  const router = useRouter();

  const { 
    image, 
    register, 
    handleSubmit, 
    handleBlur, 
    watch, 
    setImage,
    errors 
  } = useCollectionForm();

  const { createCollection, loading } = useCreateCollection(
    domain,
    (collectionId: string) => router.push(`/store/${domain}/collections/${collectionId}`)
  );


  const onSubmit = useCallback((data: Partial<Collection>) => {
    if (!data.title) {
        console.error("Title is required");
        return;
      }
    const payload: CreateCollectionPayload = {
      domain,
      collectionInputs: {
        title: data.title,
        handle: data.handle || generateHandle(data.title),
        imageId: image?.imageId,
        seo: {
          title: data.seo?.title,
          description: data.seo?.description,
        },
      },
    };

    createCollection(payload);
  }, [image, domain, createCollection]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <h1 className="h1">Add a new collection</h1>
        <div className="flex flex-col items-center my-5 gap-3">
          <GeneralInputs
            register={register}
            handleBlur={handleBlur}
            setImage={setImage}
            image={image}
          />

          <h2 className="font-bold text-orange-400 my-3">
            You need to save before adding products
          </h2>

          <SeoInputs 
            register={register} 
            domain={domain} 
            handle={watch('handle')} 
          />
        </div>
      </div>
      <SubmitButton loading={loading} />
    </form>
  );
};


const generateHandle = (title: string): string =>
  title.replace(/\s+/g, '-').toLowerCase() || '';

export default CreateCollection;
