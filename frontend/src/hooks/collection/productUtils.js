import { useCallback } from "react";
import axios from "axios";
import { ADMIN_PRODUCTS_BY_COLLECTION_ID } from "@/graphql/queries";

export const useProductFetcher = () => {
    const fetchProducts = useCallback(async (collectionId) => {
      try {
        const response = await axios.post("/api/get-data", {
          query: ADMIN_PRODUCTS_BY_COLLECTION_ID,
          variables: { 
            collectionId, 
            first: 15, 
            after: "" 
          }
        });
        
        return response.data.productsByCollection.edges.map(({ node }) => node);
      } catch (error) {
        console.error("Failed to fetch products", error);
        return [];
      }
    }, []);
  
    return { fetchProducts };
  };