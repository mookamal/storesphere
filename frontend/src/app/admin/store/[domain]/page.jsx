"use client";
import { GET_SETTINGS_GENERAL } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";

export default function StoreAdmin() {
  const { domain } = useParams();

  const { loading, error, data } = useQuery(GET_SETTINGS_GENERAL, {
    variables: { domain},
    errorPolicy: "all",
  });
  console.log(error);
  if (loading) return <div>Loading...</div>;


  return (
    <div>
    </div>
  );
}