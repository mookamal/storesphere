import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import MediaModal from "./MediaModal";
import { Button } from "@/components/ui/button";
import { cardVariants } from "@/utils/cardVariants";
import React from "react";

// Define interface for component props
interface GeneralInputsProps {
  register: any;
  handleBlur: React.FocusEventHandler<HTMLInputElement>;
  setImage: (image: any) => void;
  image: any;
  errors?: any;
}

export default function GeneralInputs({
  register,
  handleBlur,
  setImage,
  image,
  errors = {},
}: GeneralInputsProps): JSX.Element {
  return (
    <Card className={`${cardVariants.base} w-full md:w-[60%]`}>
      <CardHeader className={cardVariants.header}>
        <h2 className={cardVariants.title}>General information</h2>
      </CardHeader>
      <CardContent className={cardVariants.content}>
        <div>
          <div>
            <div className="mb">
              {/* Label for the title input */}
              <Label htmlFor="title">Title</Label>
            </div>
            <Input
              id="title"
              type="text"
              {...register("title")}
              onBlur={handleBlur}
              placeholder="Collection title (e.g., Men's Clothing)"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div>
            <div className="mb">
              {/* Label for the description textarea */}
              <Label htmlFor="description">Description</Label>
            </div>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto w-[120px] h-[100px] border rounded mt-4 flex justify-center items-center shadow-md relative group">
          {image ? (
            <>
              {/* Display the selected image */}
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/media/${image.image}`}
                width={120}
                height={100}
                className="shadow-md border rounded"
                alt="Picture"
              />
              <Button
                onClick={() => setImage(null)}
                variant="outline"
                type="button"
                className="absolute inset-0 flex items-center justify-center bg-opacity-100 opacity-0 group-hover:opacity-100 transition-opacity rounded"
              >
                Delete
              </Button>
            </>
          ) : (
            // If no image is selected, show the MediaModal component
            <MediaModal setImage={setImage} />
          )}
        </div>
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
      </CardContent>
    </Card>
  );
}
