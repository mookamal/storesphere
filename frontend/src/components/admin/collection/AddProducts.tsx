"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";
import { DELETE_PRODUCTS_FROM_COLLECTION } from "@/graphql/mutations";
import ProductsList from "@/components/admin/collection/ProductsList";
import { useMutation } from "@apollo/client";
import { useParams } from "next/navigation";
import DataTable from "@/components/common/CustomDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types";

// Define the props for AddProducts component
interface AddProductsProps {
  collectionId: string;
  selectedProducts: any[];
  refetchProducts: () => void;
}

// Define product columns for the DataTable
const productColumns: ColumnDef<Product, any>[] = [
  {
    id: "title",
    header: "Product Name",
    // Using Record<string, any> for a generic row object
    cell: ({ row }: { row: Record<string, any> }) => row.original.title,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }: { row: Record<string, any> }) => row.original.status,
  },
];

export default function AddProducts({
  collectionId,
  selectedProducts,
  refetchProducts,
}: AddProductsProps): JSX.Element {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { domain } = useParams() as { domain: string };

  const [deleteProductMutation] = useMutation(DELETE_PRODUCTS_FROM_COLLECTION, {
    onError: (error: any) => {
      toast.error(`Operation failed: ${error.message}`);
    },
    onCompleted: () => {
      toast.success("Product removed successfully!");
      refetchProducts();
    },
  });

  // Function to handle product removal
  const handleRemove = async (productId: string): Promise<void> => {
    setIsProcessing(true);
    try {
      await deleteProductMutation({
        variables: {
          collectionId,
          productIds: [productId],
          domain: domain,
        },
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
                header: "Actions",
                cell: ({ row }: { row: Record<string, any> }) => (
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
          />
        )}
      </CardContent>
    </Card>
  );
}
