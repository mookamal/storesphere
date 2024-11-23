"use client";
import GeneralInputs from "@/components/admin/collection/GeneralInputs";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoReload } from "react-icons/io5";
import { Button } from "@/components/ui/button";
export default function CreateCollection() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <h1 className="h1">Add a new collection</h1>
        <div className="flex justify-center my-5">
          <GeneralInputs register={register} />
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
