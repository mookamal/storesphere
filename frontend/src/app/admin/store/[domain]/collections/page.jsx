"use client";

import { 
  QueryClient, 
  QueryClientProvider, 
  useInfiniteQuery 
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
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

// Create a query client with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      cacheTime: 1000 * 60 * 5, 
      // Consider data stale after 1 minute
      staleTime: 1000 * 60, 
      // Disable refetching on window focus
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      // Retry failed requests twice
      retry: 1
    }
  }
});

// Function to fetch collections with pagination
const fetchCollections = async ({ 
  pageParam = '', 
  queryKey 
}) => {
  const [_key, domain] = queryKey;
  
  // Prepare GraphQL variables for pagination
  const variables = {
    domain: domain,
    first: 10,
    after: pageParam,
  };

  // Send GraphQL request to fetch collections
  const response = await axios.post("/api/get-data", {
    query: ADMIN_ALL_COLLECTIONS,
    variables: variables,
  });

  // Check for GraphQL errors
  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }

  // Return collections data with pagination info
  return response.data.allCollections;
};

function CollectionsContent() {
  const currentPath = usePathname();
  const domain = useParams().domain;

  // Use infinite query for pagination and data fetching
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isLoading, 
    isError, 
    error 
  } = useInfiniteQuery(
    ['collections-by-domain', domain],
    fetchCollections,
    {
      // Configure how to get the next page parameter
      getNextPageParam: (lastPage) => 
        lastPage.pageInfo.hasNextPage 
          ? lastPage.pageInfo.endCursor 
          : undefined
    }
  );

  // Flatten collections from all pages
  const collections = data?.pages.flatMap(page => page.edges) || [];

  // Render error state
  if (isError) {
    return (
      <div className="p-8 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="flex justify-between">
        <h1 className="h1">Collections</h1>
        <Link
          href={`${currentPath}/new`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Create collection
        </Link>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse mt-8">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Loading collections...
          </p>
        </div>
      )}

      {/* No collections state */}
      {!isLoading && collections.length === 0 && (
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

      {/* Collections table */}
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
                    onClick={() => fetchNextPage()}
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

      {/* React Query DevTools for debugging */}
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default function Collections() {
  return (
    <QueryClientProvider client={queryClient}>
      <CollectionsContent />
    </QueryClientProvider>
  );
}
