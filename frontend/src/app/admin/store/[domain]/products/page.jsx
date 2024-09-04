"use client";

import { Dropdown } from "flowbite-react";
import { CiSearch } from "react-icons/ci";

export default function Products() {
  return (
    <div className="w-full">
      <div className="card p-3 font-medium text-sm my-3">
        <h2>Filter</h2>
        <div className="flex justify-around items-center p-2">
          <Dropdown label="Status" color="light">
            <Dropdown.Item value="all">All</Dropdown.Item>
            <Dropdown.Item value="ACTIVE">Active</Dropdown.Item>
            <Dropdown.Item value="DRAFT">Draft</Dropdown.Item>
          </Dropdown>
        </div>
        <hr className="my-2" />
        <div className="flex justify-around items-center p-2">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <CiSearch />
              </div>
              <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
            </div>
        </div>
      </div>
    </div>
  )
}
