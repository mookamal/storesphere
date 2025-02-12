"use client";

import { useParams, useRouter } from "next/navigation";
import { FC, useCallback } from "react";
import GeneralInputs from "@/components/admin/collection/GeneralInputs";
import SeoInputs from "@/components/admin/collection/SeoInputs";
import useCollectionForm from "@/hooks/collection/useCollectionForm";
import SubmitButton from "@/components/common/SubmitButton";
import { Collection } from "@/types";
import { useMutation } from '@apollo/client';
import { ADMIN_CREATE_COLLECTION } from '@/graphql/mutations';
import { toast } from 'react-toastify';

interface CreateCollectionPayload {
  domain: string;
  collectionInputs: {
    title: string;
    description?: string;
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

  const [createCollection, { loading }] = useMutation(ADMIN_CREATE_COLLECTION, {
    onCompleted: (data) => {
      toast.success('Collection created successfully');
      router.push(`/store/${domain}/collections/${data.createCollection.collection.collectionId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { 
    image, 
    register, 
    handleSubmit, 
    handleBlur, 
    watch, 
    setImage,
    errors,
    handle,
  } = useCollectionForm();

  const generateHandle = (title: string): string =>
    title.replace(/\s+/g, '-').toLowerCase() || '';

  const onSubmit = useCallback((data: Partial<Collection>) => {
    if (!data.title) {
      console.error("Title is required");
      return;
    }

    const payload: CreateCollectionPayload = {
      domain,
      collectionInputs: {
        title: data.title,
        description: data.description || '',
        handle: data.handle || generateHandle(data.title),
        imageId: image?.imageId,
        seo: {
          title: data.seo?.title,
          description: data.seo?.description,
        },
      },
    };

    createCollection({ variables: payload });
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
            handle={handle} 
          />
        </div>
      </div>
      <SubmitButton loading={loading} />
    </form>
  );
};

export default CreateCollection;