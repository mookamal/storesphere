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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function VariantForm({ currencyCode, watch }) {
  const [loading, setLoading] = useState(false);
  const [variantPrice, setVariantPrice] = useState(0.0);
  const [optionValues, setOptionValues] = useState([]);
  const [error, setError] = useState(null);
  const options = watch("options");

  const handleSubmit = async () => {
    setLoading(true);
    if (optionValues.length == 0) {
      setError("Please select at least one option value.");
      setLoading(false);
      return;
    }
    // Add variant to the product
  };
  return (
    <Dialog>
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
          <div className="flex flex-col gap-2 items-center justify-center">
            {/* select options */}
            {options.map((option) => (
              <InputSelectOption key={option.id} option={option} />
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

function InputSelectOption({ option }) {
  return (
    <div>
      <Select>
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
