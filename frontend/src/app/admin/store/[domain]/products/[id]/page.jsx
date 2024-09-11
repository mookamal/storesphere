"use client";

import { TextInput, Label, Select, Button, Spinner } from "flowbite-react";
import dynamic from 'next/dynamic';
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams,notFound } from "next/navigation";
import axios from "axios";
const CustomEditor = dynamic(() => import('@/components/custom-editor'), { ssr: false });
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
import { GET_PRODUCT_BY_ID } from "@/graphql/queries";

export default function UpdateProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const productId = useParams().id;
  const [data , setData] = useState(null);
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const description = watch("description");
  const watchedTitle = watch('title');

  const debouncedUpdate = debounce((field, value) => {
  }, 500);

  useEffect(() => {
    debouncedUpdate('title', watchedTitle);
    debouncedUpdate('description', description);
    return () => {
      debouncedUpdate.cancel();
    };
  }, [watchedTitle, description]);

  useEffect(() => {
    getProductById();
  }, []);

  const getProductById = async () => {
    try {
      const response = await axios.post('/api/get-data', {
        query: GET_PRODUCT_BY_ID,
        variables: { id: productId },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }
      if (response.data) {
        setData(response.data.product);
      }
      else {
        toast.error('Failed to fetch product details');
        setIsNotFound(true);
      }
    } catch (error) {
      toast.error('Failed to update product');
      setIsNotFound(true);
    }
  }

  const onSubmit = async (data) => {

  };

  const handleEditorChange = (content) => {
    setValue("description", content);
  };

  if (isNotFound) return notFound();

  if (!data) {
    return <div className="flex justify-center items-center h-full"><Spinner aria-label="Loading button"  size="lg" /></div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card p-3">

            <div>
              <div className="mb-2">
                <Label htmlFor="title" value="Title" />
              </div>
              <TextInput id="title" sizing="sm" type="text" {...register("title")} placeholder="Product 1" required />
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
          <div className="card p-3">
            <div className="mb-2">
              <Label htmlFor="status" value="Status" />
            </div>
            <Select sizing="sm" id="status" {...register("status")}>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
            </Select>
          </div>
        </div>
      </div>
      <Button size="xl" color="light" type="submit" className="fixed bottom-5 right-5 rounded-full shadow-md bg-baby-blue text-coal-600" disabled={loading}>
        {loading && <Spinner aria-label="Loading button" className="mr-1" size="md" />}
        Add
      </Button>
    </form>
  )
}
