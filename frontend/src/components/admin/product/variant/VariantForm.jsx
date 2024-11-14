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
export default function VariantForm({ currencyCode }) {
  const [variantPrice, setVariantPrice] = useState(0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
                placeholder="0.00"
                step="0.01"
                value={variantPrice}
                onChange={(e) => setVariantPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
