"use client";
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
import { useParams, notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoReload } from "react-icons/io5";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
// custom hooks
import useCollectionForm from "@/hooks/collection/useCollectionForm";
import { useProductFetcher } from '@/hooks/collection/productUtils';
import { useQuery, useMutation } from '@apollo/client';
import { removeTypename } from "@/lib/utils";
export default function UpdateCollection() {
  const router = useRouter();
  const collectionId = useParams().id;
  const domain = useParams().domain;
  const [selectedProducts, setSelectedProducts] = useState([]);
  // GraphQL Operations
  const { data, loading, error, refetch } = useQuery(ADMIN_COLLECTION_BY_ID, {
    variables: { id: collectionId },
    fetchPolicy: 'cache-and-network',
  });

  // Fetch products by collection ID
  const { fetchProducts } = useProductFetcher();
  const initialFormValuesRef = useRef(removeTypename(data?.collectionById));

  const { 
    image, 
    register, 
    handleSubmit, 
    errors, 
    handleBlur, 
    setImage,
    watch,
    reset,
    formState: { isDirty, dirtyFields }
  } = useCollectionForm(initialFormValuesRef.current);

  useEffect(() => {
    if (data && data.collectionById) {
      const cleanedData = removeTypename(data.collectionById);
      reset(cleanedData);
      initialFormValuesRef.current = cleanedData;
    }
  }, [data, reset]);
  
  // watch handle
  const handle = watch('handle');
  // create function to refetch products
  const refetchProducts = async () => {

  };

  const handleDeleteCollection = async () => {

  };

  const onSubmit = (data) => {};
  if (loading) {
    return <div className="text-center mt-24">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <div className="flex justify-between">
          <h1 className="h1">Update Collection</h1>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteCollection}
          >
            Delete
          </Button>
        </div>
        <div className="flex flex-col items-center my-5 gap-3">
          <GeneralInputs
            register={register}
            handleBlur={handleBlur}
            setImage={setImage}
            image={image}
          />
          <AddProducts
            collectionId={collectionId}
            selectedProducts={selectedProducts}
            refetchProducts={refetchProducts}
          />
          <SeoInputs register={register} domain={domain} handle={handle} />
        </div>
      </div>
      <Button
        size="lg"
        type="submit"
        className="fixed bottom-5 right-5 rounded-full shadow-md"
        disabled={!isDirty}
      >
        {loading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
        Update
      </Button>
    </form>
  );
}
