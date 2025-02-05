"use client";
import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TbDatabaseExclamation } from "react-icons/tb";
import { AiOutlineLoading } from "react-icons/ai";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { DELETE_PRODUCTS_FROM_COLLECTION } from "@/graphql/mutations";
import ProductsList from "@/components/admin/collection/ProductsList";
// Temporary helper components (Move to separate files later)
// ----------------------------
const DataTable = ({ columns, data, emptyState }) => (
  <div className="space-y-2">
    {data.length > 0 ? (
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.id} className="text-left p-2">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col.id} className="p-2">
                  {col.cell({ row: { original: item } })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      emptyState
    )}
  </div>
);

// Move this hook to src/hooks/useOptimisticMutation.js
export const useOptimisticMutation = (mutation, config = {}) => {
  const [mutate, { loading, error }] = useMutation(mutation, {
    onCompleted: (data) => {
      if (config.onSuccess) {
        config.onSuccess(data);
      }
    },
    onError: (error) => {
      if (config.onError) {
        config.onError(error);
      }
    },
    update: (cache, { data }) => {
      if (config.optimisticUpdate) {
        config.optimisticUpdate(cache, data);
      }
    },
  });

  const execute = async (variables) => {
    try {
      if (config.optimisticResponse) {
        // Apply optimistic response
        config.optimisticResponse(variables);
      }

      const result = await mutate({ variables });
      return result;
    } catch (error) {
      throw error;
    }
  };

  return [execute, { loading, error }]; // Return an array for consistency
};
// ----------------------------

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
    }
  );

  const handleRemove = async (productId) => {
    setIsProcessing(true);
    try {
      await deleteProduct({
        collectionId,
        productIds: [productId],
      });
      await refetchProducts();
      toast.success("Product removed successfully");
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
