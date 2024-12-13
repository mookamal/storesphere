"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_ALL_COLLECTIONS } from "@/graphql/queries";
export default function Collections() {
  const currentPath = usePathname();
  const [collections, setCollections] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [endCursor, setEndCursor] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const domain = useParams().domain;

  const getData = async () => {
    setIsLoading(true);
    try {
      const variables = {
        domain: domain,
        first: 10,
        after: endCursor,
      };
      const response = await axios.post("/api/get-data", {
        query: ADMIN_ALL_COLLECTIONS,
        variables: variables,
      });
      if (response.data.allCollections.edges.length > 0) {
        setCollections(response.data.allCollections.edges);
        setHasNextPage(response.data.allCollections.pageInfo.hasNextPage);
        setEndCursor(response.data.allCollections.pageInfo.endCursor);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.error(error);
      setCollections([]);
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
      ) : collections === null ? (
        <div></div>
      ) : collections.length === 0 ? (
        <p className="text-center mt-8">No collections found.</p>
      ) : (
        <div className="border rounded mt-4 shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-black dark:text-white">
                <TableHead className="border-r">Title</TableHead>
                <TableHead className="text-right w-[5px]">Products</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map(({ node }) => (
                <TableRow
                  key={node.id}
                  className="hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white"
                >
                  <TableCell className="border-r">
                    <Link
                      href={`${currentPath}/${node.collectionId}`}
                      className="hover:border-b"
                    >
                      {node.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    {node.productsCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="border-t">
                <TableCell colSpan="2">
                  <Button
                    disabled={!hasNextPage}
                    onClick={getData}
                    variant="outline"
                    size="sm"
                  >
                    Load more
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
}
