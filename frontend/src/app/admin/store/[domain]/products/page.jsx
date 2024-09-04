"use client";

import { Dropdown } from "flowbite-react";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import { Button, Checkbox, Table } from "flowbite-react";
import { usePathname } from "next/navigation";

const customThemeTable = {
  head: {
    "base": "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
    "cell": {
      "base": "bg-screen-primary px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700 text-center"
    }
  }
}

export default function Products({ params }) {
  const currentPath = usePathname();

  return (
    <div className="w-full">
      <div className="card p-3 font-medium text-sm my-3">
        <h2>Filter</h2>
        <div className="flex justify-between items-center p-2">
          <Dropdown label="Status" color="light">
            <Dropdown.Item value="all">All</Dropdown.Item>
            <Dropdown.Item value="ACTIVE">Active</Dropdown.Item>
            <Dropdown.Item value="DRAFT">Draft</Dropdown.Item>
          </Dropdown>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between items-center p-2">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <CiSearch />
            </div>
            <input type="text" id="search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" />
          </div>
          <Link href={`${currentPath}/new`}>
            <Button color="dark">
              Add product
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto my-3">
          <Table hoverable theme={customThemeTable}>

            <Table.Head>
              <Table.HeadCell>Product</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">

                <Table.Cell>
                  <div className="flex justify-between">
                    <Checkbox />
                    <h2>product name</h2>
                  </div>
                </Table.Cell>

                <Table.Cell>White</Table.Cell>
              </Table.Row>
            </Table.Body>

          </Table>
        </div>
      </div>
    </div>
  )
}
