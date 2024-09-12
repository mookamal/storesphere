"use client";

import { TextInput, Label, Select, Button, Spinner,Textarea } from "flowbite-react";
import dynamic from 'next/dynamic';
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { CREATE_PRODUCT } from "@/graphql/mutations";
const CustomEditor = dynamic(() => import('@/components/custom-editor'), { ssr: false });
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';

export default function AddProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const domain = useParams().domain;
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


  const onSubmit = async (data) => {
    setLoading(true);
    const productData = {
      title: data.title,
      description: data.description,
      status: data.status,
      seo: {
        title: data.seoTitle,
        description: data.seoDescription,
      }
    }
    const variables = {
      defaultDomain: domain,
      product: productData
    };
    try {
      const response = await axios.post('/api/set-data', { query: CREATE_PRODUCT, variables: variables });
      setLoading(false);
      if (response.data.data.createProduct.product.productId) {
        router.push(`/store/${domain}/products/${response.data.data.createProduct.product.productId}`);
        toast.success("Product created successfully!");
      }
      else {
        toast.error("Failed to create product!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create product!");
    }
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

        <div className="lg:col-span-1">
          <div className="card p-3">
            <h2>SEO data</h2>
            <div className="my-2">
              <div className="mb-2">
                <Label htmlFor="seoTitle" value="Page title" />
              </div>
              <TextInput id="seoTitle" sizing="sm" type="text" {...register("seoTitle")} placeholder="seo title" />
            </div>
            <div className="my-2">
              <div className="mb-2">
                <Label htmlFor="seoDescription" value="Page description" />
              </div>
              <Textarea id="seoDescription" sizing="sm" {...register("seoDescription")} placeholder="seo description" rows={3} />
            </div>
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
