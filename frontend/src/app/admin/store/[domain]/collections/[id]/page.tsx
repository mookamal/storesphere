"use client";

import React, { useEffect, useRef, useState } from "react";
import AddProducts from "@/components/admin/collection/AddProducts";
import GeneralInputs from "@/components/admin/collection/GeneralInputs";
import SeoInputs from "@/components/admin/collection/SeoInputs";
import { Button } from "@/components/ui/button";
import {
  ADMIN_UPDATE_COLLECTION,
  DELETE_COLLECTIONS,
} from "@/graphql/mutations";
import {
  ADMIN_COLLECTION_BY_ID,
  ADMIN_PRODUCTS_BY_COLLECTION_ID,
} from "@/graphql/queries";
import { useParams, useRouter } from "next/navigation";
import { IoReload } from "react-icons/io5";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { useQuery, useMutation } from "@apollo/client";
import useCollectionForm from "@/hooks/collection/useCollectionForm";
import { removeTypename } from "@/lib/utils";
import type { Collection } from "@/types";

interface Pagination {
  first: number;
  after: string;
}

interface ProductsByCollectionData {
  productsByCollection: {
    edges: {
      node: any;
    }[];
  };
}

interface CollectionByIdData {
  collectionById: Collection;
}

export default function UpdateCollection(): JSX.Element {
  const router = useRouter();

  const { id: collectionId, domain } = useParams() as {
    id: string;
    domain: string;
  };

  const [updateCollection, { loading: updateLoading }] = useMutation<any>(
    ADMIN_UPDATE_COLLECTION,
    {
      onCompleted: () => {
        toast.success("Collection updated successfully!");
        refetch();
      },
      onError: (error: Error) => {
        toast.error(`Failed to update collection: ${error.message}`);
      },
    }
  );

  const [deleteCollection] = useMutation<any>(DELETE_COLLECTIONS);

  const [pagination, setPagination] = useState<Pagination>({ first: 10, after: "" });

  const { data: productsData, refetch: refetchProducts } = useQuery<ProductsByCollectionData>(
    ADMIN_PRODUCTS_BY_COLLECTION_ID,
    {
      variables: { collectionId, ...pagination },
      skip: !collectionId,
    }
  );

  const { data, loading, error, refetch } = useQuery<CollectionByIdData>(ADMIN_COLLECTION_BY_ID, {
    variables: { id: collectionId },
    fetchPolicy: "cache-and-network",
  });


  const initialFormValuesRef = useRef<Partial<Collection> | undefined>(
    data ? removeTypename(data.collectionById) : undefined
  );

  const {
    image,
    register,
    handleSubmit,
    errors,
    handleBlur,
    setImage,
    watch,
    reset,
    formState: { isDirty, dirtyFields },
  } = useCollectionForm(initialFormValuesRef.current);
  

  useEffect(() => {
    if (data && data.collectionById) {
      const cleanedData = removeTypename(data.collectionById);
      reset(cleanedData);
      initialFormValuesRef.current = cleanedData;
    }
  }, [data, reset]);

  const handle = watch("handle");

  const handleDeleteCollection = async (): Promise<void> => {
    const confirmation: boolean = await swal({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      dangerMode: true,
    });
    if (confirmation) {
      try {
        await deleteCollection({
          variables: { collectionIds: [collectionId], domain },
          update: (cache: any) => {
            cache.evict({ id: `Collection:${collectionId}` });
          },
        });
        router.push(`/store/${domain}/collections`);
        toast.success("Collection deleted successfully!");
      } catch (error: any) {
        toast.error(`Failed to delete collection: ${error.message}`);
      }
    }
  };

  const onSubmit = async (formData: Partial<Collection>): Promise<void> => {
    console.log("formData",formData);
    try {
      const input = {
        ...removeTypename(formData),
        imageId: formData.image?.imageId || null,
      };
      // remove image from input
      delete input.image;
      await updateCollection({
        variables: {
          collectionId,
          collectionInputs: input,
          domain,
        },
      });
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-24">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <div className="flex justify-between">
          <h1 className="h1">Update Collection</h1>
          <Button type="button" variant="destructive" onClick={handleDeleteCollection}>
            Delete
          </Button>
        </div>
        <div className="flex flex-col items-center my-5 gap-3">
          <GeneralInputs
            register={register}
            handleBlur={handleBlur}
            setImage={setImage}
            image={image}
            errors={errors}
          />
          <AddProducts
            collectionId={collectionId}
            selectedProducts={
              productsData?.productsByCollection?.edges?.map((edge) => edge.node) || []
            }
            refetchProducts={refetchProducts}
          />
          <SeoInputs register={register} domain={domain} handle={handle} />
        </div>
      </div>
      <Button
        size="lg"
        type="submit"
        className="fixed bottom-5 right-5 rounded-full shadow-md"
        disabled={!isDirty || updateLoading}
      >
        {loading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
        Update
      </Button>
    </form>
  );
}
