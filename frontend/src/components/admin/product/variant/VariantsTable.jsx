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
export default function VariantsTable() {
  const productId = useParams().id;
  const [variants, setVariants] = useState();
  const [loading, setLoading] = useState(false);

  const getVariantsByProductID = async () => {
    setLoading(true);
    const variables = {
      productId: productId,
      first: 2,
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
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <>
      {variants ? (
        <Table>
          <TableCaption>Variants</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map(({ node }) => (
              <TableRow key={node.id}>
                <TableCell>
                  <Badge variant="outline">USD</Badge>
                  {node.price}
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
