"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import EditVariantModal from "./EditVariantModal";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteVariantsDialog from "./DeleteVariantsDialog";
import { useAdminProductDetailsVariantsQuery } from "@/codegen/generated";
export default function VariantsTable({
  currencyCode,
  shouldRefetch,
  onRefetchHandled,
  setShouldRefetch,
}) {
  const productId = useParams().id;
  const [hasNextPage, setHasNextPage] = useState(false);
  const [countVariant, setCountVariant] = useState(5);
  const [selectedVariantIDs, setSelectedVariantIDs] = useState([]);

  const handleLoadMore = () => {
    setCountVariant(countVariant + 5);
  };

  const handleSelectVariantIDS = (variantId) => {
    if (selectedVariantIDs.includes(variantId)) {
      setSelectedVariantIDs(
        selectedVariantIDs.filter((id) => id !== variantId)
      );
    } else {
      setSelectedVariantIDs([...selectedVariantIDs, variantId]);
    }
  };

  const {
    data: variants,
    loading,
    refetch: refetchVariants,
  } = useAdminProductDetailsVariantsQuery({
    variables: {
      productId: productId,
      first: countVariant,
      after: "",
    },
  });

  useEffect(() => {
    refetchVariants();
  }, [shouldRefetch, countVariant]);

  if (loading) return <div>Loading...</div>;
  return (
    <>
      {variants ? (
        <Table>
          <TableCaption>
            {hasNextPage && (
              <Button
                disabled={!hasNextPage}
                type="button"
                onClick={handleLoadMore}
              >
                Load More
              </Button>
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Options</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>
                {selectedVariantIDs.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`${buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}`}
                    >
                      <HiDotsHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <DeleteVariantsDialog
                          variantIDs={selectedVariantIDs}
                          onRefetch={() => setShouldRefetch(true)}
                          clearSelectedVariantIDs={() =>
                            setSelectedVariantIDs([])
                          }
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants?.productDetailsVariants?.edges?.map(({ node }) => (
              <TableRow key={node.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedVariantIDs.includes(node.variantId)}
                    onCheckedChange={(checked) =>
                      handleSelectVariantIDS(node.variantId)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{currencyCode}</Badge>
                  {node.pricing.amount}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {node.selectedOptions.map((value) => (
                      <Badge key={`${value.name}-${value.id}`}>
                        {value.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{node.stock}</TableCell>
                <TableCell>
                  <EditVariantModal
                    variant={node}
                    currencyCode={currencyCode}
                    onRefetch={() => setShouldRefetch(true)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <h3 className="text-center">No variants found for this product.</h3>
      )}
    </>
  );
}
