"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { PRODUCTS_ADMIN_PAGE } from "@/graphql/queries";
import Lottie from "lottie-react";
import Error from "@/components/admin/Error";
import animation from "@/assets/animation/loading.json";
import Image from "next/image";
import { RxReload } from "react-icons/rx";
import { Badge } from "@/components/ui/badge";
// shadcn
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Products({ params }) {
  const [error, setError] = useState(false);
  const [products, setProducts] = useState(null);
  const pathname = usePathname();
  const domain = params.domain;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [endCursor, setEndCursor] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [countProduct, setCountProduct] = useState(5);
  const [loading, setLoading] = useState(false);
  const [notFoundProducts, setNotFoundProducts] = useState(false);

  const handleFilterChange = (e) => {
    setEndCursor("");
    const { name, value } = e;
    const params = new URLSearchParams(searchParams);

    params.set(name, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/get-data", {
        query: PRODUCTS_ADMIN_PAGE,
        variables: {
          domain: domain,
          search: searchQuery,
          status: status === "all" ? undefined : status,
          first: countProduct,
          after: endCursor,
        },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setProducts(response.data.allProducts.edges);
      setEndCursor(response.data.allProducts.pageInfo.endCursor);
      setHasNextPage(response.data.allProducts.pageInfo.hasNextPage);
      if (response.data.allProducts.edges.length === 0) {
        setNotFoundProducts(true);
      } else {
        setNotFoundProducts(false);
      }
    } catch (error) {
      console.error("Error fetching store details:", error.message);
      setProducts(null);
      setError(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    setStatus(searchParams.get("status") || "all");
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);
  useEffect(() => {
    getData();
  }, [searchQuery, status, countProduct]);

  if (error) {
    return <Error />;
  }

  if (products === null) {
    return <Lottie animationData={animation} loop={true} />;
  }

  return (
    <div className="p-5">
      {/* header section */}
      <div className="flex justify-between">
        {/* title */}
        <h1 className="text-lg font-bold dark:text-white">Products</h1>
        {/* button actions */}
        <div className="flex justify-center gap-2">
          <Link
            href={`${pathname}/new`}
            className={buttonVariants({ variant: "outline" })}
          >
            Add product
          </Link>
        </div>
      </div>
      {/* products tables */}
      <Card className="my-3 shadow-md">
        <CardHeader className="border-b-2 py-2 bg-gray-100 dark:bg-slate-800">
          <div className="flex justify-between items-center gap-2">
            {/* status input */}
            <div>
              <div className="mb-1">
                <p className="text-sm font-bold">Status</p>
              </div>
              <Select
                defaultValue={status}
                id="status"
                onChange={(e) => handleFilterChange(e)}
                onValueChange={(value) =>
                  handleFilterChange({ value: value, name: "status" })
                }
              >
                <SelectTrigger className="w-[85px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* search input */}
            <div>
              <div className="mb-1">
                <Label htmlFor="search">Search</Label>
              </div>
              <Input
                id="search"
                type="text"
                name="search"
                onChange={(e) => handleFilterChange(e.target)}
                placeholder="Search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* loading */}
          {loading && (
            <div className="flex justify-center items-center my-2">
              <RxReload className="mr-2 h-4 w-4 animate-spin" /> Loading...
            </div>
          )}
          {/* notFoundProducts */}
          {notFoundProducts && (
            <div className="text-center text-sm font-semibold dark:text-white my-2">
              No products found
            </div>
          )}
          {/* products table */}
          {!notFoundProducts && (
            <Table className="border mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(({ node }) => (
                  <TableRow key={node.id}>
                    <TableCell>
                      <div className="flex justify-start gap-2 items-center">
                        <Image
                          src={
                            node.image?.image
                              ? `${process.env.NEXT_PUBLIC_ADMIN_URL}/${node.image.image}`
                              : "/assets/icons/blog.png"
                          }
                          loading={"lazy"}
                          width={40}
                          height={40}
                          quality={75}
                          alt={node.title}
                          className="rounded-md object-cover cursor-pointer"
                          style={{ width: "auto", height: "auto" }}
                        />
                        <h2>{node.title}</h2>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          node.status === "ACTIVE" ? "outline" : "destructive"
                        }
                      >
                        {node.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`${pathname}/${node.productId}`}>
                        <h2 className="text-blue-600 hover:text-blue-800">
                          Edit
                        </h2>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="justify-between border-t-2 py-2 bg-gray-100 dark:bg-slate-800">
          <div className="flex items-center gap-1 justify-between">
            Show
            <Select
              defaultValue={countProduct}
              onValueChange={(value) => {
                setCountProduct(parseInt(value));
                setEndCursor("");
              }}
            >
              <SelectTrigger className="w-[60px]">
                <SelectValue placeholder={countProduct} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            per page
          </div>
          <Button disabled={!hasNextPage} onClick={getData} size="sm">
            Load More
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
