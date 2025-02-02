"use client";
import { useParams, useRouter } from "next/navigation";
import { useCallback } from 'react';
import GeneralInputs from "@/components/admin/collection/GeneralInputs";
import SeoInputs from "@/components/admin/collection/SeoInputs";
import useCollectionForm from "@/hooks/collection/useCollectionForm";
import { useCreateCollection } from "@/hooks/collection/useCreateCollection";
import SubmitButton from "@/components/common/SubmitButton";
export default function CreateCollection() {
  const domain = useParams().domain;
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
    (collectionId) => router.push(`/admin/store/${domain}/collections/${collectionId}`)
  );

  const onSubmit = useCallback((data) => {
    const payload = {
      domain,
      collectionInputs: {
        title: data.title,
        handle: data.handle || generateHandle(data.title),
        imageId: image?.imageId,
        seo: {
          title: data.seoTitle,
          description: data.seoDescription
        }
      }
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
            errors={errors}
          />

          <h2 className="font-bold text-orange-400 my-3">
            You need to save before adding products
          </h2>

          <SeoInputs 
            register={register} 
            domain={domain} 
            handle={watch('handle')} 
            errors={errors}
          />
        </div>
      </div>
      <SubmitButton loading={loading} />
    </form>
  );
}

const generateHandle = (title) => 
  title?.replace(/\s+/g, '-').toLowerCase() || '';