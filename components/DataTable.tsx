"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useState } from "react";
import type {
  VisibilityState,
  Table as ReactTableType,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children?: ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  children,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    phoneNumber: false,
    sex: false,
    barangay: false,
    blk: false,
    isSale: false,
    discountPercentage: false,
  });

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function ColumnToggle({ table }: { table: ReactTableType<TData> }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#FBF9F2] text-black hover:bg-[#FBF9F2] focus-visible:border-0">
            Columns <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                column.getCanHide() && !["id", "actions"].includes(column.id)
            )
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {typeof column.columnDef.header === "string"
                  ? column.columnDef.header
                  : column.columnDef.header?.toString?.() || column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="">
      {/* action table*/}
      <div className="mb-5">{children}</div>

      {/* Table */}
      <div className="overflow-hidden border-1">
        <Table>
          <TableHeader className="font-extrabold bg-primary/15">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="even:bg-primary/5 text-xs"
                >
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="my-5 flex justify-between">
        <DataTablePagination />
        <div className="flex gap-3">
          <DataTableEntries />
          <ColumnToggle table={table} />
        </div>
      </div>
    </div>
  );
}

const DataTablePagination = () => {
  return (
    <Pagination className="flex justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" className="text-[#7C7C7C]"/>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            className="bg-[#FBF9F2] text-black hover:bg-[#FBF9F2] focus-visible:border-0"
          >
            1
          </PaginationLink>
          <PaginationLink href="#">2</PaginationLink>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" className="text-[#7C7C7C]"/>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const DataTableEntries = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#FBF9F2] text-black hover:bg-[#FBF9F2] focus-visible:border-0">
          Show Entries <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>10</DropdownMenuItem>
        <DropdownMenuItem>15</DropdownMenuItem>
        <DropdownMenuItem>20</DropdownMenuItem>
        <DropdownMenuItem>25</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
