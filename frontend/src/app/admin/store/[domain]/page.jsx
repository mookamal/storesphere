"use client";
import { GET_SETTINGS_GENERAL } from "@/graphql/queries";
import { useSuspenseQuery } from "@apollo/client";
import { useParams } from "next/navigation";

export default function StoreAdmin() {
  const { domain } = useParams();

  const { data } = useSuspenseQuery(GET_SETTINGS_GENERAL, {
    variables: { domain },
  });


  return (
    <div>

    </div>
  );
}