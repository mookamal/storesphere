"use client";
import GeneralInputs from "@/components/admin/collection/GeneralInputs";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoReload } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import SeoInputs from "@/components/admin/collection/SeoInputs";
export default function CreateCollection({ params }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm();
  const watchedTitle = watch("title");
  const handle = watch("handle");
  const seoTitle = watch("seoTitle");
  const handleBlur = () => {
    if (!handle) {
      setValue("handle", watchedTitle.replace(/\s+/g, "-").toLowerCase());
    }
    if (!seoTitle) {
      setValue("seoTitle", watchedTitle);
    }
  };
  const onSubmit = async (data) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5">
        <h1 className="h1">Add a new collection</h1>
        <div className="flex flex-col items-center my-5 gap-3">
          <GeneralInputs register={register} handleBlur={handleBlur} />
          <SeoInputs register={register} domain={params.domain} handle="test" />
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
