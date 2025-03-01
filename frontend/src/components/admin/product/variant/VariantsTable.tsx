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
import {
  OptionValueType,
  useAdminProductDetailsVariantsQuery,
} from "@/codegen/generated";

interface VariantsTableProps {
  currencyCode: string;
  shouldRefetch: boolean;
  onRefetchHandled: () => void;
  setShouldRefetch: (value: boolean) => void;
}

export default function VariantsTable({
  currencyCode,
  shouldRefetch,
  onRefetchHandled,
  setShouldRefetch,
}: VariantsTableProps): JSX.Element {
  const { id: productId } = useParams() as { id: string };
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [countVariant, setCountVariant] = useState<number>(5);
  const [selectedVariantIDs, setSelectedVariantIDs] = useState<
    Array<string | number>
  >([]);

  const handleLoadMore = (): void => {
    setCountVariant(countVariant + 5);
  };

  const handleSelectVariantIDS = (variantId: string | number): void => {
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
  }, [shouldRefetch, countVariant, refetchVariants]);

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
            {variants?.productDetailsVariants?.edges?.map((edge) => {
              if (!edge?.node) return null;
              const node = edge.node;
              return (
                <TableRow key={node.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedVariantIDs.includes(
                        node.variantId ?? ""
                      )}
                      onCheckedChange={(checked) =>
                        handleSelectVariantIDS(node.variantId ?? "")
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{currencyCode}</Badge>
                    {node?.pricing?.amount}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {node.selectedOptions?.filter(Boolean).map((value) => {
                        const option = value as OptionValueType;
                        return (
                          <Badge key={`${option.name}-${option.id}`}>
                            {option.name}
                          </Badge>
                        );
                      })}
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
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <h3 className="text-center">No variants found for this product.</h3>
      )}
    </>
  );
}
