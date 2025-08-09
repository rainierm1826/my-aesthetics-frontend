"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Branch } from "./types";
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

export const branchColumns: ColumnDef<Branch>[] = [
  {
    accessorKey: "branchName",
    header: "Branch Name",
  },

  {
    accessorKey: "avarageRate",
    header: "Avarage Rate",
    cell: ({ row }) => {
      return <RatingStar rating={row.original.avarageRate} />;
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const { region, city } = row.original;
      return `${region}, ${city}`;
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
