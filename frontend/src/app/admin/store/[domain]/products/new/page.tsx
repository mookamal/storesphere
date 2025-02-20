"use client";

import { IoReload } from "react-icons/io5";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import PriceInput from "@/components/admin/product/common/PriceInput";
import SeoInputs from "@/components/admin/product/common/SeoInputs";
import OptionInputs from "@/components/admin/product/option/OptionInputs";
import GeneralInputs from "@/components/admin/product/common/GeneralInputs";
import MediaInputs from "@/components/admin/product/common/MediaInputs";
import { Button } from "@/components/ui/button";
import ProductOrganization from "@/components/admin/product/common/ProductOrganization";
import {
  CollectionNode,
  CreateProductMutationMutationVariables,
  ImageNode,
  ProductInput,
  ProductProductStatusChoices,
  useAddMediaImagesProductMutation,
  useCreateProductMutationMutation,
  useSettingsGeneralQuery,
} from "@/codegen/generated";

export default function AddProduct(): JSX.Element {
  const router = useRouter();
  // Casting useParams to expected shape; adjust if necessary.
  const { domain } = useParams() as { domain: string };
  const [selectedCollections, setSelectedCollections] = useState<
    Partial<CollectionNode>[]
  >([]);
  const [selectedImages, setSelectedImages] = useState<any>([]);
  const [selectedRemoveImages, setSelectedRemoveImages] = useState<
    Partial<ImageNode>[]
  >([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<ProductInput>({
    defaultValues: {
      title: "",
      handle: "",
      description: JSON.stringify({
        time: Date.now(),
        blocks: [],
        version: "2.31.0-rc.7",
      }),
      firstVariant: {
        price: "0.00",
        compareAtPrice: "0.00",
        optionValues: [],
        stock: 0,
      },
      status: ProductProductStatusChoices.Draft,
      seo: {
        title: "",
        description: "",
      },
      options: [],
      collectionIds: [],
    },
  });

  const description = watch("description");
  const watchedTitle = watch("title");
  const handleValue = watch("handle");
  const seoTitle = watch("seo.title");
  const price = watch("firstVariant.price");
  const compare = watch("firstVariant.compareAtPrice");

  // Fetch store settings
  const { data: storeData } = useSettingsGeneralQuery({
    variables: { domain },
  });
  // Function to add images to the product
  const [addImages, { loading: addImagesLoading }] =
    useAddMediaImagesProductMutation({
      onCompleted: () => {
        toast.success("Images added to the product successfully!");
      },
      onError: () => {
        toast.error("Failed to add images to the product!");
      },
    });

  // Handle blur event to set default handle and SEO title
  const handleBlur = (): void => {
    if (!handleValue) {
      setValue("handle", watchedTitle.replace(/\s+/g, "-").toLowerCase());
    }
    if (!seoTitle) {
      setValue("seo.title", watchedTitle);
    }
  };

  // Debounced update function (currently a placeholder)
  const debouncedUpdate = debounce((field: string, value: any): void => {
    // Placeholder for debounced update logic
  }, 500);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
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

  const [createProduct, { loading }] = useCreateProductMutationMutation({
    onCompleted: (data) => {
      if (data.createProduct?.product?.productId && selectedImages.length > 0) {
        addImages({
          variables: {
            productId: data.createProduct.product.productId.toString(),
            imageIds: selectedImages.map(
              (img: { imageId: string }) => img.imageId
            ),
            defaultDomain: domain,
          },
        });
      }
      router.push(
        `/store/${domain}/products/${data?.createProduct?.product?.productId}`
      );
      toast.success("Product created successfully!");
    },
    onError: () => {
      toast.error("Failed to create product!");
    },
  });
  // Form submission handler
  const onSubmit: SubmitHandler<ProductInput> = async (data) => {
    if (typeof data.description === "object") {
      data.description = JSON.stringify(data.description);
    }
    // add list of selected collections to the product
    data.collectionIds = selectedCollections
      .map((collection) => collection.collectionId?.toString())
      .filter((id): id is string => id !== undefined);
    const variables: CreateProductMutationMutationVariables = {
      defaultDomain: domain,
      product: data,
    };

    createProduct({ variables });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <h1 className="h1">Add a new product</h1>
        <div className="grid lg:grid-cols-2 gap-4 my-3">
          {/* Title, status, and description inputs */}
          <GeneralInputs
            register={register}
            handleBlur={handleBlur}
            description={description}
            setValue={setValue}
          />
          {/* Images input */}
          <MediaInputs
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            selectedRemoveImages={selectedRemoveImages}
            setSelectedRemoveImages={setSelectedRemoveImages}
            removeSelectedImagesUpdate={async () => {}}
          />
          {/* Price input */}
          <PriceInput
            register={register}
            currencyCode={storeData?.store?.currencyCode}
            price={price}
            compare={compare}
          />
          {/* Product organization */}
          <ProductOrganization
            domain={domain}
            selectedCollections={selectedCollections}
            setSelectedCollections={setSelectedCollections}
          />
          {/* SEO inputs */}
          <SeoInputs register={register} domain={domain} handle={handleValue} />
          {/* Option inputs */}
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
        disabled={loading || addImagesLoading}
      >
        {loading ||
          (addImagesLoading && (
            <IoReload className="mr-2 h-4 w-4 animate-spin" />
          ))}
        Add
      </Button>
    </form>
  );
}
