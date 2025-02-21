"use client";

import { ProductInput } from "@/codegen/generated";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cardVariants } from "@/utils/cardVariants";
import type { UseFormRegister } from "react-hook-form";

// Define props for the PriceInput component.
interface PriceInputProps {
  register: UseFormRegister<ProductInput>; // Adjust the generic type if you have a specific form type.
  currencyCode: string;
  price: number;
  compare: number;
}

export default function PriceInput({
  register,
  currencyCode,
  price,
  compare,
}: PriceInputProps): JSX.Element {
  // Show warning if price is greater than or equal to compare-at price.
  const showWarning = price > 0 && compare > 0 && price >= compare;

  return (
    <Card className={cardVariants.base}>
      <CardHeader className={cardVariants.header}>
        <h2 className={cardVariants.title}>Pricing</h2>
      </CardHeader>
      <CardContent className={cardVariants.content}>
        <div className="flex justify-items-start gap-2">
          <div>
            <div className="mb-2">
              <Label htmlFor="price">Price</Label>
            </div>
            <div className="flex items-center gap-1">
              <span>{currencyCode}</span>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                step="0.01"
                {...register("firstVariant.price")}
              />
            </div>
          </div>
          <div>
            <div className="mb-2">
              <Label htmlFor="compare">Compare-at price</Label>
            </div>
            <div className="flex items-center gap-1">
              <span>{currencyCode}</span>
              <Input
                id="compare"
                type="number"
                placeholder="0.00"
                step="0.01"
                {...register("firstVariant.compareAtPrice")}
              />
            </div>
          </div>
        </div>
        {showWarning && (
          <p className="text-red-500 my-2">
            Warning: Price should be less than the compare-at price.
          </p>
        )}
        <p className="my-2">
          Please enter the compare price. This price represents the original or
          previous price of the product before any discount.
        </p>
        <div className="max-w-xs">
          <div className="mb-2">
            <Label htmlFor="stock">Stock Quantity</Label>
          </div>
          <Input
            id="stock"
            type="number"
            placeholder="0"
            {...register("firstVariant.stock", { valueAsNumber: true })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
