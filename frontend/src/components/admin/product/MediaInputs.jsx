"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import MediaModal from "@/components/admin/product/MediaModal";
import {cardVariants } from "@/utils/cardVariants"
export default function MediaInputs({
  selectedImages,
  setSelectedImages,
  selectedRemoveImages,
  setSelectedRemoveImages,
  isEditMode,
  removeSelectedImagesUpdate,
}) {
  // handleSelectRemoveImages
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
    if (isEditMode) {
      await removeSelectedImagesUpdate();
    } else {
      setSelectedImages(
        selectedImages.filter((item) => !selectedRemoveImages.includes(item))
      );
    }

    setSelectedRemoveImages([]);
  };
  return (
    <Card className={cardVariants.base}>
      <CardHeader className={cardVariants.header}>
        <div className="mb-2">
          {selectedRemoveImages && selectedRemoveImages.length > 0 ? (
            <div className="flex items-center justify-between">
              <h3>{selectedRemoveImages.length} file(s) selected</h3>
              <Button size="ms" onClick={removeSelectedImages}>
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <h2 className={cardVariants.title}>Media</h2>
              <MediaModal
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={cardVariants.content}>
        <div className="flex justify-center">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-sm"
          >
            <CarouselContent>
              {selectedImages.map((image) => (
                <CarouselItem key={image.id} className="basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div
                      className={`flex flex-col items-center gap-1 p-2 ${
                        selectedRemoveImages.some(
                          (selectedImage) => selectedImage.id === image.id
                        )
                          ? "border-2 border-gray-400 shadow-md rounded"
                          : ""
                      }`}
                    >
                      <Checkbox
                        id={image.id}
                        onCheckedChange={(checked) =>
                          handleSelectRemoveImages(image, checked)
                        }
                        checked={selectedRemoveImages.some(
                          (selectedImage) => selectedImage.id === image.id
                        )}
                      />
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${image.image}`}
                        alt={`image-${image.id}`}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
}
