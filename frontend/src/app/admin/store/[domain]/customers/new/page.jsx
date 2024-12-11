"use client";

import CustomerOverview from "@/components/admin/customer/CustomerOverview";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoReload } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CustomerAddressInputs from "@/components/admin/customer/CustomerAddressInputs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
export default function CreateCustomer() {
  const { register, handleSubmit, control, watch } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const address = watch("address");
  const onSubmit = async (data) => {
    console.log(data);
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
                  {address?.country && <h2>{address.country.name},</h2>}
                  {address?.city && <h2>{address.city}</h2>}
                </div>
                <CustomerAddressInputs register={register} control={control} />
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
