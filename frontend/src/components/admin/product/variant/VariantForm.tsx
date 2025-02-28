"use client";
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
import { toast } from "react-toastify";
import { safeParseNumber } from "@/utils/dataTransformers";
import { useWatch } from "react-hook-form";
import { useCreateProductVariantMutation } from "@/codegen/generated";
import type { Control } from "react-hook-form";
import type { ProductInput, ProductOptionType } from "@/codegen/generated";

interface VariantFormProps {
  currencyCode: string;
  control: Control<ProductInput>;
  onVariantAdded: () => void;
}

export default function VariantForm({
  currencyCode,
  control,
  onVariantAdded,
}: VariantFormProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [variantPrice, setVariantPrice] = useState<number>(0.0);
  const [variantStock, setVariantStock] = useState<number>(0);
  const { id: productId, domain } = useParams() as {
    id: string;
    domain: string;
  };
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

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

  const handleSubmit = async (): Promise<void> => {
    if (Object.keys(selectedOptions).length === 0) {
      setError("Please select options");
      return;
    }
    setError(null);
    const variables = {
      productId: productId,
      variantInputs: {
        price: safeParseNumber(variantPrice),
        stock: safeParseNumber(variantStock),
        optionValues: Object.values(selectedOptions),
      },
      defaultDomain: domain,
    };
    createProductVariant({ variables });
  };

  const handleOptionChange = (
    optionId: string | number,
    value: string
  ): void => {
    setSelectedOptions((prev) => ({
      ...prev,
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
          {/* Price input */}
          <div>
            <div className="mb-2">
              <Label htmlFor="v-price">Price</Label>
            </div>
            <div className="flex items-center gap-1">
              <span>{currencyCode}</span>
              <Input
                id="v-price"
                name="v-price"
                type="number"
                step="0.01"
                value={variantPrice}
                onChange={(e) => setVariantPrice(parseFloat(e.target.value))}
              />
            </div>
          </div>
          {/* Stock input */}
          <div>
            <div className="mb-2">
              <Label htmlFor="v-stock">Stock</Label>
            </div>
            <Input
              id="v-stock"
              name="v-stock"
              type="number"
              value={variantStock}
              onChange={(e) => setVariantStock(parseInt(e.target.value, 10))}
            />
          </div>
          {/* Option selectors */}
          <div className="flex flex-col gap-2 items-center justify-center">
            {options?.map((option) => (
              <InputSelectOption
                key={option?.id}
                option={option as ProductOptionType}
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

interface InputSelectOptionProps {
  option: ProductOptionType;
  onOptionChange: (optionId: string | number, value: string) => void;
}

function InputSelectOption({
  option,
  onOptionChange,
}: InputSelectOptionProps): JSX.Element {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleOptionChangeLocal = (value: string): void => {
    setSelectedValue(value);
    onOptionChange(option.id, value);
  };

  return (
    <div>
      <Select
        onValueChange={(v) => handleOptionChangeLocal(v)}
        defaultValue={selectedValue || ""}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`Select a ${option.name}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{option.name}</SelectLabel>
            {option.values?.map((value) => (
              <SelectItem key={value?.id} value={String(value?.id)}>
                {value?.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
