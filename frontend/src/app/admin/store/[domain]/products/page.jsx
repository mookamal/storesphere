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
  // Routing hooks
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State management with performance optimizations
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized filtering states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [status, setStatus] = useState(
    searchParams.get('status') || 'all'
  );

  // Pagination with performance considerations
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    hasNextPage: false,
    lastCursor: ''
  });

  // Debounced search to prevent rapid API calls
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

  // Optimized effect for fetching products
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

  // Memoized search and status change handlers
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

  // Performance-optimized rendering
  const productList = useMemo(() => 
    products.map(product => (
      <TableRow 
        key={product.productId} 
        className="hover:bg-gray-50 transition-colors cursor-pointer group"
      >
        <TableCell>{product.title}</TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-xs ${
            product.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
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
              className="flex items-center gap-2"
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

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Products Management</h1>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            type="text" 
            placeholder="Search Products" 
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="text-gray-500" size={20} />
          <Select 
            value={status} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productList}
              </TableBody>
            </Table>
          </div>

          {products.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No products found
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <Button 
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <div className="text-sm text-gray-500">
              Page {pagination.page} of {Math.ceil(pagination.totalItems / pagination.pageSize)}
            </div>
            <Button 
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}