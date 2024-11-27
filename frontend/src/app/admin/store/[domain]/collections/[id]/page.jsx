"use client";
import { ADMIN_COLLECTION_BY_ID } from "@/graphql/queries";
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Call the function to fetch the collection data.
  useEffect(() => {
    getCollectionById();
  }, []);
  return <div></div>;
}
