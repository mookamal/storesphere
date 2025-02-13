"use client";
import { useState, useEffect, useMemo, ChangeEvent } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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
import { Product } from "@/types";

// Generic debounce hook to reduce unnecessary queries during search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Define props for ProductsList component
interface ProductsListProps {
  collectionId: string;
  onUpdate: () => void;
  selectedProducts: Product[];
}

export default function ProductsList({
  collectionId,
  onUpdate,
  selectedProducts,
}: ProductsListProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);
  const { domain } = useParams() as { domain: string };

  // Compute initial set of selected product IDs for comparison
  const initialSelectedIds = useMemo(
    () => new Set(selectedProducts.map((p) => p.productId)),
    [selectedProducts]
  );

  // Local state for selected product IDs
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(initialSelectedIds as Set<string>);

  // Query to fetch products for the collection with search filtering
  const { data, loading, refetch } = useQuery<any>(ADMIN_PRODUCT_RESOURCE_COLLECTION, {
    variables: {
      collectionId,
      search: debouncedSearchTerm,
      first: 20,
      after: "",
    },
  });

  // Define mutations to add and remove products from the collection
  const [addProducts] = useMutation<any>(ADD_PRODUCTS_TO_COLLECTION);
  const [removeProducts] = useMutation<any>(DELETE_PRODUCTS_FROM_COLLECTION);

  // Function to perform bulk update (add/remove) of products
  const handleBulkUpdate = async (productsToAdd: string[], productsToRemove: string[]): Promise<void> => {
    try {
      const promises: Promise<any>[] = [];
      if (productsToAdd.length > 0) {
        promises.push(
          addProducts({
            variables: {
              collectionId,
              productIds: productsToAdd,
              domain,
            },
          })
        );
      }
      if (productsToRemove.length > 0) {
        promises.push(
          removeProducts({
            variables: {
              collectionId,
              productIds: productsToRemove,
              domain,
            },
          })
        );
      }
      await Promise.all(promises);
      onUpdate(); // Trigger parent update after mutations
      toast.success("Collection updated successfully");
      setOpen(false);
    } catch (error: any) {
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
          <VisuallyHidden>
            <DialogDescription>
              Select the products you want to add or remove from the collection.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        {/* Input for searching products */}
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />

        {/* Display list of products */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : (
            data?.productResourceCollection?.edges?.map(({ node }: { node: Product }) => (
              <ProductItem
                key={node.productId}
                product={node}
                isSelected={selectedProductIds.has(node.productId as string)}
                onToggle={(productId: string, isSelected: boolean) => {
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
              const toRemove = initialIds.filter((id) => !currentIds.includes(id as string));
              handleBulkUpdate(toAdd, toRemove as string[]);
            }}
            disabled={
              (() => {
                const currentIds = Array.from(selectedProductIds);
                const initialIds = Array.from(initialSelectedIds);
                return (
                  currentIds.filter((id) => !initialIds.includes(id as string)).length === 0 &&
                  initialIds.filter((id) => !currentIds.includes(id as string)).length === 0
                );
              })()
            }
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Props for the ProductItem component
interface ProductItemProps {
  product: Product;
  isSelected: boolean;
  onToggle: (productId: string, isSelected: boolean) => void;
}

// Sub-component to render individual product items with a checkbox
const ProductItem = ({ product, isSelected, onToggle }: ProductItemProps): JSX.Element => (
  <div className="flex items-center gap-3 p-2 border rounded">
    <Checkbox
      checked={isSelected}
      onCheckedChange={(checked: boolean) => onToggle(product.productId as string, checked)}
    />
    <div className="flex-1">
      <p className="font-medium">{product.title}</p>
      <p className="text-sm text-gray-500">{product.status}</p>
    </div>
  </div>
);
