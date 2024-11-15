"use client";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { ADMIN_PRODUCT_DETAILS_VARIANTS } from "@/graphql/queries";
import { useState, useEffect } from "react";
export default function VariantsTable() {
  const productId = useParams().id;
  const [variants, setVariants] = useState([]);

  const getVariantsByProductID = async () => {
    const variables = {
      productId: productId,
      first: 2,
      after: "",
    };
    try {
      const response = await axios.post("/api/get-data", {
        query: ADMIN_PRODUCT_DETAILS_VARIANTS,
        variables: variables,
      });
      console.log("response", response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVariantsByProductID();
  }, []);
  return <div>VariantsTable</div>;
}
