"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function collections() {
  const currentPath = usePathname();

  // Mock data for collections
  const mockCollections = [
    { title: "Collection 1", products: 5 },
    { title: "Collection 2", products: 0 },
    { title: "Collection 3", products: 12 },
  ];

  return (
    <div className="p-8">
      {/* header page */}
      <div className="flex justify-between">
        <h1 className="h1">Collections</h1>
        <Link
          href={`${currentPath}/new`}
          className={`${buttonVariants({ variant: "outline", size: "sm" })}`}
        >
          Create collection
        </Link>
      </div>

      {/* table */}
      {mockCollections.length > 0 ? (
        <Table className="border border-collapse mt-2">
          <TableHeader>
            <TableRow>
              <TableHead className="border-r">Title</TableHead>
              <TableHead>Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCollections.map((collection, index) => (
              <TableRow key={index}>
                <TableCell className="border-r">
                  <Link href={`/${currentPath}/${collection.title}`}>
                    {collection.title}
                  </Link>
                </TableCell>
                <TableCell>{collection.products}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center mt-8">No collections found.</p>
      )}
    </div>
  );
}
