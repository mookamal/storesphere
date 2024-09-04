"use client";

import { Dropdown } from "flowbite-react";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import { Button, Checkbox, Table, Badge } from "flowbite-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import { PRODUCTS_ADMIN_PAGE } from "@/graphql/queries";
import Lottie from 'lottie-react';
import Error from "@/components/admin/Error";
import animation from "@/assets/animation/loading.json";

const customThemeTable = {
  head: {
    "base": "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
    "cell": {
      "base": "bg-screen-primary px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700"
    }
  }
}

export default function Products({ params }) {
  const [error, setError] = useState(false);
  const [products, setProducts] = useState(null);
  const currentPath = usePathname();
  const domain = params.domain;

  const getData = async () => {
    try {
      const response = await axios.post('/api/get-data', {
        query: PRODUCTS_ADMIN_PAGE,
        variables: { domain: domain },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setProducts(response.data.allProducts.edges);
    } catch (error) {
      console.error('Error fetching store details:', error.message);
      setProducts(null);
      setError(true);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  if (error) {
    return <Error />
  }

  if (!products) {
    return <Lottie animationData={animation} loop={true} />
  }

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
              {products.map(({ node }) => (
                <Table.Row key={node.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">

                  <Table.Cell>
                    <div className="flex justify-start gap-2 items-center">
                      <Checkbox />
                      <h2>{node.title}</h2>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <Badge color={node.status === 'ACTIVE'? 'success' : 'warning'}>
                    {node.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}

            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  )
}
