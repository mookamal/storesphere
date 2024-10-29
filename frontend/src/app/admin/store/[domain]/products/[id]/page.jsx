"use client";

import {
  TextInput,
  Label,
  Select,
  Button,
  Spinner,
  Textarea,
  Badge,
  Checkbox,
} from "flowbite-react";
import { IoCloudUploadOutline } from "react-icons/io5";
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
import {
  GET_MEDIA_PRODUCT,
  GET_PRODUCT_BY_ID,
  GET_SETTINGS_GENERAL,
} from "@/graphql/queries";
import {
  ADD_MEDIA_IMAGES_PRODUCT,
  REMOVE_MEDIA_IMAGES_PRODUCT,
  UPDATE_PRODUCT,
} from "@/graphql/mutations";
import MediaModal from "@/components/admin/product/MediaModal";
import LoadingElement from "@/components/LoadingElement";
import PriceInput from "@/components/admin/product/PriceInput";

export default function UpdateProduct() {
  const [storeData, setStoreData] = useState(null);
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
  const [mediaImages, setMediaImages] = useState([]);
  const [copyMediaImages, setCopyMediaImages] = useState([]);
  const [selectedRemoveImages, setSelectedRemoveImages] = useState([]);
  const [openMediaModal, setOpenMediaModal] = useState(false);

  const getStoreData = async () => {
    setLoading(true);
    const dataBody = {
      query: GET_SETTINGS_GENERAL,
      variables: {
        domain: domain,
      },
    };
    try {
      const response = await axios.post("/api/get-data", dataBody);
      setStoreData(response.data.store);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSelectRemoveImages = (image, isChecked) => {
    if (isChecked) {
      setSelectedRemoveImages([...selectedRemoveImages, image]);
    } else {
      setSelectedRemoveImages(
        selectedRemoveImages.filter((item) => item.id !== image.id)
      );
    }
  };
  const removeSelectedImages = async () => {
    setLoading(true);
    if (selectedRemoveImages.length > 0) {
      const dataBody = {
        query: REMOVE_MEDIA_IMAGES_PRODUCT,
        variables: {
          productId: productId,
          imageIds: selectedRemoveImages.map((item) => item.id),
          defaultDomain: domain,
        },
      };
      try {
        const response = await axios.post("/api/set-data", dataBody);
        if (response.data.data.removeImagesProduct.product.id) {
          toast.success("Media images removed successfully!");
          getMediaProduct();
          setSelectedRemoveImages([]);
        }
      } catch (error) {
        toast.error("Failed to remove media images from the product.");
      }
    }
    setLoading(false);
  };

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

  const addImages = async (productId) => {
    setLoading(true);
    if (productId || mediaImages.length > 0) {
      const dataBody = {
        query: ADD_MEDIA_IMAGES_PRODUCT,
        variables: {
          productId: productId,
          imageIds: mediaImages.map((item) => item.id),
          defaultDomain: domain,
        },
      };
      try {
        const response = await axios.post("/api/set-data", dataBody);
        if (response.data.data.addImagesProduct.product.id) {
          toast.success("Media images added successfully!");
          getMediaProduct();
        }
      } catch (error) {
        toast.error("Failed to add media images to the product.");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mediaImages.length > copyMediaImages.length) {
      addImages(productId);
    }
  }, [mediaImages]);

  const debouncedUpdate = debounce((field, value) => {}, 500);

  useEffect(() => {
    debouncedUpdate("title", title);
    debouncedUpdate("description", description);
    return () => {
      debouncedUpdate.cancel();
    };
  }, [title, description]);

  useEffect(() => {
    getStoreData();
    getProductById();
    getMediaProduct();
  }, []);

  const getMediaProduct = async () => {
    try {
      const response = await axios.post("/api/get-data", {
        query: GET_MEDIA_PRODUCT,
        variables: { productId: productId, after: "" },
      });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      if (response.data.getImagesProduct.edges) {
        setMediaImages(
          response.data.getImagesProduct.edges.map((edge) => ({
            id: edge.node.imageId,
            image: edge.node.image,
          }))
        );
        setCopyMediaImages([
          ...response.data.getImagesProduct.edges.map((edge) => ({
            id: edge.node.imageId,
            image: edge.node.image,
          })),
        ]);
      }
    } catch (e) {
      toast.error("Failed to fetch media images");
    }
  };

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
        setData(response.data || null);
        setProduct(response.data.product || null);
        setValue("title", response.data.product.title || "");
        setValue("description", response.data.product.description || "");
        setValue("status", response.data.product.status);
        setValue("handle", response.data.product.handle || null);
        setValue("seoTitle", response.data.product.seo.title || "");
        setValue("seoDescription", response.data.product.seo.description || "");
        setValue("price", response.data.product.firstVariant.price || null);
        setValue(
          "compare",
          response.data.product.firstVariant.compareAtPrice || null
        );
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
      {loading && <LoadingElement />}
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
              {/* Media upload */}
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
                    selectedImages={mediaImages}
                    setSelectedImages={setMediaImages}
                    externalLoading={loading}
                  />
                </div>
                {mediaImages.map((image) => {
                  return (
                    <div key={image.id} className="flex items-center space-x-4">
                      {/* Checkbox for each image */}
                      <Checkbox
                        id={image.id}
                        color="light"
                        onChange={(e) =>
                          handleSelectRemoveImages(image, e.target.checked)
                        }
                        checked={selectedRemoveImages.some(
                          (selectedImage) => selectedImage.id === image.id
                        )}
                      />

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
        <div className="lg:col-span-1">
          <PriceInput
            register={register}
            currencyCode={storeData?.currencyCode}
            defaultPrice={0}
            defaultCompare={0}
          />
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
