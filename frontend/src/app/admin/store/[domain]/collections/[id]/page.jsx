"use client";
import AddProducts from "@/components/admin/collection/AddProducts";
import GeneralInputs from "@/components/admin/collection/GeneralInputs";
import SeoInputs from "@/components/admin/collection/SeoInputs";
import { Button } from "@/components/ui/button";
import { ADMIN_UPDATE_COLLECTION } from "@/graphql/mutations";
import {
  ADMIN_COLLECTION_BY_ID,
  ADMIN_PRODUCTS_BY_COLLECTION_ID,
} from "@/graphql/queries";
import { handleGraphQLError } from "@/lib/utilities";
import axios from "axios";
import { useParams, notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoReload } from "react-icons/io5";
import { toast } from "react-toastify";

export default function updateCollection() {
  const collectionId = useParams().id;
  const domain = useParams().domain;
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm();
  const [image, setImage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const renderCountEffect = useRef(0);
  const watchedTitle = watch("title");
  const description = watch("description");
  const handle = watch("handle");
  const seoTitle = watch("seoTitle");
  const seoDescription = watch("seoDescription");
  const handleBlur = () => {
    if (watchedTitle) {
      if (!handle) {
        setValue("handle", watchedTitle.replace(/\s+/g, "-").toLowerCase());
      }
      if (!seoTitle) {
        setValue("seoTitle", watchedTitle);
      }
    }
  };
  // Fetch products by collection ID
  const fetchProducts = async (collectionId) => {
    try {
      const response = await axios.post("/api/get-data", {
        query: ADMIN_PRODUCTS_BY_COLLECTION_ID,
        variables: { collectionId: collectionId, first: 15, after: "" },
      });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setSelectedProducts(
        response.data.productsByCollection.edges.map(({ node }) => node)
      );
      if (renderCountEffect.current < 3) {
        renderCountEffect.current++;
      }
    } catch (error) {
      console.error(error);
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
        setCollection(response.data.collectionById);
        setValue("title", response.data.collectionById.title);
        setValue("handle", response.data.collectionById.handle);
        setValue("description", response.data.collectionById.description);
        setValue("seoTitle", response.data.collectionById.seo.title);
        setValue(
          "seoDescription",
          response.data.collectionById.seo.description
        );
        setImage(response.data.collectionById.image);
        fetchProducts(collectionId);
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
      watchedTitle !== collection?.title ||
      description !== collection?.description ||
      handle !== collection?.handle ||
      seoTitle !== collection?.seo.title ||
      seoDescription !== collection?.seo.description ||
      image !== collection?.image;
    setHasChanges(isHasChange);
  }, [watchedTitle, description, handle, image, seoTitle, seoDescription]);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/set-data", {
        query: ADMIN_UPDATE_COLLECTION,
        variables: {
          collectionId: collectionId,
          collectionInputs: {
            title: data.title,
            handle: data.handle,
            description: data.description,
            seo: {
              title: data.seoTitle,
              description: data.seoDescription,
            },
            imageId: image ? image?.imageId : null,
          },
        },
      });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      if (response.data.data.updateCollection) {
        toast.success("Collection updated successfully!");
        getCollectionById();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update collection");
    } finally {
      setLoading(false);
    }
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
        <h1 className="h1">Update Collection</h1>
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
            refetchProducts={fetchProducts}
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
