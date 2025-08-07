"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Admin } from "./types";
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
export const adminColumn: ColumnDef<Admin>[] = [
  {
    id: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const { firstName, middleInitial, lastName } = row.original;
      return `${firstName} ${middleInitial}. ${lastName}`;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "branchName",
    header: "Branch Name",
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
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
