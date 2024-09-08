"use client";

import { TextInput, Label } from "flowbite-react";
import dynamic from 'next/dynamic';
import { useForm } from "react-hook-form";

const CustomEditor = dynamic(() => import('@/components/custom-editor'), { ssr: false });

export default function AddProduct() {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      description: "",
    },
  });

  const description = watch("description");

  const onSubmit = (data) => {
    console.log("Form Data: ", data);
  };

  const handleEditorChange = (content) => {
    setValue("description", content);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card p-3">

            <div>
              <div className="mb-2">
                <Label htmlFor="title" value="Title" />
              </div>
              <TextInput id="title" sizing="sm" type="text" {...register("title")} />
            </div>

            <div className="my-2">
              <div className="mb-2">
                <Label htmlFor="description" value="Description" />
              </div>
              {/* CustomEditor with description */}
              <CustomEditor id="description" content={description} setContent={handleEditorChange} />
            </div>
          </div>

        </div>
        <div className="lg:col-span-1">
          <div className="card">test2</div>
        </div>
      </div>
    </form>
  )
}
