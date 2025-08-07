"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Branch } from "./types";
import { Pencil, Trash2 } from "lucide-react"; // Optional icons
import { Button } from "@/components/ui/button"; // If you're using a custom Button

export const branchColumns: ColumnDef<Branch>[] = [
  {
    accessorKey: "branchName",
    header: "Branch Name",
  },
  {
    accessorKey: "region",
    header: "Region",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "barangay",
    header: "Barangay",
  },
  {
    accessorKey: "blk",
    header: "Blk",
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => {
      return (
        <div className="flex items-center">
          <Button size="sm" variant="ghost">
            <Pencil className="w-4 h-4 text-blue-400" />
          </Button>
          <Button size="sm" variant="ghost">
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>
      );
    },
  },
];
