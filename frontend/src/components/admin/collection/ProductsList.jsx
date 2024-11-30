"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ADMIN_PRODUCT_RESOURCE_COLLECTION } from "@/graphql/queries";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProductsList({
  collectionId,
  selectedProducts,
  setSelectedProducts,
}) {
  const [loadingData, setLoadingData] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSelectProduct = (product) => {
    const newSelectedProducts = selectedProducts.some(
      (p) => p.id === product.id
    )
      ? selectedProducts.filter((p) => p.id !== product.id)
      : [...selectedProducts, product];
    setSelectedProducts(newSelectedProducts);
  };

  const getProducts = async () => {
    setLoadingData(true);
    try {
      const response = await axios.post("/api/get-data", {
        query: ADMIN_PRODUCT_RESOURCE_COLLECTION,
        variables: {
          search: searchQuery,
          first: 10,
          after: "",
          collectionId: collectionId,
        },
      });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setProducts(response.data.productResourceCollection.edges);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };
  useEffect(() => {
    getProducts();
  }, [searchQuery]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          Browse
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Products list</DialogTitle>
          <DialogDescription>
            This dialog displays a list of products.
          </DialogDescription>
        </DialogHeader>
        <hr />
        <div className="flex justify-center flex-col items-center">
          <Input
            type="text"
            placeholder="Search products"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="h-[400px] overflow-y-scroll p-2 flex flex-col gap-2 ">
          {loadingData ? (
            <div className="text-center">Loading...</div>
          ) : products.length > 0 ? (
            products.map(({ node }) => (
              <div key={node.id} className="border p-2 rounded">
                <div className="flex items-center gap-2">
                  <Checkbox
                    onCheckedChange={(isChecked) =>
                      handleSelectProduct(node, isChecked)
                    }
                    checked={selectedProducts.some((p) => p.id === node.id)}
                  />

                  <h2>{node.title}</h2>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">No products found.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
