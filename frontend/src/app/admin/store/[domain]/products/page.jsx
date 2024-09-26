"use client";

import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import {
  Button,
  Checkbox,
  Table,
  Badge,
  Select,
  Spinner,
} from "flowbite-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { PRODUCTS_ADMIN_PAGE } from "@/graphql/queries";
import Lottie from "lottie-react";
import Error from "@/components/admin/Error";
import animation from "@/assets/animation/loading.json";
import { customThemeTable } from "@/lib/constants";
import Image from "next/image";

export default function Products({ params }) {
  const [error, setError] = useState(false);
  const [products, setProducts] = useState(null);
  const pathname = usePathname();
  const domain = params.domain;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [endCursor, setEndCursor] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const status = searchParams.get("status") || "all";
  const searchQuery = searchParams.get("search") || "";
  const [countProduct, setCountProduct] = useState(5);
  const [loading, setLoading] = useState(false);
  const [notFoundProducts, setNotFoundProducts] = useState(false);

  const handleFilterChange = (e) => {
    setEndCursor("");
    const { name, value } = e.target;
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
    getData();
  }, [searchQuery, status, countProduct]);

  if (error) {
    return <Error />;
  }

  if (products === null) {
    return <Lottie animationData={animation} loop={true} />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-end">
        <Link href={`${pathname}/new`}>
          <Button
            color="light"
            className="bg-m-yellow text-primary-text font-bold"
          >
            Add product
          </Button>
        </Link>
      </div>
      {/* card */}
      <div className="card my-3">
        {/* header */}
        <div className="card-header gap-1">
          {/* status */}
          <Select
            name="status"
            sizing="sm"
            id="status"
            onChange={handleFilterChange}
            value={status}
          >
            <option value="all">All</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
          </Select>
          {/* End status */}
          {/* loading */}
          {loading && (
            <Spinner color="info" size="lg" aria-label="Loading page" />
          )}
          {/* End loading */}
          {/* search */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <CiSearch />
            </div>
            <input
              type="text"
              name="search"
              onChange={handleFilterChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
            />
          </div>
          {/* End search */}
        </div>
        {/* End header */}

        {/* body */}
        <div className="card-body">
          {/* not found */}
          {notFoundProducts && (
            <div className="text-center p-2">
              <h2 className="text-lg font-bold text-coal-black">
                No products found
              </h2>
            </div>
          )}
          {/* End not found */}
          {/* products */}
          {!notFoundProducts && (
            <div className="overflow-x-auto my-3">
              <Table hoverable theme={customThemeTable}>
                <Table.Head>
                  <Table.HeadCell>Product</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell></Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {products.map(({ node }) => (
                    <Table.Row key={node.id}>
                      <Table.Cell>
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
                          <Checkbox />
                          <h2>{node.title}</h2>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <Badge
                          color={
                            node.status === "ACTIVE" ? "success" : "warning"
                          }
                        >
                          {node.status}
                        </Badge>
                      </Table.Cell>

                      <Table.Cell>
                        <Link href={`${pathname}/${node.productId}`}>
                          <h2 className="text-blue-600 hover:text-blue-800">
                            Edit
                          </h2>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
          {/* End products */}
          <div className="card-footer flex justify-center md:justify-between flex-col md:flex-row gap-2 text-gray-600 text-2sm font-medium">
            <div className="flex items-center gap-1 justify-between">
              Show
              <Select
                name="showCountProduct"
                sizing="sm"
                value={countProduct}
                onChange={(e) => {
                  setCountProduct(parseInt(e.target.value));
                  setEndCursor("");
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </Select>
              per page
            </div>
            <Button
              size="sm"
              color="light"
              className="bg-m-yellow text-primary-text font-bold"
              disabled={!hasNextPage}
              onClick={getData}
            >
              Load More
            </Button>
          </div>
        </div>
      </div>
      {/* End card */}
    </div>
  );
}
