"use client";
import { ADMIN_COLLECTION_BY_ID } from "@/graphql/queries";
import { handleGraphQLError } from "@/lib/utilities";
import axios from "axios";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function updateCollection() {
  const collectionId = useParams().id;
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the collection data using the provided ID and domain.
  const getCollectionById = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/get-data", {
        query: ADMIN_COLLECTION_BY_ID,
        variables: { id: collectionId },
      });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      if (response.data.collectionById) {
        setCollection(response.data.collectionById);
      }
    } catch (error) {
      const errorDetails = handleGraphQLError(error);
      setError(errorDetails);
    } finally {
      setLoading(false);
    }
  };
  // Call the function to fetch the collection data.
  useEffect(() => {
    getCollectionById();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    switch (error.type) {
      case "NOT_FOUND":
        notFound();
        break;
      case "UNAUTHORIZED":
        return (
          <div className="error-message">
            You need to log in to access this page.
          </div>
        );
      case "SERVER_ERROR":
        return (
          <div className="error-message">
            An internal server error occurred. Please try again later.
          </div>
        );
      case "NO_RESPONSE":
        return (
          <div className="error-message">
            No response from the server. Check your network.
          </div>
        );
      default:
        return <div className="error-message">{error.message}</div>;
    }
  }
  return (
    <div>
      <h1>Update Collection</h1>
      {collection && (
        <div>
          <h2>{collection.title}</h2>
          <p>{collection.description}</p>
        </div>
      )}
    </div>
  );
}
