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
export default function VariantForm({ currencyCode }) {
  const [loading, setLoading] = useState(false);
  const [variantPrice, setVariantPrice] = useState(0.0);
  const [optionValues, setOptionValues] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    console.log("optionValues", optionValues);
    if (optionValues.length == 0) {
      setError("Please select at least one option value");
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
