"use client";

import CustomerOverview from "@/components/admin/customer/CustomerOverview";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoReload } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import CustomerAddressInputs from "@/components/admin/customer/CustomerAddressInputs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "react-toastify";
import { useCreateCustomerMutation } from "@/codegen/generated";

interface CreateCustomerFormValues {
  fullName: string;
  email: string;
  defaultAddress?: {
    country?: {
      name: string;
    };
    city?: string;
  };
  [key: string]: any;
}

export default function CreateCustomer(): JSX.Element {
  const { register, handleSubmit, control, watch, setValue } =
    useForm<CreateCustomerFormValues>();

  const { domain } = useParams() as { domain: string };
  const router = useRouter();

  const [createCustomer, { loading }] = useCreateCustomerMutation();

  const watchAddress = watch("defaultAddress");

  const onSubmit: SubmitHandler<CreateCustomerFormValues> = async (data) => {
    try {
      const result = await createCustomer({
        variables: {
          defaultDomain: domain,
          customerInputs: data,
        },
      });
      if (result.data?.createCustomer?.customer?.customerId) {
        toast.success("Customer created successfully!");
        router.push(
          `/store/${domain}/customers/${result.data.createCustomer.customer.customerId}`
        );
      }
    } catch (error) {
      console.error("Error creating customer", error);
      toast.error("Failed to create customer!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <h1 className="h1">New customer</h1>
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
                  watchAddress={undefined}
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
        disabled={loading}
      >
        {loading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
        Add
      </Button>
    </form>
  );
}
