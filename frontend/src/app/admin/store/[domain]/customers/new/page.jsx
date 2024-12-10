"use client";

import CustomerOverview from "@/components/admin/customer/CustomerOverview";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoReload } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CustomerAddressInputs from "@/components/admin/customer/CustomerAddressInputs";
export default function CreateCustomer() {
  const { register, handleSubmit, watch } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <h1 className="h1">New customer</h1>
        <div className="flex flex-col items-center my-5 gap-3">
          <CustomerOverview register={register} />
          <CustomerAddressInputs register={register} />
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
