"use client";

import { Button } from "@/components/ui/button";
import { IoReload } from "react-icons/io5";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
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
  GetMediaProductQueryVariables,
  GetProductByIdQueryVariables,
} from "@/codegen/generated";
import { stripTypename } from "@apollo/client/utilities";
export default function UpdateProduct() {
  const params = useParams() as { domain: string; id: string };
  const domain = params.domain;
  const productId = params.id;
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    trigger,
    control,
    formState: { errors, isDirty },
    watch,
  } = useForm<ProductInput>();
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
    ...(options?.[index] || {}),
  }));
  const [mediaImages, setMediaImages] = useState<any>([]);
  const [copyMediaImages, setCopyMediaImages] = useState<any>([]);
  const [selectedRemoveImages, setSelectedRemoveImages] = useState<any>([]);

  const { data: storeData } = useSettingsGeneralQuery({
    variables: { domain },
  });
  const [removeImages, { loading: removeImagesLoading }] =
    useRemoveMediaImagesProductMutation({
      onCompleted: () => {
        const updatedImages = mediaImages.filter(
          (img: any) =>
            !selectedRemoveImages.some((removed: any) => removed.id === img.id)
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
          imageIds: selectedRemoveImages.map((item: any) => item.id),
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

  const addImages = async (productId: string) => {
    if (productId && mediaImages.length > 0) {
      await addMediaImages({
        variables: {
          productId,
          imageIds: mediaImages.map((item: any) => item.id),
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
    } as GetMediaProductQueryVariables,
    skip: !productId || !domain,
    onCompleted: (data) => {
      if (data?.getImagesProduct?.edges) {
        const formattedImages = data.getImagesProduct.edges?.map((edge) => ({
          id: edge?.node?.imageId,
          imageId: edge?.node?.imageId,
          image: edge?.node?.image,
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
  const {
    data: product,
    loading: productLoading,
    refetch,
  } = useGetProductByIdQuery({
    variables: {
      id: productId,
      domain: domain,
    } as GetProductByIdQueryVariables,
    skip: !productId || !domain,
    onCompleted: (data) => {
      // set product to form
      if (data?.product) {
        reset({
          title: data.product.title || "",
          description: data.product.description || "",
          status: data.product.status || ProductProductStatusChoices.Draft,
          handle: data.product.handle || "",
          options: stripTypename(data.product.options) || [],
          seo: {
            title: data.product.seo?.title || "",
            description: data.product.seo?.description || "",
          },
          firstVariant: {
            price: data.product.firstVariant?.pricing?.amount || 0,
            compareAtPrice: data.product.firstVariant?.compareAtPrice || 0,
            stock: data.product.firstVariant?.stock || 0,
          },
          collectionIds:
            data.product.collections?.map((collection) =>
              String(collection?.collectionId)
            ) || [],
        });
      }
    },
    onError: (error) => {
      toast.error("Failed to fetch product details");
      setIsNotFound(true);
      console.error("Product fetch error:", error);
    },
  });

  // Update product mutation hook
  const [updateProduct, { loading: updateLoading }] =
    useProductSaveUpdateMutation({
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
  const onSubmit: SubmitHandler<ProductInput> = async (data) => {
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
    return (
      removeImagesLoading || addImagesLoading || productLoading || updateLoading
    );
  }, [removeImagesLoading, addImagesLoading, productLoading, updateLoading]);

  if (isNotFound) return notFound();

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
            selectedRemoveImages={selectedRemoveImages}
            setSelectedRemoveImages={setSelectedRemoveImages}
            isEditMode={true}
            removeSelectedImagesUpdate={removeSelectedImages}
          />

          {/* price input */}
          <PriceInput
            register={register}
            currencyCode={storeData?.store?.currencyCode as string}
            price={price}
            compare={compare}
          />
          <ProductOrganization
            domain={domain}
            register={register}
            setValue={setValue}
            watch={watch}
          />
          {/* seo inputs */}
          <SeoInputs
            register={register}
            domain={domain}
            handle={handle as string}
          />

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
            currencyCode={storeData?.store?.currencyCode as string}
            control={control}
          />
        </div>
      </div>
      <Button
        size="lg"
        type="submit"
        className="fixed bottom-5 right-5 rounded-full shadow-md"
        disabled={!isDirty}
      >
        {isLoading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
        Update
      </Button>
    </form>
  );
}
