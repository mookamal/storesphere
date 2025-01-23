"use client";

import React, { useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2, ImagePlus } from 'lucide-react';
import { cardVariants } from "@/utils/cardVariants";
import MediaModal from "@/components/admin/product/common/MediaModal";

export default function MediaInputs({
  selectedImages = [],
  setSelectedImages,
  selectedRemoveImages = [],
  setSelectedRemoveImages,
  isEditMode = false,
  removeSelectedImagesUpdate,
  maxImages = 10
}) {
  const handleSelectRemoveImages = useCallback((image, isChecked) => {
    setSelectedRemoveImages(prev => 
      isChecked 
        ? [...prev, image]
        : prev.filter(item => item.id !== image.id)
    );
  }, [setSelectedRemoveImages]);

  const removeSelectedImages = useCallback(async () => {
    if (isEditMode && removeSelectedImagesUpdate) {
      await removeSelectedImagesUpdate();
    } else {
      setSelectedImages(prev => 
        prev.filter(item => !selectedRemoveImages.some(remove => remove.id === item.id))
      );
    }
    setSelectedRemoveImages([]);
  }, [isEditMode, removeSelectedImagesUpdate, selectedRemoveImages, setSelectedImages, setSelectedRemoveImages]);

  const canAddMoreImages = useMemo(() => 
    selectedImages.length < maxImages, 
    [selectedImages, maxImages]
  );

  return (
    <Card className={`${cardVariants.base} relative`}>
      <CardHeader className={cardVariants.header}>
        <div className="flex items-center justify-between w-full">
          {selectedRemoveImages.length > 0 ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedRemoveImages.length} images selected
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={removeSelectedImages}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove selected images</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full">
              <h2 className={cardVariants.title}>Media</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MediaModal
                      selectedImages={selectedImages}
                      setSelectedImages={setSelectedImages}
                      disabled={!canAddMoreImages}
                    />
                  </TooltipTrigger>
                  {!canAddMoreImages && (
                    <TooltipContent>
                      <p>Maximum images limit reached</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={cardVariants.content}>
        {selectedImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-600">
            <ImagePlus size={48} />
            <p className="mt-2 text-sm">No images added yet</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <Carousel
              opts={{ align: "start" }}
              className="w-full max-w-sm"
            >
              <CarouselContent>
                {selectedImages.map((image) => (
                  <CarouselItem 
                    key={image.id || image.imageId} 
                    className="basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1 group">
                      <div
                        className={`
                          flex flex-col items-center gap-2 p-2 rounded-lg transition-all 
                          ${selectedRemoveImages.some(selectedImage => 
                            selectedImage.id === image.id || 
                            selectedImage.id === image.imageId
                          ) 
                            ? 'border-2 border-red-400 bg-red-50/20 dark:bg-red-950/20' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }
                        `}
                      >
                        <Checkbox
                          id={`remove-${image.id || image.imageId}`}
                          onCheckedChange={(checked) => handleSelectRemoveImages(image, checked)}
                          checked={selectedRemoveImages.some(selectedImage => 
                            selectedImage.id === image.id || 
                            selectedImage.id === image.imageId
                          )}
                        />
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/media/${image.image}`}
                          alt={`image-${image.id || image.imageId}`}
                          className="h-24 w-24 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
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
        )}
      </CardContent>

      {!canAddMoreImages && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs dark:bg-yellow-900/50 dark:text-yellow-300">
          Max Limit
        </div>
      )}
    </Card>
  );
}
