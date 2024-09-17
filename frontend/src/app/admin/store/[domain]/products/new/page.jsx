"use client";

import {
  TextInput,
  Label,
  Select,
  Button,
  Spinner,
  Textarea,
  Badge,
  HR,
  Checkbox,
} from "flowbite-react";
import { IoCloudUploadOutline } from "react-icons/io5";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { CREATE_PRODUCT } from "@/graphql/mutations";
const CustomEditor = dynamic(() => import("@/components/custom-editor"), {
  ssr: false,
});
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import MediaModal from "@/components/admin/product/MediaModal";

export default function AddProduct() {
  const [openMediaModal, setOpenMediaModal] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const domain = useParams().domain;
  const [selectedImages, setSelectedImages] = useState([]);
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const description = watch("description");
  const watchedTitle = watch("title");
  const handle = watch("handle");
  const seoTitle = watch("seoTitle");

  const handleBlur = () => {
    if (!handle) {
      setValue("handle", watchedTitle.replace(/\s+/g, "-").toLowerCase());
    }
    if (!seoTitle) {
      setValue("seoTitle", watchedTitle);
    }
  };

  const debouncedUpdate = debounce((field, value) => {}, 500);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (selectedImages.length > 0) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [selectedImages]);

  useEffect(() => {
    debouncedUpdate("title", watchedTitle);
    debouncedUpdate("description", description);
    return () => {
      debouncedUpdate.cancel();
    };
  }, [watchedTitle, description]);

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
    };
    try {
      const response = await axios.post("/api/set-data", {
        query: CREATE_PRODUCT,
        variables: variables,
      });
      setLoading(false);
      if (response.data.data.createProduct.product.productId) {
        router.push(
          `/store/${domain}/products/${response.data.data.createProduct.product.productId}`
        );
        toast.success("Product created successfully!");
      } else {
        toast.error("Failed to create product!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create product!");
    }
  };

  const handleEditorChange = (content) => {
    setValue("description", content);
  };

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
                <h2>Media</h2>
              </div>
              {/* Media upload */}
              {selectedImages && (
                <div className="grid grid-rows-1 grid-flow-col gap-4 overflow-x-auto p-4">
                  <div className="max-h-16 max-w-20 flex items-center justify-center">
                    <Button
                      size="xl"
                      color="light"
                      onClick={() => setOpenMediaModal(true)}
                    >
                      <IoCloudUploadOutline />
                    </Button>
                    <MediaModal
                      openModal={openMediaModal}
                      setOpenModal={() => setOpenMediaModal(false)}
                      selectedImages={selectedImages}
                      setSelectedImages={setSelectedImages}
                    />
                  </div>
                  {selectedImages.map((image) => {
                    return (
                      <div
                        key={image.id}
                        className="flex items-center space-x-4"
                      >
                        {/* Checkbox for each image */}
                        <Checkbox id={image.id} color="light" />

                        {/* Image display */}
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${image.image}`}
                          alt={`image-${image.id}`}
                          className="max-h-16 max-w-20 rounded-lg object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
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
                id="seoDescription"
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
        disabled={loading}
      >
        {loading && (
          <Spinner aria-label="Loading button" className="mr-1" size="md" />
        )}
        Add
      </Button>
    </form>
  );
}
