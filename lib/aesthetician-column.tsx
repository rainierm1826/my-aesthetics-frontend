"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Aesthetician } from "./types";
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
import { Badge } from "@/components/ui/badge";
import { RatingStar } from "@/components/RatingStar";

export const aestheticianColumn: ColumnDef<Aesthetician>[] = [
  {
    id: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const { firstName, lastName, middleInitial } = row.original;
      return `${firstName} ${middleInitial}. ${lastName}`;
    },
  },
  {
    accessorKey: "branchName",
    header: "Branch Name",
  },
  {
    accessorKey: "experience",
    header: "Experience",

    // pro = green
    // regular = grey

    cell: ({ row }) => {
      const { experience } = row.original;
      const e = experience.charAt(0).toUpperCase() + experience.slice(1);
      return (
        <Badge
          className={`text-white rounded-full ${
            e == "Professional"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {e}
        </Badge>
      );
    },
  },
  {
    accessorKey: "availability",
    header: "Availability",
    cell: ({ row }) => {
      const { availability } = row.original;
      const a = availability.charAt(0).toUpperCase() + availability.slice(1);

      //   available = green
      //   working = yellow
      //   OffDuty = RED
      //   Break = orange

      return (
        <Badge
          className={`text-white rounded-full ${
            a == "Available"
              ? "bg-green-100 text-green-700"
              : a == "Working"
              ? "bg-yellow-100 text-yellow-500"
              : a == "Off-duty"
              ? "bg-red-100 text-red-700"
              : a == "On-break"
              ? "bg-orange-100 text-orange-500"
              : ""
          }`}
        >
          {a}
        </Badge>
      );
    },
  },

  {
    accessorKey: "avarageRate",
    header: "Avarage Rate",
    cell: ({ row }) => {
      return <RatingStar rating={row.original.averageRate} />;
    },
  },
  {
    accessorKey: "sex",
    header: "Sex",
    cell: ({ row }) => {
      const { sex } = row.original;
      return sex.charAt(0).toUpperCase() + sex.slice(1);
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
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
