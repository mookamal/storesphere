"use client";

import { IoReload } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ADD_MEDIA_IMAGES_PRODUCT, CREATE_PRODUCT } from "@/graphql/mutations";

import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { GET_SETTINGS_GENERAL } from "@/graphql/queries";
import PriceInput from "@/components/admin/product/PriceInput";
import SeoInputs from "@/components/admin/product/SeoInputs";
import OptionInputs from "@/components/admin/product/option/OptionInputs";
import GeneralInputs from "@/components/admin/product/GeneralInputs";
import MediaInputs from "@/components/admin/product/MediaInputs";
import { Button } from "@/components/ui/button";
import ProductOrganization from "@/components/admin/product/ProductOrganization";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const domain = useParams().domain;
  const [storeData, setStoreData] = useState(null);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedRemoveImages, setSelectedRemoveImages] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: 0.0,
      compare: 0.0,
    },
  });

  const description = watch("description");
  const watchedTitle = watch("title");
  const handle = watch("handle");
  const seoTitle = watch("seoTitle");
  const price = watch("price");
  const compare = watch("compare");

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

  useEffect(() => {
    getStoreData();
  }, []);

  const addImages = async (productId) => {
    if (productId || selectedImages.length > 0) {
      const dataBody = {
        query: ADD_MEDIA_IMAGES_PRODUCT,
        variables: {
          productId: productId,
          imageIds: selectedImages.map((item) => item.id),
          defaultDomain: domain,
        },
      };
      try {
        const response = await axios.post("/api/set-data", dataBody);
        if (response.data.data.addImagesProduct.product.id) {
          toast.success("Media images added successfully!");
        }
      } catch (error) {
        toast.error("Failed to add media images to the product.");
      }
    }
  };

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

  function cleanOptionsData(options) {
    return options.map((option) => ({
      name: option.name,
      values: option.values.map((value) => ({
        name: value.name,
      })),
    }));
  }

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
        stock: parseInt(data.stock),
      },
      options: cleanOptionsData(data.options),
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
      if (response.data.data.createProduct.product.productId) {
        await addImages(response.data.data.createProduct.product.productId);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <h1 className="h1">Add a new product</h1>
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
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            externalLoading={loading}
            selectedRemoveImages={selectedRemoveImages}
            setSelectedRemoveImages={setSelectedRemoveImages}
          />

          {/* price input */}
          <PriceInput
            register={register}
            currencyCode={storeData?.currencyCode}
            price={price}
            compare={compare}
          />
          {/* product organization */}
          <ProductOrganization
            domain={domain}
            selectedCollections={selectedCollections}
            setSelectedCollections={setSelectedCollections}
          />
          {/* seo inputs */}
          <SeoInputs register={register} domain={domain} handle={handle} />
          {/* OptionInputs */}
          <OptionInputs
            register={register}
            control={control}
            errors={errors}
            trigger={trigger}
            watch={watch}
            getValues={getValues}
            setValue={setValue}
          />
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
