"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DataTable({ columns, data, actions }) {
  const table = useReactTable({
    data,
    columns: [
      ...columns,
      ...(actions
        ? [
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }) =>
                actions.map((action, index) => (
                  <button
                    key={index}
                    className={`px-2 py-1 text-sm rounded-md ${
                      action.type === "edit"
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                    onClick={() => action.onClick(row.original)}
                  >
                    {action.label}
                  </button>
                )),
            },
          ]
        : []),
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
