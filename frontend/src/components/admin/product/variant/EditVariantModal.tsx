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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { BiEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import {
  ProductVariantNode,
  useUpdateProductVariantMutation,
} from "@/codegen/generated";
import { useParams } from "next/navigation";
import LoadingElement from "@/components/LoadingElement";

interface EditVariantModalProps {
  variant: ProductVariantNode;
  currencyCode: string;
  onRefetch: () => void;
}

export default function EditVariantModal({
  variant,
  currencyCode,
  onRefetch,
}: EditVariantModalProps): JSX.Element {
  const params = useParams() as { domain: string; id: string };
  const domain = params.domain;
  const productId = params.id;

  const [variantPrice, setVariantPrice] = useState<number>(
    variant.pricing?.amount ?? 0
  );
  const [variantStock, setVariantStock] = useState<number>(variant.stock);
  const [hasChange, setHasChange] = useState<boolean>(false);

  const [updateProductVariant, { loading }] = useUpdateProductVariantMutation({
    onCompleted: () => {
      toast.success("Variant updated successfully");
      onRefetch();
      setHasChange(false);
    },
    onError: (error) => {
      toast.error("Failed to update variant");
    },
  });

  const handleSave = async () => {
    const variables = {
      variantInputs: {
        variantId: variant.variantId ? variant.variantId.toString() : "",
        price: variantPrice,
        stock: variantStock,
      },
      defaultDomain: domain,
      productId: productId,
    };
    updateProductVariant({ variables });
  };

  useEffect(() => {
    if (
      variantPrice !== (variant.pricing?.amount ?? 0) ||
      variantStock !== variant.stock
    ) {
      setHasChange(true);
    } else {
      setHasChange(false);
    }
  }, [variantPrice, variantStock, variant.pricing, variant.stock]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BiEdit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit for ({variant.variantId}) ID</DialogTitle>
          <hr />
          <VisuallyHidden>
            <DialogDescription>
              Edit the details of variant with ID {variant.variantId}
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        {loading && <LoadingElement size="sm" />}
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
              value={variantPrice.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVariantPrice(parseFloat(e.target.value))
              }
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
            value={variantStock.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVariantStock(parseInt(e.target.value, 10))
            }
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
