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
import { handleGraphQLError } from "@/lib/utilities";
import axios from "axios";
import { useParams, notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoReload } from "react-icons/io5";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
// custom hooks
import useCollectionForm from "@/hooks/collection/useCollectionForm";
import useCollectionSubmit from "@/hooks/collection/useCollectionSubmit";
import { useProductFetcher } from '@/hooks/collection/productUtils';

export default function UpdateCollection() {
  const router = useRouter();
  const collectionId = useParams().id;
  const domain = useParams().domain;
  const [initialCollectionData, setInitialCollectionData] = useState(null);

  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const renderCountEffect = useRef(0);
  // Fetch products by collection ID
  const { fetchProducts } = useProductFetcher();
  const { 
    image, 
    register, 
    handleSubmit, 
    errors, 
    handleBlur, 
    setValue, 
    setImage,
    watch 
  } = useCollectionForm(initialCollectionData);

  const { submitCollection, loading ,setLoading} = useCollectionSubmit(
    ADMIN_UPDATE_COLLECTION, 
    (data) => {
      getCollectionById();
    }, 
    domain, 
    collectionId
  );

  // create function to refetch products
  const refetchProducts = async () => {
    const products = await fetchProducts(collectionId);
    setSelectedProducts(products);
  };

  const watchedTitle = watch("title");
  const description = watch("description");
  const handle = watch("handle");
  const seoTitle = watch("seoTitle");
  const seoDescription = watch("seoDescription");

  const handleDeleteCollection = async () => {
    const confirmed = await swal({
      title: "Delete Collection?",
      text: "Are you sure you want to delete this collection?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (confirmed) {
      try {
        setLoading(true);
        const response = await axios.post("/api/set-data", {
          query: DELETE_COLLECTIONS,
          variables: { collectionIds: [collectionId], defaultDomain: domain },
        });
        if (response.data.data.deleteCollections.success) {
          toast.success("Collection deleted successfully.");
          router.push(`/store/${domain}/collections`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  // Fetch the collection data using the provided ID and domain.
  const getCollectionById = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/get-data", {
        query: ADMIN_COLLECTION_BY_ID,
        variables: { id: collectionId },
      });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      if (response.data.collectionById) {
        setInitialCollectionData(response.data.collectionById);
        setValue("title", response.data.collectionById.title);
        setValue("handle", response.data.collectionById.handle);
        setValue("description", response.data.collectionById.description);
        setValue("seoTitle", response.data.collectionById.seo.title);
        setValue(
          "seoDescription",
          response.data.collectionById.seo.description
        );
        setImage(response.data.collectionById.image);
        refetchProducts();
      }
    } catch (error) {
      const errorDetails = handleGraphQLError(error);
      setError(errorDetails);
    } finally {
      setLoading(false);
    }
  };
  // Call the function to fetch the collection data.
  useEffect(() => {
    getCollectionById();
  }, []);

  // handle has change
  useEffect(() => {
    const isHasChange =
      watchedTitle !== initialCollectionData?.title ||
      description !== initialCollectionData?.description ||
      handle !== initialCollectionData?.handle ||
      seoTitle !== initialCollectionData?.seo.title ||
      seoDescription !== initialCollectionData?.seo.description ||
      image !== initialCollectionData?.image;
    setHasChanges(isHasChange);
  }, [watchedTitle, description, handle, image, seoTitle, seoDescription]);

    const onSubmit = (data) => {
      submitCollection(data, image);
    };
  if (loading) {
    return <div className="text-center mt-24">Loading...</div>;
  }
  if (error) {
    switch (error.type) {
      case "NOT_FOUND":
        notFound();
        break;
      case "UNAUTHORIZED":
        return (
          <div className="error-message">
            You need to log in to access this page.
          </div>
        );
      case "SERVER_ERROR":
        return (
          <div className="error-message">
            An internal server error occurred. Please try again later.
          </div>
        );
      case "NO_RESPONSE":
        return (
          <div className="error-message">
            No response from the server. Check your network.
          </div>
        );
      default:
        return <div className="error-message">{error.message}</div>;
    }
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
        disabled={!hasChanges}
      >
        {loading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
        Update
      </Button>
    </form>
  );
}
