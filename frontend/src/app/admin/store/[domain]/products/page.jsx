"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PRODUCTS_ADMIN_PAGE } from '@/graphql/queries';
import { debounce } from 'lodash';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import Link from 'next/link';

export default function ProductsPage() {
  // Existing state and logic remain unchanged
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [status, setStatus] = useState(
    searchParams.get('status') || 'all'
  );

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    hasNextPage: false,
    lastCursor: ''
  });

  // Existing debounced fetch and effect logic remains the same

  const productList = useMemo(() => 
    products.map(product => (
      <TableRow 
        key={product.productId} 
        className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
      >
        <TableCell className="dark:text-gray-200">{product.title}</TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-xs ${
            product.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}>
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

  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('search', query);
    router.replace(`?${newParams.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const handleStatusChange = useCallback((selectedStatus) => {
    setStatus(selectedStatus);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('status', selectedStatus);
    router.replace(`?${newParams.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const debouncedFetchProducts = useMemo(
    () => debounce(async (queryParams) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post('/api/get-data', {
          query: PRODUCTS_ADMIN_PAGE,
          variables: {
            domain: params.domain,
            search: queryParams.searchQuery || '',
            status: queryParams.status === 'all' ? undefined : queryParams.status,
            first: queryParams.pageSize,
            after: queryParams.page > 1 ? queryParams.lastCursor : ''
          }
        });

        if (response.data.allProducts) {
          setProducts(response.data.allProducts.edges.map(edge => edge.node));
          setPagination(prev => ({
            ...prev,
            totalItems: response.data.allProducts.totalCount || 0,
            hasNextPage: response.data.allProducts.pageInfo.hasNextPage || false,
            lastCursor: response.data.allProducts.pageInfo.endCursor || ''
          }));
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    }, 300),
    [params.domain]
  );

  useEffect(() => {
    const queryParams = {
      searchQuery,
      status,
      page: pagination.page,
      pageSize: pagination.pageSize,
      lastCursor: pagination.lastCursor
    };

    debouncedFetchProducts(queryParams);

    // Cleanup debounce on unmount
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [searchQuery, status, pagination.page, debouncedFetchProducts]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight dark:text-white">Products Management</h1>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
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
          <Select 
            value={status} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Statuses</SelectItem>
              <SelectItem value="ACTIVE" className="dark:text-gray-300 dark:hover:bg-gray-700">Active</SelectItem>
              <SelectItem value="DRAFT" className="dark:text-gray-300 dark:hover:bg-gray-700">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary dark:text-gray-300" size={48} />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-900 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
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
              <TableBody>
                {productList}
              </TableBody>
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
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Previous
            </Button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of {Math.ceil(pagination.totalItems / pagination.pageSize)}
            </div>
            <Button 
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
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