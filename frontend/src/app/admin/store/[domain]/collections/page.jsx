"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Package } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { Button, buttonVariants } from "@/components/ui/button";
import { ADMIN_ALL_COLLECTIONS } from "@/graphql/queries";
import { useEffect, useState } from "react";

function CollectionsContent() {
  const router = useRouter();
  const currentPath = usePathname();
  const domain = useParams().domain;
  
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState('');

  const fetchCollections = async (cursor = '') => {
    try {
      const variables = {
        domain: domain,
        first: 10,
        after: cursor,
      };

      const response = await axios.post("/api/get-data", {
        query: ADMIN_ALL_COLLECTIONS,
        variables: variables,
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const newData = response.data.allCollections;
      
      if (cursor) {
        // Append new data when loading more
        setCollections(prev => [...prev, ...newData.edges]);
      } else {
        // Initial load
        setCollections(newData.edges);
      }

      setHasNextPage(newData.pageInfo.hasNextPage);
      setEndCursor(newData.pageInfo.endCursor);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isLoading) {
      setIsLoading(true);
      fetchCollections(endCursor);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h1 className="h1">Collections</h1>
        <Link
          href={`${currentPath}/new`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Create collection
        </Link>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse mt-8">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Loading collections...
          </p>
        </div>
      )}

      {error && (
        <div className="p-8 text-red-500">
          Error: {error}
        </div>
      )}

      {!isLoading && collections.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 mt-8">
          <Package className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No Collections Yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
            Start by creating your first collection to organize your products
          </p>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/admin/store/${domain}/collections/new`)}
          >
            Create Collection
          </Button>
        </div>
      )}

      {collections.length > 0 && (
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
                    disabled={!hasNextPage || isLoading}
                    onClick={handleLoadMore}
                    variant="outline"
                    size="sm"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Load more'
                    )}
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

export default function Collections() {
  return <CollectionsContent />;
}