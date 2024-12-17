"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
export default function UpdateCustomer() {
  const { register, handleSubmit, control, watch, setValue } = useForm();
  const customerId = useParams().id;
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState(null);

  const getCustomerById = () => {};

  useEffect(() => {
    getCustomerById();
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
  };
  if (loading) {
    return <div className="text-center mt-24">Loading...</div>;
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

  return <form onSubmit={handleSubmit(onSubmit)}></form>;
}
