"use client";

import { Button } from "@/components/ui/button";
import { IoReload } from "react-icons/io5";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import axios from "axios";
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
import LoadingElement from "@/components/LoadingElement";
import PriceInput from "@/components/admin/product/PriceInput";
import SeoInputs from "@/components/admin/product/SeoInputs";
import GeneralInputs from "@/components/admin/product/GeneralInputs";
import MediaInputs from "@/components/admin/product/MediaInputs";
import OptionInputs from "@/components/admin/product/option/OptionInputs";
import VariantCard from "@/components/admin/product/variant/VariantCard";

export default function UpdateProduct() {
  const [storeData, setStoreData] = useState(null);
  const domain = useParams().domain;
  const [loading, setLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const productId = useParams().id;
  const [data, setData] = useState(null);
  const [product, setProduct] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const description = watch("description");
  const title = watch("title");
  const status = watch("status");
  const handle = watch("handle");
  const seoTitle = watch("seoTitle");
  const seoDescription = watch("seoDescription");
  const price = watch("price");
  const compare = watch("compare");
  const options = watch("options");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });
  const controlledFieldOptions = fields.map((field, index) => ({
    ...field,
    ...options[index],
  }));
  const [mediaImages, setMediaImages] = useState([]);
  const [copyMediaImages, setCopyMediaImages] = useState([]);
  const [selectedRemoveImages, setSelectedRemoveImages] = useState([]);

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

  useEffect(() => {
    removeSelectedImages();
  }, [selectedRemoveImages]);

  const handleBlur = () => {
    if (!handle) {
      setValue("handle", watchedTitle.replace(/\s+/g, "-").toLowerCase());
    }
    if (!seoTitle) {
      setValue("seoTitle", watchedTitle);
    }
  };

  function cleanOptionsData(options) {
    if (!options) return [];
    return options.map((option) => ({
      name: option.name,
      id: option.id,
      values: option.values.map((value) => ({
        name: value.name,
        id: value.id,
      })),
    }));
  }

  useEffect(() => {
    const hasBasicChanges =
      title !== product?.title ||
      description !== product?.description ||
      status !== product?.status ||
      handle !== product?.handle ||
      seoTitle !== product?.seo.title ||
      seoDescription !== product?.seo.description ||
      price !== product?.firstVariant.price ||
      compare !== product?.firstVariant.compareAtPrice ||
      JSON.stringify(cleanOptionsData(options)) !==
        JSON.stringify(cleanOptionsData(product?.options));

    if (hasBasicChanges) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [
    description,
    title,
    status,
    seoTitle,
    seoDescription,
    handle,
    price,
    compare,
    controlledFieldOptions,
  ]);

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
        const optionsData = response.data.product.options || [];
        if (optionsData.length > 0) {
          const optionsWithEditingState = optionsData.map((option) => ({
            ...option,
            isEditing: false,
          }));
          setValue("options", optionsWithEditingState);
        }
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
      firstVariant: {
        price: data.price,
        compareAtPrice: data.compare,
      },
      options: cleanOptionsData(data.options),
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

  if (isNotFound) return notFound();

  if (!data) {
    return (
      <div className="flex justify-center items-center h-full">
        <IoReload className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loading && <LoadingElement />}
      <div className="p-5">
        <h1 className="h1">Update Product Details</h1>
        <div className="grid lg:grid-cols-2 gap-4 my-3">
          {/* title , status and description */}
          <GeneralInputs
            register={register}
            handleBlur={handleBlur}
            description={description}
            setValue={setValue}
          />
          {/* images input */}
          <MediaInputs
            selectedImages={mediaImages}
            setSelectedImages={setMediaImages}
            externalLoading={loading}
            selectedRemoveImages={selectedRemoveImages}
            setSelectedRemoveImages={setSelectedRemoveImages}
          />
          <div className="flex flex-col gap-3">
            {/* price input */}
            <PriceInput
              register={register}
              currencyCode={storeData?.currencyCode}
              price={price}
              compare={compare}
            />
            {/* seo inputs */}
            <SeoInputs register={register} domain={domain} handle={handle} />
          </div>
          {/* variant inputs */}
          <OptionInputs
            register={register}
            control={control}
            errors={errors}
            trigger={trigger}
            watch={watch}
            getValues={getValues}
            setValue={setValue}
          />
          {/* Variant card */}
          <VariantCard watch={watch} currencyCode={storeData?.currencyCode} />
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
