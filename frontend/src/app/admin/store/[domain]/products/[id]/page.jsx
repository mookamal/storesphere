"use client";

import {
  TextInput,
  Label,
  Select,
  Button,
  Spinner,
  Textarea,
  Badge,
} from "flowbite-react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import axios from "axios";
const CustomEditor = dynamic(() => import("@/components/custom-editor"), {
  ssr: false,
});
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { GET_PRODUCT_BY_ID } from "@/graphql/queries";
import { UPDATE_PRODUCT } from "@/graphql/mutations";

export default function UpdateProduct() {
  const domain = useParams().domain;
  const [loading, setLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const productId = useParams().id;
  const [data, setData] = useState(null);
  const [product, setProduct] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm();
  const description = watch("description");
  const title = watch("title");
  const status = watch("status");
  const handle = watch("handle");
  const seoTitle = watch("seoTitle");
  const seoDescription = watch("seoDescription");
  const [selectedRemoveImages, setSelectedRemoveImages] = useState([]);

  const removeSelectedImages = () => {};

  const handleBlur = () => {
    if (!handle) {
      setValue("handle", watchedTitle.replace(/\s+/g, "-").toLowerCase());
    }
    if (!seoTitle) {
      setValue("seoTitle", watchedTitle);
    }
  };

  useEffect(() => {
    if (
      title !== product?.title ||
      description !== product?.description ||
      status !== product?.status ||
      handle !== product?.handle ||
      seoTitle !== product?.seo.title ||
      seoDescription !== product?.seo.description
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [description, title, status, seoTitle, seoDescription, handle]);

  const debouncedUpdate = debounce((field, value) => {}, 500);

  useEffect(() => {
    debouncedUpdate("title", title);
    debouncedUpdate("description", description);
    return () => {
      debouncedUpdate.cancel();
    };
  }, [title, description]);

  useEffect(() => {
    getProductById();
  }, []);

  const getProductById = async () => {
    try {
      const response = await axios.post("/api/get-data", {
        query: GET_PRODUCT_BY_ID,
        variables: { id: productId },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      if (response.data) {
        console.log("Product", response.data);
        setData(response.data || null);
        setProduct(response.data.product || null);
        setValue("title", response.data.product.title || "");
        setValue("description", response.data.product.description || "");
        setValue("status", response.data.product.status);
        setValue("handle", response.data.product.handle || null);
        setValue("seoTitle", response.data.product.seo.title || "");
        setValue("seoDescription", response.data.product.seo.description || "");
      } else {
        toast.error("Failed to fetch product details");
        setIsNotFound(true);
      }
    } catch (error) {
      toast.error("Failed to update product");
      setIsNotFound(true);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const productData = {
      title: data.title,
      description: data.description,
      status: data.status,
      handle: data.handle,
      seo: {
        title: data.seoTitle,
        description: data.seoDescription,
      },
    };
    const variables = {
      defaultDomain: domain,
      product: productData,
      id: productId,
    };
    try {
      const response = await axios.post("/api/set-data", {
        query: UPDATE_PRODUCT,
        variables: variables,
      });
      if (response.data.data.updateProduct.product.id) {
        toast.success("Product updated successfully!");
        getProductById();
        setLoading(false);
        setHasChanges(false);
      }
    } catch (error) {
      toast.error("Failed to update product");
      setLoading(false);
    }
  };

  const handleEditorChange = (content) => {
    setValue("description", content);
  };

  if (isNotFound) return notFound();

  if (!data) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner aria-label="Loading button" size="lg" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card p-3">
            <div>
              <div className="mb-2">
                <Label htmlFor="title" value="Title" />
              </div>
              <TextInput
                id="title"
                sizing="sm"
                type="text"
                {...register("title")}
                placeholder="Product 1"
                onBlur={handleBlur}
                required
              />
            </div>

            <div className="my-2">
              <div className="mb-2">
                <h2>Description</h2>
              </div>
              {/* CustomEditor with description */}
              <CustomEditor
                content={description}
                setContent={handleEditorChange}
              />
            </div>
            {/* Media */}
            <div className="my-2">
              <div className="mb-2">
                {selectedRemoveImages.length > 0 && (
                  <div className="flex items-center justify-between">
                    <h3>{selectedRemoveImages.length} file selected</h3>
                    <Button
                      color="red"
                      size="xs"
                      onClick={removeSelectedImages}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                {selectedRemoveImages.length === 0 && <h2>Media</h2>}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-3">
            <div className="mb-2">
              <Label htmlFor="status" value="Status" />
            </div>
            <Select sizing="sm" id="status" {...register("status")}>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
            </Select>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-3">
            <h2>SEO data</h2>
            <div className="my-2">
              <div className="mb-2">
                <Label htmlFor="seoTitle" value="Page title" />
              </div>
              <TextInput
                id="seoTitle"
                sizing="sm"
                type="text"
                {...register("seoTitle")}
                placeholder="seo title"
              />
            </div>
            <div className="my-2">
              <div className="mb-2">
                <h2>Page description</h2>
              </div>
              <Textarea
                sizing="sm"
                {...register("seoDescription")}
                placeholder="seo description"
                rows={3}
              />
            </div>

            <div className="my-2">
              <div className="mb-2">
                <h2>URL handle</h2>
                <Badge size="xs" className="my-3" color="success">
                  https://{domain}.my-store.com/{handle}
                </Badge>
              </div>
              <TextInput sizing="sm" {...register("handle")} />
            </div>
          </div>
        </div>
      </div>
      <Button
        size="xl"
        color="light"
        type="submit"
        className="fixed bottom-5 right-5 rounded-full shadow-md bg-baby-blue text-coal-600"
        disabled={!hasChanges}
      >
        {loading && (
          <Spinner aria-label="Loading button" className="mr-1" size="md" />
        )}
        Update
      </Button>
    </form>
  );
}
