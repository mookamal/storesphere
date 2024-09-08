"use client";

import { TextInput, Label } from "flowbite-react";
import dynamic from 'next/dynamic';
import { useState } from "react";

const CustomEditor = dynamic( () => import( '@/components/custom-editor' ), { ssr: false } );

export default function AddProduct() {
  const [description, setDescription] = useState("");
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <div className="card p-3">

          <div>
            <div className="mb-2">
              <Label htmlFor="name" value="Product name" />
            </div>
            <TextInput id="name" sizing="sm" type="text" placeholder="Product 1" />
          </div>

          <div>
            <div className="mb-2">
              <Label htmlFor="description" value="Product description"  />
            </div>
            <CustomEditor name="description" content={description} setContent={setDescription} />
          </div>
        </div>

      </div>
      <div className="lg:col-span-1">
        <div className="card">test2</div>
      </div>
    </div>
  )
}
