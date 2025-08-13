"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Appointment } from "./types";
import { Badge } from "@/components/ui/badge";
import ActionCell from "@/components/ActionCell";

export const appointmentColumn: ColumnDef<Appointment>[] = [
  {
    accessorKey: "appointmentId",
    header: "Appointment ID",
  },
  {
    accessorKey: "slotNumber",
    header: "Slot",
  },
  {
    accessorKey: "userName",
    header: "Full Name",
  },
  {
    accessorKey: "toPay",
    header: "To Pay",
    cell: ({ row }) => {
      return `₱${row.original.toPay}`;
    },
  },
  {
    // completed = green
    // waiting = blue
    // pending = gray
    accessorKey: "appointmentStatus",
    header: "Appointment Status",
    cell: ({ row }) => {
      const { appointmentStatus } = row.original;
      const s =
        appointmentStatus.charAt(0).toUpperCase() + appointmentStatus.slice(1);
      return (
        <Badge
          className={`${
            s == "Completed"
              ? "bg-green-100 text-green-700"
              : s == "Waiting"
              ? "bg-blue-100 text-blue-700"
              : s == "Pending"
              ? "bg-gray-100 text-gray-700"
              : s == "Cancelled"
              ? "bg-red-100 text-red-700"
              : ""
          }`}
        >
          {s}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionCell data={row.original} />;
    },
  },
];
