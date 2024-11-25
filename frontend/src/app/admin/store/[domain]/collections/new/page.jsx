"use client";
import GeneralInputs from "@/components/admin/collection/GeneralInputs";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoReload } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import SeoInputs from "@/components/admin/collection/SeoInputs";
import AddProducts from "@/components/admin/collection/AddProducts";
import axios from "axios";
import { ADMIN_CREATE_COLLECTION } from "@/graphql/mutations";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function CreateCollection({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { register, handleSubmit, watch, setValue } = useForm();
  const watchedTitle = watch("title");
  const handle = watch("handle");
  const seoTitle = watch("seoTitle");
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
  const onSubmit = async (data) => {
    setLoading(true);
    const productIds =
      selectedProducts.length > 0
        ? selectedProducts.map((p) => p.productId)
        : [];
    const variables = {
      domain: params.domain,
      collectionInputs: {
        title: data.title,
        description: data.description,
        handle: data.handle,
        productIds: productIds,
        seo: {
          title: data.seoTitle,
          description: data.seoDescription,
        },
      },
    };
    try {
      const response = await axios.post("/api/set-data", {
        query: ADMIN_CREATE_COLLECTION,
        variables: variables,
      });
      if (response.data.data.createCollection.collection.collectionId) {
        toast.success("Collection created successfully!");
        router.push(
          `/store/${params.domain}/collections/${response.data.data.createCollection.collection.collectionId}`
        );
      }
    } catch (e) {
      console.error("Error creating collection", e);
      toast.error("Failed to create collection");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <h1 className="h1">Add a new collection</h1>
        <div className="flex flex-col items-center my-5 gap-3">
          <GeneralInputs register={register} handleBlur={handleBlur} />
          <AddProducts
            domain={params.domain}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
          <SeoInputs register={register} domain={params.domain} handle="test" />
        </div>
      </div>
      <Button
        size="lg"
        type="submit"
        className="fixed bottom-5 right-5 rounded-full shadow-md"
        disabled={loading}
      >
        {loading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
        Add
      </Button>
    </form>
  );
}
