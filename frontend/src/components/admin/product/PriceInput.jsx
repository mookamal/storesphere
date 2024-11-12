"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PriceInput({ register, currencyCode, price, compare }) {
  const showWarning = price > 0 && compare > 0 && price >= compare;

  return (
    <Card className="card">
      <CardHeader>
        <h2>Pricing</h2>
      </CardHeader>
      <CardContent>
        <div className="flex justify-items-start gap-2">
          <div>
            <div className="mb-2">
              <Label htmlFor="price">Price</Label>
            </div>
            <Input
              id="price"
              size="sm"
              addon={currencyCode}
              type="number"
              placeholder="0.00"
              {...register("price")}
            />
          </div>
          <div>
            <div className="mb-2">
              <Label htmlFor="compare">Compare-at price</Label>
            </div>
            <Input
              id="compare"
              size="sm"
              addon={currencyCode}
              type="number"
              placeholder="0.00"
              {...register("compare")}
            />
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
      </CardContent>
    </Card>
  );
}
