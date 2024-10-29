// components/PriceInput.js
import { TextInput, Label } from "flowbite-react";

export default function PriceInput({
  register,
  currencyCode,
  defaultPrice = 0,
  defaultCompare = 0,
}) {
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
            defaultValue={defaultPrice}
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
            defaultValue={defaultCompare}
            {...register("compare")}
          />
        </div>
      </div>
      <p>
        Please enter the compare price. This price represents the original or
        previous price of the product before any discount.
      </p>
    </div>
  );
}
