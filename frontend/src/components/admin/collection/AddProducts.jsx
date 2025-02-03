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
import { cardVariants } from "@/utils/cardVariants";
import { useParams } from "next/navigation";
import DataTable from "@/components/common/CustomDataTable";
import { productColumns } from "@/utils/tableColumns/productColumns";
export default function AddProducts({
  collectionId,
  selectedProducts,
  refetchProducts,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const domain = useParams().domain;
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
          domain: domain,
        },
      });
      if (response.data.data.deleteProductsFromCollection.success) {
        await refetchProducts();
        toast.success("Product removed successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className={`${cardVariants.base} w-full md:w-[60%]`}>
      <CardHeader className={cardVariants.header}>
        <div className="flex justify-between items-center w-full">
          <h2 className={cardVariants.title}>Products</h2>
          <ProductsList
            collectionId={collectionId}
            refetchProducts={refetchProducts}
            selectedProducts={selectedProducts}
          />
        </div>
      </CardHeader>
      <CardContent className={cardVariants.content}>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <AiOutlineLoading className="animate-spin text-3xl" />
          </div>
        ) : selectedProducts.length > 0 ? (
          <DataTable
            columns={productColumns}
            data={selectedProducts}
            actions={[
              {
                label: "Remove",
                type: "delete",
                onClick: (product) => handleRemoveProduct(product.productId),
              },
            ]}
          />
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
