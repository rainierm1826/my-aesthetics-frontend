"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@/lib/types/appointment-types";
import { ordinal } from "@/lib/function";
// import ActionCell from "@/components/ActionCell";

export const appointmentColumn: ColumnDef<Appointment>[] = [
  {
    accessorKey: "appointment_id",
    header: "Appointment ID",
  },
  {
    accessorKey: "slot_number",
    header: "On Queue",
    cell: ({ row }) => {
      return ordinal(row.original.slot_number);
    },
  },
  {
    id: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const fullName = row.original.walk_in
        ? `${row.original.walk_in.first_name} ${
            row.original.walk_in.middle_initial ?? ""
          } ${row.original.walk_in.last_name}`.trim()
        : row.original.user
        ? `${row.original.user.first_name} ${
            row.original.user.middle_initial ?? ""
          } ${row.original.user.last_name}`.trim()
        : "";

      return fullName;
    },
  },
  {
    accessorKey: "to_pay",
    header: "To Pay",
    cell: ({ row }) => {
      return `₱${row.original.to_pay}`;
    },
  },
  {
    // completed = green
    // waiting = blue
    // pending = gray
    accessorKey: "appointmentStatus",
    header: "Appointment Status",
    cell: ({ row }) => {
      const { status } = row.original;
      const s = status.charAt(0).toUpperCase() + status.slice(1);
      return (
        <Badge
          className={`rounded-full ${
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
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return <ActionCell data={row.original.appointment_id} />;
  //   },
  // },
];
