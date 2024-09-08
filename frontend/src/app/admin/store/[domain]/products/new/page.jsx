"use client";

import { TextInput, Label } from "flowbite-react";

export default function AddProduct() {
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
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="card">test2</div>
      </div>
    </div>
  )
}
