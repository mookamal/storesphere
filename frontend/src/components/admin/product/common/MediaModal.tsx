"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { IoCloudUploadOutline } from "react-icons/io5";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageNode, useGetMediaImagesQuery } from "@/codegen/generated";
import LoadingElement from "@/components/LoadingElement";
// Removed incorrect import

// Define props for the MediaModal component.
interface MediaModalProps {
  selectedImages: Partial<ImageNode>[];
  setSelectedImages: React.Dispatch<React.SetStateAction<any[]>>;
  externalLoading: boolean;
  disabled?: boolean;
}

export default function MediaModal({
  selectedImages,
  setSelectedImages,
  externalLoading,
  disabled = false,
}: MediaModalProps): JSX.Element {
  // Get domain from URL parameters.
  const params = useParams();
  const domain = params.domain as string;

  const [loading, setLoading] = useState<boolean>(false);

  // Use the generated hook to fetch media images.
  const {
    data,
    loading: loadingImages,
    fetchMore,
    refetch,
  } = useGetMediaImagesQuery({
    variables: { domain, first: 10, after: "" },
  });

  // Compute current endCursor and hasNextPage from the query data.
  const currentEndCursor = data?.allMediaImages?.pageInfo?.endCursor ?? "";
  const hasNextPage = data?.allMediaImages?.pageInfo?.hasNextPage ?? false;

  // Function to upload an image file.
  const uploadImage = async (selectedFile: File): Promise<void> => {
    const allowedExtensions = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
    ];
    if (!selectedFile) return;
    if (!allowedExtensions.includes(selectedFile.type)) {
      toast.error(
        "Invalid file type. Only JPEG, PNG, SVG, and GIF are allowed."
      );
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("domain", domain);
    try {
      const response = await axios.post("/api/product/upload-image", formData);
      if (response.statusText === "OK") {
        const image = response.data;
        setSelectedImages([
          ...selectedImages,
          {
            id: image.id,
            imageId: image.id,
            image: image.image,
          },
        ]);
        toast.success("Image uploaded successfully!");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
    setLoading(false);
  };

  // Handle checkbox change to select or deselect an image.
  const handleCheckboxChange = (
    image: { imageId: string | number; image: string },
    isChecked: boolean
  ): void => {
    if (isChecked) {
      // Prevent duplicate selection.
      const isAlreadySelected = selectedImages.some(
        (selectedImage) =>
          selectedImage.id === image.imageId ||
          selectedImage.imageId === image.imageId
      );
      if (!isAlreadySelected) {
        setSelectedImages((prevSelectedImages) => [
          ...prevSelectedImages,
          {
            id: image.imageId,
            imageId: image.imageId,
            image: image.image,
          },
        ]);
      }
    } else {
      // Remove the image from selection.
      setSelectedImages((prevSelectedImages) =>
        prevSelectedImages.filter(
          (selectedImage) =>
            selectedImage.id !== image.imageId &&
            selectedImage.imageId !== image.imageId
        )
      );
    }
  };

  // Handler to load more images using fetchMore from the generated query.
  const handleLoadMore = async (): Promise<void> => {
    if (fetchMore) {
      await fetchMore({
        variables: { after: currentEndCursor },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (
            !previousResult?.allMediaImages ||
            !fetchMoreResult?.allMediaImages
          ) {
            return previousResult;
          }
          return {
            allMediaImages: {
              __typename: previousResult.allMediaImages.__typename,
              edges: [
                ...previousResult.allMediaImages.edges,
                ...fetchMoreResult.allMediaImages.edges,
              ],
              pageInfo: fetchMoreResult.allMediaImages.pageInfo,
            },
          };
        },
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ variant: "outline" })}
        disabled={disabled}
      >
        <IoCloudUploadOutline />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select file</DialogTitle>
          <hr />
          <VisuallyHidden>
            <DialogDescription>Select file</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        {(externalLoading || loading || loadingImages) && <LoadingElement />}
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-center">
            <Label
              htmlFor="dropzone-file"
              className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pb-4 pt-3">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF
                </p>
              </div>
              <Input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  e.target.files && uploadImage(e.target.files[0])
                }
              />
            </Label>
          </div>
        </div>

        {data && data.allMediaImages && (
          <div className="grid grid-rows-1 grid-flow-col gap-4 overflow-x-auto p-4">
            {data.allMediaImages.edges
              .filter((edge): edge is NonNullable<typeof edge> => Boolean(edge))
              .map((edge) => {
                const image = edge.node;
                if (!image || !image.imageId || !image.image) return null;
                return (
                  <div
                    key={String(image.imageId)}
                    className="flex items-center space-x-4"
                  >
                    <Checkbox
                      id={String(image.imageId)}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(
                          {
                            imageId: image.imageId ?? "",
                            image: image.image,
                          },
                          checked
                        )
                      }
                      checked={selectedImages.some(
                        (selectedImage) =>
                          selectedImage.id === image.imageId ||
                          selectedImage.imageId === image.imageId
                      )}
                    />
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/media/${image.image}`}
                      alt={`image-${image.imageId}`}
                      className="max-h-16 max-w-20 rounded-lg object-cover"
                    />
                  </div>
                );
              })}
          </div>
        )}

        <Button
          size="sm"
          className="my-2"
          disabled={!hasNextPage}
          onClick={handleLoadMore}
        >
          Load more
        </Button>
      </DialogContent>
    </Dialog>
  );
}
