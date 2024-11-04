"use client";
import { TextInput, Label } from "flowbite-react";

export default function PriceInput({ register, currencyCode, price, compare }) {
  const showWarning = price > 0 && compare > 0 && price >= compare;

  return (
    <div className="card p-3 flex flex-col h-full">
      <h2>Pricing</h2>
      <div className="flex justify-items-start my-5 gap-2">
        <div>
          <div className="mb-2">
            <Label htmlFor="price" value="Price" />
          </div>
          <TextInput
            id="price"
            sizing="sm"
            addon={currencyCode}
            type="number"
            placeholder="0.00"
            {...register("price")}
          />
        </div>
        <div>
          <div className="mb-2">
            <Label htmlFor="compare" value="Compare-at price" />
          </div>
          <TextInput
            id="compare"
            sizing="sm"
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
      <p>
        Please enter the compare price. This price represents the original or
        previous price of the product before any discount.
      </p>
    </div>
  );
}
