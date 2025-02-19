"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { debounce } from "lodash";
import {
  ProductNode,
  ProductProductStatusChoices,
  useProductIndexQuery,
} from "@/codegen/generated";

// Pagination state interface
interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  lastCursor: string;
}

// Query parameters interface for fetching products
interface QueryParams {
  searchQuery?: string;
  status?: string; // can be 'all' or a valid ProductProductStatusChoices value
  pageSize: number;
  page: number;
  lastCursor: string;
}

// Interface for the GraphQL allProducts result
interface AllProducts {
  totalCount: number;
  edges: Array<{ node: ProductNode | null }>;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

// Context value interface
interface ProductsPageContextType {
  products: ProductNode[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  fetchProducts: (queryParams: QueryParams) => void;
  updatePagination: (updates: Partial<PaginationState>) => void;
  setProducts: React.Dispatch<React.SetStateAction<ProductNode[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
}

// Create the context with a null default value
const ProductsPageContext = createContext<ProductsPageContextType | null>(null);

interface ProductsPageProviderProps {
  children: ReactNode;
  domain: string;
}

export function ProductsPageProvider({
  children,
  domain,
}: ProductsPageProviderProps) {
  const [products, setProducts] = useState<ProductNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    hasNextPage: false,
    lastCursor: "",
  });

  // Use Apollo client hook with skip enabled to allow manual refetching
  const { refetch } = useProductIndexQuery({
    variables: {
      domain,
      search: "",
      status: undefined,
      first: pagination.pageSize,
      after: "",
    },
    skip: true,
  });

  // Function to fetch products using debounce
  const fetchProducts = useMemo(
    () =>
      debounce(async (queryParams: QueryParams) => {
        setLoading(true);
        setError(null);

        try {
          const { data } = await refetch({
            domain,
            search: queryParams.searchQuery || "",
            // Cast status to ProductProductStatusChoices when not 'all'
            status:
              queryParams.status === "all"
                ? undefined
                : (queryParams.status as ProductProductStatusChoices),
            first: queryParams.pageSize,
            after: queryParams.page > 1 ? queryParams.lastCursor : "",
          });

          // Ensure data.allProducts is not null or undefined
          if (data.allProducts) {
            const allProducts = data.allProducts as AllProducts;
            // Filter out any null edges and map to product nodes
            setProducts(
              allProducts.edges
                .filter((edge): edge is { node: ProductNode } =>
                  Boolean(edge && edge.node)
                )
                .map((edge) => edge.node)
            );
            setPagination((prev) => ({
              ...prev,
              totalItems: allProducts.totalCount,
              hasNextPage: allProducts.pageInfo.hasNextPage,
              lastCursor: allProducts.pageInfo.endCursor,
            }));
          }
        } catch (err: any) {
          setError(err.response?.data?.error || "Failed to fetch products");
        } finally {
          setLoading(false);
        }
      }, 300),
    [domain, refetch]
  );

  // Function to update pagination state
  const updatePagination = useCallback((updates: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...updates }));
  }, []);

  // Context value to be provided to children components
  const contextValue: ProductsPageContextType = {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    updatePagination,
    setProducts,
    setError,
    setPagination,
  };

  return (
    <ProductsPageContext.Provider value={contextValue}>
      {children}
    </ProductsPageContext.Provider>
  );
}

// Hook to access the products page context
export function useProductsPageContext(): ProductsPageContextType {
  const context = useContext(ProductsPageContext);
  if (!context) {
    throw new Error(
      "useProductsPageContext must be used within a ProductsPageProvider"
    );
  }
  return context;
}
