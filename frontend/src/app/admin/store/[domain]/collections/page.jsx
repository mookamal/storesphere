"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_ALL_COLLECTIONS } from "@/graphql/queries";
export default function collections({ params }) {
  const currentPath = usePathname();
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [endCursor, setEndCursor] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);

  // Mock data for collections
  const mockCollections = [
    { title: "Collection 1", products: 5 },
    { title: "Collection 2", products: 0 },
    { title: "Collection 3", products: 12 },
  ];
  const getData = async () => {
    setIsLoading(true);
    try {
      const variables = {
        domain: params.domain,
      };
      const response = await axios.post("/api/get-data", {
        query: ADMIN_ALL_COLLECTIONS,
        variables: variables,
      });
      if (response.data.allCollections.edges.length > 0) {
        setCollections(response.data.allCollections.edges);
        setHasNextPage(response.data.allCollections.pageInfo.hasNextPage);
        setEndCursor(response.data.allCollections.pageInfo.endCursor);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-8">
      {/* header page */}
      <div className="flex justify-between">
        <h1 className="h1">Collections</h1>
        <Link
          href={`${currentPath}/new`}
          className={`${buttonVariants({ variant: "outline", size: "sm" })}`}
        >
          Create collection
        </Link>
      </div>

      {/* table */}
      {isLoading ? (
        <p className="text-center mt-8">Loading...</p>
      ) : collections.length > 0 ? (
        <Table className="border border-collapse mt-2">
          <TableHeader>
            <TableRow>
              <TableHead className="border-r">Title</TableHead>
              <TableHead>Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.map(({ node }) => (
              <TableRow key={node.id}>
                <TableCell className="border-r">
                  <Link href={`/${currentPath}/${node.handle}`}>
                    {node.title}
                  </Link>
                </TableCell>
                <TableCell>{node.productsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center mt-8">No collections found.</p>
      )}
    </div>
  );
}
