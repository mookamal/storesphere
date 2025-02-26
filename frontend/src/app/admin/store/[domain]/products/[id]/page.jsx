"use client";

import { Button } from "@/components/ui/button";
import { IoReload } from "react-icons/io5";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect,useMemo  } from "react";
import { useParams, notFound } from "next/navigation";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import LoadingElement from "@/components/LoadingElement";
import PriceInput from "@/components/admin/product/common/PriceInput";
import SeoInputs from "@/components/admin/product/common/SeoInputs";
import GeneralInputs from "@/components/admin/product/common/GeneralInputs";
import MediaInputs from "@/components/admin/product/common/MediaInputs";
import OptionInputs from "@/components/admin/product/option/OptionInputs";
import VariantCard from "@/components/admin/product/variant/VariantCard";
import ProductOrganization from "@/components/admin/product/common/ProductOrganization";
import {
  processDescription,
  safeParseNumber,
  cleanOptionsData,
  cleanCollections,
} from "@/utils/dataTransformers";
import {
  useSettingsGeneralQuery,
  useGetMediaProductQuery,
  useRemoveMediaImagesProductMutation,
  ProductNode,
  ImageNode,
  CollectionNode,
  ProductInput,
  ProductProductStatusChoices,
  useAddMediaImagesProductMutation,
  useGetProductByIdQuery,
  useProductSaveUpdateMutation,
} from "@/codegen/generated";
export default function UpdateProduct() {
  const domain = useParams().domain;
  const [isNotFound, setIsNotFound] = useState(false);
  const productId = useParams().id;
  const [selectedCollections, setSelectedCollections] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    trigger,
    control,
    formState: { errors,isDirty, dirtyFields },
    watch,
  } = useForm();
  const description = watch("description");
  const title = watch("title");
  const handle = watch("handle");
  const seoTitle = watch("seo.title");
  const price = watch("firstVariant.price");
  const compare = watch("firstVariant.compareAtPrice");
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

  const { data: storeData } = useSettingsGeneralQuery({
    variables: { domain },
  });
  const [removeImages, { loading: removeImagesLoading }] =
    useRemoveMediaImagesProductMutation({
      onCompleted: () => {
        const updatedImages = mediaImages.filter(
          (img) =>
            !selectedRemoveImages.some((removed) => removed.id === img.id)
        );
        setMediaImages(updatedImages);
        setCopyMediaImages(updatedImages);
        setSelectedRemoveImages([]);
        toast.success("Media images removed successfully!");
        refetchMedia();
      },
      onError: (error) => {
        toast.error("Failed to remove media images from the product.");
        console.error("Remove images error:", error);
      },
    });
  const removeSelectedImages = async () => {
    if (selectedRemoveImages.length > 0) {
      await removeImages({
        variables: {
          productId,
          imageIds: selectedRemoveImages.map((item) => item.id),
          defaultDomain: domain,
        },
      });
    }
  };

  const handleBlur = () => {
    if (!handle) {
      setValue("handle", title.replace(/\s+/g, "-").toLowerCase());
    }
    if (!seoTitle) {
      setValue("seo.title", title);
    }
  };



  const [addMediaImages, { loading: addImagesLoading }] =
    useAddMediaImagesProductMutation({
      onCompleted: () => {
        toast.success("Media images added successfully!");
        refetchMedia();
      },
      onError: (error) => {
        toast.error("Failed to add media images to the product.");
        console.error("Add images error:", error);
      },
    });

  const addImages = async (productId) => {
    if (productId && mediaImages.length > 0) {
      await addMediaImages({
        variables: {
          productId,
          imageIds: mediaImages.map((item) => item.id),
          defaultDomain: domain,
        },
      });
    }
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



  const {
    data: mediaData,
    loading: mediaLoading,
    refetch: refetchMedia,
  } = useGetMediaProductQuery({
    variables: {
      productId: productId,
      domain: domain,
      after: "",
    },
    skip: !productId || !domain,
    onCompleted: (data) => {
      if (data?.getImagesProduct?.edges) {
        const formattedImages = data.getImagesProduct.edges.map((edge) => ({
          id: edge.node.imageId,
          imageId: edge.node.imageId,
          image: edge.node.image,
        }));
        setMediaImages(formattedImages);
        setCopyMediaImages(formattedImages);
      }
    },
    onError: (error) => {
      toast.error("Failed to fetch product media");
      console.error("Media fetch error:", error);
    },
  });
// Get product data using the generated hook
  const { data: product, loading: productLoading,refetch } = useGetProductByIdQuery({
    variables: {
      id: productId,
      domain: domain,
    },
    skip: !productId || !domain,
    onCompleted: (data) => {
      // set product to form
      if (data?.product) {
        reset({
          title: data.product.title || "",
          description: data.product.description || "",
          status: data.product.status || ProductProductStatusChoices.Draft,
          handle: data.product.handle || "",
          options: data.product.options || [],
          seo:  {
            title: data.product.seo?.title || "",
            description: data.product.seo?.description || "",
          },
          firstVariant: {
            price: data.product.firstVariant?.pricing?.amount || 0,
            compareAtPrice: data.product.firstVariant?.compareAtPrice || 0,
            stock: data.product.firstVariant?.stock || 0,
          },
        });
      }
    },
    onError: (error) => {
      toast.error("Failed to fetch product details");
      setIsNotFound(true);
      console.error("Product fetch error:", error);
    }
  });

  // Update product mutation hook
  const [updateProduct, { loading: updateLoading }] = useProductSaveUpdateMutation({
    onCompleted: () => {
      toast.success("Product updated successfully!");
      reset(getValues());
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to update product");
      console.error("Update error:", error);
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    if (typeof data.description === "object") {
      data.description = JSON.stringify(data.description);
    }
    const variables = {
      defaultDomain: domain,
      product: data,
      id: productId,
    };
    updateProduct({ variables });
  };

  const isLoading = useMemo(() => {
    return removeImagesLoading || 
           addImagesLoading || 
           productLoading || 
           updateLoading;
  }, [removeImagesLoading, addImagesLoading, productLoading, updateLoading]);

 
  if (isNotFound) return notFound();

  // if (!data) {
  //   return (
  //     <div className="flex justify-center items-center h-full">
  //       <IoReload className="mr-2 h-4 w-4 animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isLoading && <LoadingElement />}
      <div className="p-5">
        <h1 className="h1">Update Product Details</h1>
        <div className="grid lg:grid-cols-2 gap-4 my-3">
          {/* title , status and description */}
          <GeneralInputs
            register={register}
            handleBlur={handleBlur}
            description={description}
            setValue={setValue}
            control={control}
          />
          {/* images input */}
          <MediaInputs
            selectedImages={mediaImages}
            setSelectedImages={setMediaImages}
            externalLoading={isLoading}
            selectedRemoveImages={selectedRemoveImages}
            setSelectedRemoveImages={setSelectedRemoveImages}
            isEditMode={true}
            removeSelectedImagesUpdate={removeSelectedImages}
          />

          {/* price input */}
          <PriceInput
            register={register}
            currencyCode={storeData?.store?.currencyCode}
            price={price}
            compare={compare}
          />
          <ProductOrganization
            selectedCollections={selectedCollections}
            setSelectedCollections={setSelectedCollections}
            domain={domain}
          />
          {/* seo inputs */}
          <SeoInputs register={register} domain={domain} handle={handle} />

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
          <VariantCard
            watch={watch}
            currencyCode={storeData?.store?.currencyCode}
          />
        </div>
      </div>
      <Button
        size="lg"
        type="submit"
        className="fixed bottom-5 right-5 rounded-full shadow-md"
        disabled={!isDirty}
      >
        {isLoading  && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
        Update
      </Button>
    </form>
  );
}
