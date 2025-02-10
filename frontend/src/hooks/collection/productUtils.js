import { useQuery } from "@apollo/client";
import { ADMIN_PRODUCTS_BY_COLLECTION_ID } from "@/graphql/queries";

export const useProductFetcher = () => {
  const fetchProducts = (collectionId) => {
    const { loading, error, data } = useQuery(ADMIN_PRODUCTS_BY_COLLECTION_ID, {
      variables: { 
        collectionId, 
        first: 15, 
        after: "" 
      }
    });

    if (loading) return [];
    if (error) {
      console.error("Failed to fetch products", error);
      return [];
    }

    return data?.productsByCollection?.edges.map(({ node }) => node) || [];
  };

  return { fetchProducts };
};