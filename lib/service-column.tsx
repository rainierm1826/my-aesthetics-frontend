"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Service } from "./types";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RatingStar } from "@/components/RatingStar";
import { Badge } from "@/components/ui/badge";

export const serviceColumn: ColumnDef<Service>[] = [
  {
    accessorKey: "serviceName",
    header: "Service Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "avarageRate",
    header: "Avarage Rate",
    cell: ({ row }) => {
      return <RatingStar rating={row.original.averageRate} />;
    },
  },
  {
    accessorKey: "isSale",
    header: "Sale",
    cell: ({ row }) => {
      const { isSale } = row.original;
      return (
        <Badge
          className={`rounded-full ${
            isSale ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {isSale ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount",
    cell: ({ row }) => {
      return `${row.original.discountPercentage}%`;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return (
        <p>
          <span className="line-through decoration- text-[#7C7C7C]">
            ₱{row.original.originalPrice}
          </span>{" "}
          ₱{row.original.finalPrice}
        </p>
      );
    },
  },

  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="focus-visible:border-0">
            <Button
              size={"icon"}
              variant={"ghost"}
              className="hover:text-[#7C7C7C] hover:bg-transparent"
            >
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-blue-400 hover:text-blue-500 hover:bg-transparent">
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 hover:text-red-500 hover:bg-transparent">
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-700 hover:text-gray-900 hover:bg-transparent">
              Preview
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
