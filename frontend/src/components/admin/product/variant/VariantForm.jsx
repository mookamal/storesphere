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
import { safeParseNumber } from "@/utils/dataTransformers";
import { useWatch } from "react-hook-form";
import { useCreateProductVariantMutation } from "@/codegen/generated";
export default function VariantForm({ currencyCode, control, onVariantAdded }) {
  const [open, setOpen] = useState(false);
  const [variantPrice, setVariantPrice] = useState(0.0);
  const [variantStock, setVariantStock] = useState(0);
  const productId = useParams().id;
  const domain = useParams().domain;
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const options = useWatch({
    control,
    name: "options",
    defaultValue: [],
  });
  const [createProductVariant, { loading }] = useCreateProductVariantMutation({
    onCompleted: () => {
      onVariantAdded();
      toast.success("Variant created successfully!");
      setVariantPrice(0.0);
      setSelectedOptions({});
      setOpen(false);
    },
    onError: (error) => {
      toast.error(`Operation failed: ${error.message}`);
    },
  });
  const handleSubmit = async () => {
    if (Object.keys(selectedOptions).length === 0) {
      setError("Please select options");
      return;
    }

    const variables = {
      productId: productId,
      variantInputs: {
        price: safeParseNumber(variantPrice),
        stock: safeParseNumber(variantStock),
        optionValues: Object.values(selectedOptions),
      },
      defaultDomain: domain,
    };
    createProductVariant({
      variables,
    });
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
