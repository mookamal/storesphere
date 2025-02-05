"use client";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ADMIN_PRODUCT_RESOURCE_COLLECTION } from "@/graphql/queries";
import {
  ADD_PRODUCTS_TO_COLLECTION,
  DELETE_PRODUCTS_FROM_COLLECTION,
} from "@/graphql/mutations";
import { useParams } from "next/navigation";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function ProductsList({
  collectionId,
  onUpdate,
  selectedProducts,
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const domain = useParams().domain;

  // Get initial selected product IDs
  const initialSelectedIds = useMemo(
    () => new Set(selectedProducts.map((p) => Number(p.productId))),
    [selectedProducts]
  );

  // Local selection state
  const [selectedProductIds, setSelectedProductIds] =
    useState(initialSelectedIds);

  // Query products
  const { data, loading, refetch } = useQuery(
    ADMIN_PRODUCT_RESOURCE_COLLECTION,
    {
      variables: {
        collectionId,
        search: debouncedSearchTerm,
        first: 20,
        after: "",
      },
    }
  );

  // Mutations
  const [addProducts] = useMutation(ADD_PRODUCTS_TO_COLLECTION);
  const [removeProducts] = useMutation(DELETE_PRODUCTS_FROM_COLLECTION);

  const handleBulkUpdate = async (productsToAdd, productsToRemove) => {
    try {
      const promises = [];
      if (productsToAdd.length > 0) {
        promises.push(
          addProducts({
            variables: {
              collectionId,
              productIds: productsToAdd,
              domain: domain,
            },
          })
        );
      }
      if (productsToRemove.length > 0) {
        promises.push(
          removeProducts({
            variables: { collectionId, productIds: productsToRemove },
          })
        );
      }
      await Promise.all(promises);
      onUpdate();
      toast.success("Collection updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Products</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Collection Products</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : (
            data?.productResourceCollection?.edges?.map(({ node }) => (
              <ProductItem
                key={node.productId}
                product={node}
                isSelected={selectedProductIds.has(node.productId)}
                onToggle={(productId, isSelected) => {
                  setSelectedProductIds((prev) => {
                    const next = new Set(prev);
                    isSelected ? next.add(productId) : next.delete(productId);
                    return next;
                  });
                }}
              />
            ))
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              const currentIds = Array.from(selectedProductIds);
              const initialIds = Array.from(initialSelectedIds);
              const toAdd = currentIds.filter((id) => !initialIds.includes(id));
              const toRemove = initialIds.filter(
                (id) => !currentIds.includes(id)
              );
              handleBulkUpdate(toAdd, toRemove);
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const ProductItem = ({ product, isSelected, onToggle }) => (
  <div className="flex items-center gap-3 p-2 border rounded">
    <Checkbox
      checked={isSelected}
      onCheckedChange={(checked) => onToggle(product.productId, checked)}
    />
    <div className="flex-1">
      <p className="font-medium">{product.title}</p>
      <p className="text-sm text-gray-500">{product.status}</p>
    </div>
  </div>
);
