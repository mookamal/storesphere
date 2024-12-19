"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { handleGraphQLError } from "@/lib/utilities";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { GET_CUSTOMER_BY_ID } from "@/graphql/queries";
import { Button } from "@/components/ui/button";
import { IoReload } from "react-icons/io5";
import CustomerOverview from "@/components/admin/customer/CustomerOverview";
import CustomerAddressInputs from "@/components/admin/customer/CustomerAddressInputs";
import _ from "lodash";
import { UPDATE_CUSTOMER } from "@/graphql/mutations";
import { stripTypename } from "@apollo/client/utilities";
import { toast } from "react-toastify";
export default function UpdateCustomer() {
  const { register, handleSubmit, control, watch, setValue } = useForm();
  const customerId = useParams().id;
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState(null);
  const watchAddress = watch("defaultAddress");
  const watchFirstName = watch("firstName");
  const watchLastName = watch("lastName");
  const watchEmail = watch("email");

  const getCustomerById = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/get-data", {
        query: GET_CUSTOMER_BY_ID,
        variables: { id: customerId },
      });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      if (response.data.customerDetails) {
        setCustomer(response.data.customerDetails);
        setValue("firstName", response.data.customerDetails.firstName);
        setValue("lastName", response.data.customerDetails.lastName);
        setValue("email", response.data.customerDetails.email);
        // defaultAddress
        setValue(
          "defaultAddress",
          response.data.customerDetails.defaultAddress
        );
        // addresses
      }
    } catch (error) {
      const errorDetails = handleGraphQLError(error);
      setError(errorDetails);
    } finally {
      setLoading(false);
    }
  };

  // handle any change
  useEffect(() => {
    if (customer) {
      if (
        watchFirstName !== customer?.firstName ||
        watchLastName !== customer?.lastName ||
        watchEmail !== customer?.email
      ) {
        setHasChanges(true);
      } else {
        setHasChanges(false);
      }
      if (!_.isEqual(watchAddress, customer?.defaultAddress)) {
        setHasChanges(true);
      } else {
        setHasChanges(false);
      }
    }
  }, [
    watchFirstName,
    watchLastName,
    watchEmail,
    watchAddress?.address1,
    watchAddress?.address2,
    watchAddress?.country,
    watchAddress?.phone,
    watchAddress?.zip,
    watchAddress?.city,
    watchAddress?.company,
  ]);

  useEffect(() => {
    getCustomerById();
  }, []);

  const onSubmit = async (data) => {
    const cleanData = stripTypename(data);
    setLoading(true);
    try {
      const response = await axios.post("/api/set-data", {
        query: UPDATE_CUSTOMER,
        variables: {
          id: customerId,
          customerInputs: cleanData,
        },
      });
      if (response.data.data.updateCustomer.customer) {
        toast.success("Customer updated successfully!");
        await getCustomerById();
      }
    } catch (error) {
      console.error("error", error);

      const errorDetails = handleGraphQLError(error);
      setError(errorDetails);
    } finally {
      setLoading(false);
    }
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <div className="flex justify-between">
          <h1 className="h1">Update Customer</h1>
          <Button
            type="button"
            variant="destructive"
            onClick={() => console.log("Delete")}
          >
            Delete
          </Button>
        </div>
        <div className="flex flex-col items-center my-5 gap-3">
          <CustomerOverview register={register} />
          <Card className="card w-full md:w-[60%] lg:w-[40%]">
            <CardHeader>Customer address</CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  {watchAddress?.country && (
                    <h2>{watchAddress.country.name},</h2>
                  )}
                  {watchAddress?.city && <h2>{watchAddress.city}</h2>}
                </div>
                <CustomerAddressInputs
                  register={register}
                  control={control}
                  setValue={setValue}
                  watchAddress={watchAddress}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Button
        size="lg"
        type="submit"
        className="fixed bottom-5 right-5 rounded-full shadow-md"
        disabled={!hasChanges}
      >
        {loading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
        Update
      </Button>
    </form>
  );
}
