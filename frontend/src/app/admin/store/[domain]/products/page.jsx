"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PRODUCTS_ADMIN_PAGE } from '@/graphql/queries';
import { debounce } from 'lodash';

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
      <div key={product.id} className="product-item">
        <h3>{product.title}</h3>
        <p>Status: {product.status}</p>
      </div>
    )), 
    [products]
  );

  // Render components
  return (
    <div className="products-container">
      {/* Search and Filter Section */}
      <div className="filter-section">
        <input 
          type="text" 
          placeholder="Search Products" 
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select 
          value={status} 
          onChange={(e) => handleStatusChange(e.target.value)}
          className="status-select"
        >
          <option value="all">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {/* Loading and Error States */}
      {loading && <div>Loading...</div>}
      {error && <div className="error-message">Error: {error}</div>}

      {/* Products List */}
      <div className="products-list">
        {productList}
      </div>

      {/* Pagination */}
      <div className="pagination-section">
        <button 
          disabled={pagination.page === 1}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
        >
          Previous
        </button>
        <button 
          disabled={!pagination.hasNextPage}
          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
        >
          Next
        </button>
      </div>
    </div>
  );
}