"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define interface for table actions
export interface TableAction<T> {
  // Action type, e.g. "edit" or "delete"
  type: "edit" | "delete" | string;
  // Label to display on the action button
  label: string;
  // Callback function when the action button is clicked, receiving the row data
  onClick: (row: T) => void;
}

// Define interface for DataTable component props with a generic type T
export interface DataTableProps<T> {
  // Array of column definitions for the table
  columns: ColumnDef<T, any>[];
  // Array of data rows to display in the table
  data: T[];
  // Optional actions to be appended as an extra column
  actions?: TableAction<T>[];
}

function DataTable<T>({ columns, data, actions }: DataTableProps<T>): JSX.Element {
  // Create the table instance using TanStack React Table
  const table = useReactTable<T>({
    data,
    columns: [
      ...columns,
      // If actions are provided, append an extra "actions" column
      ...(actions
        ? [
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }: { row: any }) => (
                <div className="flex gap-2">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      // Styling based on the action type
                      className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        action.type === "edit"
                          ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-500"
                          : "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-500"
                      }`}
                      onClick={() => action.onClick(row.original)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              ),
            },
          ]
        : []),
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full shadow-md rounded-lg border dark:border-gray-700">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b dark:border-gray-700"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
                  >
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
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-900"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                    >
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
                <TableCell
                  // If actions exist, add 1 to the colSpan
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="h-24 text-center text-gray-500 dark:text-gray-400"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DataTable;
