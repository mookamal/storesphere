"use client";

import { Dropdown } from "flowbite-react";
export default function Products() {
  return (
    <div className="w-full">
      <div className="card p-3 font-medium text-sm my-3">
        <h2>Filter</h2>
        <div className="flex justify-around my-2 items-center border-b-2 p-2">
          <Dropdown label="Status" color="light">
            <Dropdown.Item value="all">All</Dropdown.Item>
            <Dropdown.Item value="ACTIVE">Active</Dropdown.Item>
            <Dropdown.Item value="DRAFT">Draft</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
