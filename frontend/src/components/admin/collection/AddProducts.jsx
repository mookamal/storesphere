"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MdCancel } from "react-icons/md";
import { TbDatabaseExclamation } from "react-icons/tb";
import ProductsList from "./ProductsList";
import { DELETE_PRODUCTS_FROM_COLLECTION } from "@/graphql/mutations";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
export default function AddProducts({
  collectionId,
  selectedProducts,
  refetchProducts,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleRemoveProduct = async (productId) => {
    await deleteProductFromCollection(productId);
  };
  const deleteProductFromCollection = async (productId) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/set-data", {
        query: DELETE_PRODUCTS_FROM_COLLECTION,
        variables: {
          collectionId: collectionId,
          productIds: [productId],
        },
      });
      if (response.data.data.deleteProductsFromCollection.success) {
        await refetchProducts(collectionId);
        toast.success("Product removed successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="card w-full md:w-[60%]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2>Products</h2>
          <ProductsList
            collectionId={collectionId}
            refetchProducts={refetchProducts}
            selectedProducts={selectedProducts}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <AiOutlineLoading className="animate-spin text-3xl" />
          </div>
        ) : selectedProducts.length > 0 ? (
          selectedProducts.map((product) => (
            <Card key={product.id} className="p-2">
              <div className="flex justify-between items-center">
                <h2>{product.title}</h2>
                <Badge
                  variant={
                    product.status === "ACTIVE" ? "default" : "destructive"
                  }
                >
                  {product.status}
                </Badge>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveProduct(product.productId)}
                >
                  <MdCancel />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <TbDatabaseExclamation className="text-[50px]" />
            <h2>
              There are no products in this collection. Click browse to add
              products.
            </h2>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
