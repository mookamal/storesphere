"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import LoadingElement from "@/components/LoadingElement";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CREATE_PRODUCT_VARIANT } from "@/graphql/mutations";
import { toast } from "react-toastify";
export default function VariantForm({ currencyCode, watch, onVariantAdded }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [variantPrice, setVariantPrice] = useState(0.0);
  const [variantStock, setVariantStock] = useState(0);
  const productId = useParams().id;
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const options = watch("options");

  const handleSubmit = async () => {
    if (Object.keys(selectedOptions).length === 0) {
      setError("Please select options");
      return;
    }
    setError("");
    setLoading(true);
    const variables = {
      productId: productId,
      variantInputs: {
        price: variantPrice,
        stock: parseInt(variantStock),
        optionValues: Object.values(selectedOptions),
      },
    };
    try {
      const response = await axios.post("/api/set-data", {
        query: CREATE_PRODUCT_VARIANT,
        variables: variables,
      });
      if (response.data.data.createProductVariant.productVariant) {
        onVariantAdded();
        toast.success("Variant created successfully!");
        setVariantPrice(0.0);
        setError(null);
        setSelectedOptions({});
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.error);
      setError(error.response.data.error);
    }
    setLoading(false);
  };
  const handleOptionChange = (optionId, value) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [optionId]: value,
    }));
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {loading && <LoadingElement />}
        <DialogHeader>
          <DialogTitle>Add variant</DialogTitle>
          <hr />
          <VisuallyHidden>
            <DialogDescription>
              Add a new variant to your product. Variants are used to customize
              the appearance and behavior of different products.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex flex-col gap-2">
          {/* v-price */}
          <div>
            <div className="mb-2">
              <Label htmlFor="v-price">Price</Label>
            </div>
            <div className="flex items-center gap-1">
              <span>{currencyCode}</span>
              <Input
                id="v-price"
                name="v-price"
                size="sm"
                type="number"
                step="0.01"
                value={variantPrice}
                onChange={(e) => setVariantPrice(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="mb-2">
              <Label htmlFor="v-stock">Stock</Label>
            </div>

            <Input
              id="v-stock"
              name="v-stock"
              size="sm"
              type="number"
              value={variantStock}
              onChange={(e) => setVariantStock(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            {/* select options */}
            {options.map((option) => (
              <InputSelectOption
                key={option.id}
                option={option}
                onOptionChange={handleOptionChange}
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InputSelectOption({ option, onOptionChange }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const handleOptionChange = (value) => {
    setSelectedValue(value);
    onOptionChange(option.id, value);
  };
  return (
    <div>
      <Select
        onValueChange={(v) => handleOptionChange(v)}
        defaultValue={selectedValue}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`Select a ${option.name}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{option.name}</SelectLabel>
            {option.values?.map((value) => (
              <SelectItem key={value.id} value={value.id}>
                {value.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
