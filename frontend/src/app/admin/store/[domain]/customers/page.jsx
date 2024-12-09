"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function Customers() {
  const currentPath = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState(null);

  const getData = async () => {};
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
                <TableHead className="border-r">Full name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(({ node }) => (
                <TableRow
                  key={node.id}
                  className="hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white"
                >
                  <TableCell className="border-r">
                    <Link
                      href={`${currentPath}/${node.customerId}`}
                      className="hover:border-b"
                    >
                      {node.fullName}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
