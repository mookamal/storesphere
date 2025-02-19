"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Filter, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  ProductsPageProvider,
  useProductsPageContext,
} from "@/providers/ProductsPageProvider";

export default function ProductsPage(): JSX.Element {
  const params = useParams();

  return (
    <ProductsPageProvider domain={params.domain as string}>
      <ProductsPageContent />
    </ProductsPageProvider>
  );
}

function ProductsPageContent(): JSX.Element {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    updatePagination,
  } = useProductsPageContext();

  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("search") || ""
  );
  const [status, setStatus] = useState<string>(
    searchParams.get("status") || "all"
  );

  const productList = useMemo(
    () =>
      products.map((product: any) => (
        <TableRow
          key={product.productId}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
        >
          <TableCell className="dark:text-gray-200">{product.title}</TableCell>
          <TableCell>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                product.status === "ACTIVE"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {product.status}
            </span>
          </TableCell>
          <TableCell>
            <Link
              href={`/store/${params.domain}/products/${product.productId}`}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Edit size={16} />
                Edit
              </Button>
            </Link>
          </TableCell>
        </TableRow>
      )),
    [products, params.domain]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      const newParams = new URLSearchParams(searchParams);
      newParams.set("search", query);
      router.replace(`?${newParams.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const handleStatusChange = useCallback(
    (selectedStatus: string) => {
      setStatus(selectedStatus);

      const newParams = new URLSearchParams(searchParams);
      newParams.set("status", selectedStatus);
      router.replace(`?${newParams.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    const queryParams = {
      searchQuery,
      status,
      page: pagination.page,
      pageSize: pagination.pageSize,
      lastCursor: pagination.lastCursor,
    };

    fetchProducts(queryParams);
  }, [searchQuery, status, pagination.page, fetchProducts]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight dark:text-white">
          Products Management
        </h1>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search Products"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="text-gray-500 dark:text-gray-400" size={20} />
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem
                value="all"
                className="dark:text-gray-300 dark:hover:bg-gray-700"
              >
                All Statuses
              </SelectItem>
              <SelectItem
                value="ACTIVE"
                className="dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Active
              </SelectItem>
              <SelectItem
                value="DRAFT"
                className="dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Draft
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2
            className="animate-spin text-primary dark:text-gray-300"
            size={48}
          />
        </div>
      )}

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-900 dark:text-red-300 px-4 py-3 rounded relative"
          role="alert"
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="border rounded-lg dark:border-gray-700">
            <Table>
              <TableHeader className="dark:bg-gray-800">
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-300">Title</TableHead>
                  <TableHead className="dark:text-gray-300">Status</TableHead>
                  <TableHead className="dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{productList}</TableBody>
            </Table>
          </div>

          {products.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              No products found
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => updatePagination({ page: pagination.page - 1 })}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Previous
            </Button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of{" "}
              {Math.ceil(pagination.totalItems / pagination.pageSize)}
            </div>
            <Button
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() => updatePagination({ page: pagination.page + 1 })}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
