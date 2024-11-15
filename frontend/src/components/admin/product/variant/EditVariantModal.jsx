"use client";
import { useEffect, useState } from "react";
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
import LoadingElement from "@/components/LoadingElement";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { BiEdit } from "react-icons/bi";
export default function EditVariantModal({ variant, currencyCode }) {
  const [loading, setLoading] = useState(false);
  const [hasChange, setHasChange] = useState(false);
  const [variantPrice, setVariantPrice] = useState(variant.price);
  const handleSave = async () => {};

  useEffect(() => {
    if (variantPrice !== variant.price) {
      setHasChange(true);
    } else {
      setHasChange(false);
    }
  }, [variantPrice]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BiEdit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        {loading && <LoadingElement />}
        <DialogHeader>
          <DialogTitle>Edit for ({variant.variantId}) ID</DialogTitle>
          <hr />
          <VisuallyHidden>
            <DialogDescription>
              Edit the details of variant with ID {variant.variantId}
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
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
        <DialogFooter>
          <Button type="button" disabled={!hasChange} onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
