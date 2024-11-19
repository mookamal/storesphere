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
import axios from "axios";
import { UPDATE_PRODUCT_VARIANT } from "@/graphql/mutations";
import { toast } from "react-toastify";
export default function EditVariantModal({ variant, currencyCode, onRefetch }) {
  const [loading, setLoading] = useState(false);
  const [hasChange, setHasChange] = useState(false);
  const [variantPrice, setVariantPrice] = useState(variant.price);
  const [variantStock, setVariantStock] = useState(variant.stock);
  const handleSave = async () => {
    setLoading(true);
    const variables = {
      variantInputs: {
        variantId: variant.variantId,
        price: variantPrice,
        stock: parseInt(variantStock),
      },
    };
    try {
      // Update variant
      const response = await axios.post("/api/set-data", {
        query: UPDATE_PRODUCT_VARIANT,
        variables: variables,
      });
      if (response.data.data.updateProductVariant.productVariant) {
        toast.success("Variant updated successfully!");
        // refetch variants
        onRefetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update variant");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (variantPrice !== variant.price || variantStock !== variant.stock) {
      setHasChange(true);
    } else {
      setHasChange(false);
    }
  }, [variantPrice, variantStock]);

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
        <DialogFooter>
          <Button type="button" disabled={!hasChange} onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
