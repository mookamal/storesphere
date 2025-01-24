"use client";

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const productColumns = [
  columnHelper.accessor("productId", {
    header: "Product ID",
  }),
  columnHelper.accessor("title", {
    header: "Title",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
];