"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { deleteData } from "@/lib/function";
import ActionCell from "@/components/ActionCell";
import ReceiptCard from "../cards/ReceiptCard";
import { Appointment } from "@/lib/types/appointment-types";

export const appointmentColumn: ColumnDef<Appointment>[] = [
  {
    accessorKey: "appointment_id",
    header: "Appointment ID",
  },
  {
    accessorKey: "start_time",
    header: "First Service Time",
    cell: ({ row }) => {
      const time = row.original.services?.[0]?.start_time;
      if (!time) return "N/A";
      
      return new Date(time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    },
  },
  {
    accessorKey: "customer_name_snapshot",
    header: "Customer",
  },
  {
    accessorKey: "to_pay",
    header: "To Pay",
    cell: ({ row }) => {
      return `₱${row.original.to_pay.toFixed(2)}`;
    },
  },
  {
    // Overall appointment status (auto-calculated from services)
    // completed = green, waiting = confirmed = blue, on-process = yellow, cancelled = red, pending = gray
    accessorKey: "status",
    header: "Current Status",
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
                : s == "On-process"
                  ? "bg-yellow-100 text-yellow-700"
                  : s == "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : s == "Pending"
                      ? "bg-gray-100 text-gray-700"
                      : ""
          }`}
        >
          {s == "Waiting" ? "Confirmed" : s}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { appointment_id, status } = row.original;
      
      // If appointment is completed or cancelled, only allow preview
      const isCompleted = status === "completed" || status === "cancelled";
      
      // Actions available:
      // - Preview: View receipt with all services and their individual statuses
      // - Delete: Only for non-completed/non-cancelled appointments

      return (
        <ActionCell
          deleteFn={!isCompleted ? (id: string) => deleteData({ id: id, url: "appointment" }) : undefined}
          deleteMessage={!isCompleted ? "Appointment has been deleted." : undefined}
          queryKey="appointment"
          id={appointment_id}
          previewDialog={<ReceiptCard appointment={row.original} />}
          isCompleted={isCompleted}
        />
      );
    },
  },
];
