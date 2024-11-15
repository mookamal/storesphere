"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { ADMIN_PRODUCT_DETAILS_VARIANTS } from "@/graphql/queries";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditVariantModal from "./EditVariantModal";
export default function VariantsTable({ currencyCode }) {
  const productId = useParams().id;
  const [variants, setVariants] = useState();
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [countVariant, setCountVariant] = useState(5);

  const handleLoadMore = () => {
    setCountVariant(countVariant + 5);
  };

  const getVariantsByProductID = async () => {
    setLoading(true);
    const variables = {
      productId: productId,
      first: countVariant,
      after: "",
    };
    try {
      const response = await axios.post("/api/get-data", {
        query: ADMIN_PRODUCT_DETAILS_VARIANTS,
        variables: variables,
      });
      if (response.statusText === "OK") {
        if (response.data.productDetailsVariants.edges.length > 0) {
          setVariants(response.data.productDetailsVariants.edges);
          setHasNextPage(
            response.data.productDetailsVariants.pageInfo.hasNextPage
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVariantsByProductID();
  }, [countVariant]);

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
              <TableHead>Price</TableHead>
              <TableHead>Options</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map(({ node }) => (
              <TableRow key={node.id}>
                <TableCell>
                  <Badge variant="outline">{currencyCode}</Badge>
                  {node.price}
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
                <TableCell>
                  <EditVariantModal
                    variant={node}
                    currencyCode={currencyCode}
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
