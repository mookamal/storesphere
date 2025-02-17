"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { handleGraphQLError } from "@/lib/utilities";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoReload } from "react-icons/io5";
import CustomerOverview from "@/components/admin/customer/CustomerOverview";
import CustomerAddressInputs from "@/components/admin/customer/CustomerAddressInputs";
import _ from "lodash";
import { stripTypename } from "@apollo/client/utilities";
import { toast } from "react-toastify";
import swal from "sweetalert";
import {
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useCustomerDetailsQuery,
} from "@/codegen/generated";

export default function UpdateCustomer(): JSX.Element {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<any>();

  const { id: customerId, domain } = useParams() as {
    id: string;
    domain: string;
  };
  const router = useRouter();

  const [localError, setLocalError] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);

  const watchAddress = watch("defaultAddress");

  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useCustomerDetailsQuery({
    variables: { id: customerId },
  });

  const [updateCustomer, { loading: updateLoading }] =
    useUpdateCustomerMutation();
  const [deleteCustomer, { loading: deleteLoading }] =
    useDeleteCustomerMutation();

  useEffect(() => {
    if (data && data.customerDetails) {
      setCustomer(data.customerDetails);
      reset({
        firstName: data.customerDetails.firstName,
        lastName: data.customerDetails.lastName,
        email: data.customerDetails.email,
        defaultAddress: data.customerDetails.defaultAddress,
      });
    }
  }, [data, reset]);

  const onSubmit = async (data: any) => {
    const cleanData = stripTypename(data);
    try {
      const result = await updateCustomer({
        variables: {
          id: customerId,
          customerInputs: cleanData,
        },
      });
      if (result.data?.updateCustomer?.customer) {
        toast.success("Customer updated successfully!");
        refetch();
      }
    } catch (error) {
      console.error("error", error);
      const errorDetails = handleGraphQLError(error);
      setLocalError(errorDetails);
    }
  };

  const handleDeleteCustomer = async () => {
    const confirmed = await swal({
      title: "Delete Customer?",
      text: "Are you sure you want to delete this customer?",
      icon: "warning",
      dangerMode: true,
    });
    if (confirmed) {
      try {
        const result = await deleteCustomer({
          variables: { id: customerId },
        });
        if (result.data?.deleteCustomer?.success) {
          toast.success("Customer deleted successfully.");
          router.push(`/store/${domain}/customers`);
        }
      } catch (error) {
        toast.error("Failed to delete customer!");
      }
    }
  };

  const combinedLoading = queryLoading || updateLoading || deleteLoading;
  const combinedError = localError || queryError;

  if (combinedLoading) {
    return <div className="text-center mt-24">Loading...</div>;
  }
  if (combinedError) {
    const errorDetails = handleGraphQLError(combinedError);
    switch (errorDetails.type) {
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
        return <div className="error-message">{errorDetails.message}</div>;
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
            onClick={handleDeleteCustomer}
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
        disabled={!isDirty}
      >
        {updateLoading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
        Update
      </Button>
    </form>
  );
}
