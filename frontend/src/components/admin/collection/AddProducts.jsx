"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TbDatabaseExclamation } from "react-icons/tb";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";
import { DELETE_PRODUCTS_FROM_COLLECTION } from "@/graphql/mutations";
import ProductsList from "@/components/admin/collection/ProductsList";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { useParams } from "next/navigation";
import DataTable from "@/components/common/CustomDataTable";

// Move to src/utils/tableColumns/productColumns.js
const productColumns = [
  {
    id: "title",
    header: "Product Name",
    cell: ({ row }) => row.original.title,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => row.original.status,
  },
];

export default function AddProducts({
  collectionId,
  selectedProducts,
  refetchProducts,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const domain = useParams().domain;
  // Mutation handling with optimistic updates
  const [deleteProduct] = useOptimisticMutation(
    DELETE_PRODUCTS_FROM_COLLECTION,
    {
      optimisticUpdate: (variables) => {
        // Add optimistic UI update logic here
      },
      onError: (error) => {
        toast.error(`Operation failed: ${error.message}`);
      },
      onSuccess: () => {
        toast.success("Product removed successfully!");
        refetchProducts();
      },
    }
  );

  const handleRemove = async (productId) => {
    setIsProcessing(true);
    try {
      await deleteProduct({
        collectionId,
        productIds: [productId],
        domain: domain,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full md:w-[60%]">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <ProductsList
          collectionId={collectionId}
          onUpdate={refetchProducts}
          selectedProducts={selectedProducts}
        />
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <div className="flex justify-center">
            <AiOutlineLoading className="animate-spin text-2xl" />
          </div>
        ) : (
          <DataTable
            columns={[
              ...productColumns,
              {
                id: "actions",
                cell: ({ row }) => (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(row.original.productId)}
                  >
                    Remove
                  </Button>
                ),
              },
            ]}
            data={selectedProducts}
            emptyState={
              <div className="text-center py-4">
                <TbDatabaseExclamation className="mx-auto text-4xl mb-2" />
                <p>No products found in this collection</p>
              </div>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
