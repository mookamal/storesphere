"use client";

import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import { Button, Checkbox, Table, Badge, Select ,Label } from "flowbite-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import { PRODUCTS_ADMIN_PAGE } from "@/graphql/queries";
import Lottie from 'lottie-react';
import Error from "@/components/admin/Error";
import animation from "@/assets/animation/loading.json";
import { customThemeTable , customThemeSelect } from "@/lib/constants";

export default function Products({ params }) {
  const [error, setError] = useState(false);
  const [products, setProducts] = useState(null);
  const pathname = usePathname();
  const domain = params.domain;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [endCursor, setEndCursor] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const status = searchParams.get('status') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const handleFilterChange = (e) => {
    setEndCursor("");
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);

    params.set(name, value);
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const getData = async () => {
    try {
      const response = await axios.post('/api/get-data', {
        query: PRODUCTS_ADMIN_PAGE,
        variables: {
          domain: domain,
          search: searchQuery,
          status: status === 'all' ? undefined : status,
          after: endCursor,
        },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setProducts(response.data.allProducts.edges);
      setEndCursor(response.data.allProducts.pageInfo.endCursor);
      setHasNextPage(response.data.allProducts.pageInfo.hasNextPage);
    } catch (error) {
      console.error('Error fetching store details:', error.message);
      setProducts(null);
      setError(true);
    }
  }

  useEffect(() => {
    getData();
  }, [searchQuery,status]);

  if (error) {
    return <Error />
  }

  if (products === null) {
    return <Lottie animationData={animation} loop={true} />
  }

  return (
    <div className="w-full">
      <div className="card p-3 font-medium text-sm my-3">
        <h2>Filter</h2>
        <div className="flex justify-between items-center p-2">
          <div className="flex flex-col gap-1 text-center">
            <Label htmlFor="status">Status</Label>

            <Select name="status" theme={customThemeSelect} color="success" id="status" onChange={handleFilterChange} value={status}>
              <option value="all">All</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
            </Select>

          </div>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between items-center p-2">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <CiSearch />
            </div>
            <input type="text" name="search" onChange={handleFilterChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" />
          </div>
          <Link href={`${pathname}/new`}>
            <Button color="light" className="bg-yellow text-primary-text font-bold">
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
                <Table.Row key={node.id}>

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
        <div className="flex justify-end">
          {hasNextPage && <Button size="sm" color="light" className="bg-yellow text-primary-text font-bold" onClick={getData}>Load More</Button>}
        </div>
      </div>
    </div>
  )
}
