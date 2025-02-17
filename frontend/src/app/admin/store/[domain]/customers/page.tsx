"use client";

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
import { useCustomerListAdminQuery } from "@/codegen/generated";

export default function Customers(): JSX.Element {
  const { domain } = useParams() as { domain: string };
  const currentPath = usePathname();

  const { data, loading, fetchMore } = useCustomerListAdminQuery({
    variables: { domain, first: 10, after: "" },
    notifyOnNetworkStatusChange: true,
  });

  const customers =
    data?.customerListAdmin?.edges.map((node) => node?.node) ?? [];
  const hasNextPage = data?.customerListAdmin?.pageInfo?.hasNextPage ?? false;
  const endCursor = data?.customerListAdmin?.pageInfo?.endCursor ?? "";

  const loadMore = async (): Promise<void> => {
    if (!hasNextPage) return;
    try {
      await fetchMore({
        variables: { after: endCursor },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h1 className="h1">Customers</h1>
        <Link
          href={`${currentPath}/new`}
          className={`${buttonVariants({ variant: "outline", size: "sm" })}`}
        >
          Create customer
        </Link>
      </div>
      {loading ? (
        <p className="text-center mt-8">Loading...</p>
      ) : customers.length === 0 ? (
        <p className="text-center mt-8">No customers found.</p>
      ) : (
        <div className="border rounded mt-4 shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-black dark:text-white">
                <TableHead>Customer name</TableHead>
                <TableHead className="w-[150px]">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((node) => (
                <TableRow
                  key={node?.id}
                  className="hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white"
                >
                  <TableCell>
                    <Link
                      href={`${currentPath}/${node?.customerId}`}
                      className="hover:border-b"
                    >
                      {node?.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>{node?.defaultAddress?.country?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="border-t">
                <TableCell colSpan={2}>
                  <Button
                    disabled={!hasNextPage}
                    onClick={loadMore}
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
