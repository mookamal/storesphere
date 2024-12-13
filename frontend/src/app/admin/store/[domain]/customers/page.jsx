"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { CUSTOMER_LIST_ADMIN } from "@/graphql/queries";
export default function Customers() {
  const domain = useParams().domain;
  const currentPath = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState(null);
  const [endCursor, setEndCursor] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    try {
      const variables = {
        domain: domain,
        first: 10,
        after: endCursor,
      };
      const response = await axios.post("/api/get-data", {
        query: CUSTOMER_LIST_ADMIN,
        variables: variables,
      });
      if (response.data.customerListAdmin.edges.length > 0) {
        setCustomers(response.data.customerListAdmin.edges);
        setHasNextPage(response.data.customerListAdmin.pageInfo.hasNextPage);
        setEndCursor(response.data.customerListAdmin.pageInfo.endCursor);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error(error);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="p-8">
      {/* head page */}
      <div className="flex justify-between">
        <h1 className="h1">Customers</h1>
        <Link
          href={`${currentPath}/new`}
          className={`${buttonVariants({ variant: "outline", size: "sm" })}`}
        >
          Create customer
        </Link>
      </div>
      {/* table */}
      {isLoading ? (
        <p className="text-center mt-8">Loading...</p>
      ) : customers === null ? (
        ""
      ) : customers.length === 0 ? (
        <p className="text-center mt-8">No customers found.</p>
      ) : (
        <div className="border rounded mt-4 shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-black dark:text-white">
                <TableHead>Customer name</TableHead>
                <TableHead className=" w-[150px]">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(({ node }) => (
                <TableRow
                  key={node.id}
                  className="hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white"
                >
                  <TableCell>
                    <Link
                      href={`${currentPath}/${node.customerId}`}
                      className="hover:border-b"
                    >
                      {node.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>{node.defaultAddress?.country?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="border-t">
                <TableCell colSpan="2">
                  <Button
                    disabled={!hasNextPage}
                    onClick={getData}
                    variant="outline"
                    size="sm"
                  >
                    Load more
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
}
