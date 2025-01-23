"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { PRODUCTS_ADMIN_PAGE } from '@/graphql/queries';

// Create Product Context
const ProductsPageContext = createContext();

// Provider
export function ProductsPageProvider({ children, domain }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    hasNextPage: false,
    lastCursor: ''
  });

  // Fetch products
  const fetchProducts = useMemo(
    () => debounce(async (queryParams) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post('/api/get-data', {
          query: PRODUCTS_ADMIN_PAGE,
          variables: {
            domain: domain,
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
    [domain]
  );

  // Function to update pagination
  const updatePagination = useCallback((updates) => {
    setPagination(prev => ({ ...prev, ...updates }));
  }, []);

  // Value to be provided to the children
  const contextValue = {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    updatePagination,
    setProducts,
    setError,
    setPagination
  };

  return (
    <ProductsPageContext.Provider value={contextValue}>
      {children}
    </ProductsPageContext.Provider>
  );
}

// Hook to access product context
export function useProductsPageContext() {
  const context = useContext(ProductsPageContext);
  if (!context) {
    throw new Error('useProductsPageContext must be used within a ProductsPageProvider');
  }
  return context;
}
