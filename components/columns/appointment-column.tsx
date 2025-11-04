"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { deleteData, formatTo12HourTime } from "@/lib/function";
import ActionCell from "@/components/ActionCell";
import ReceiptCard from "../cards/ReceiptCard";
import ChangeAestheticianModal from "../modals/ChangeAestheticianModal";
import { Appointment } from "@/lib/types/appointment-types";

export const appointmentColumn: ColumnDef<Appointment>[] = [
  {
    accessorKey: "appointment_id",
    header: "Appointment ID",
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: ({ row }) => {
      const time = row.original.start_time;

      return formatTo12HourTime(time);
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
    // completed = green
    // waiting = blue
    // pending = gray
    accessorKey: "appointment_status",
    header: "Appointment Status",
    cell: ({ row }) => {
      console.log(row.original.start_time)
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
          {s}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { appointment_id, aesthetician_id, branch_id, status } = row.original;
      
      // Only show change aesthetician for pending and waiting appointments
      const canChangeAesthetician = status === "pending" || status === "waiting";

      return (
        <ActionCell
          deleteFn={(id: string) => deleteData({ id: id, url: "appointment" })}
          deleteMessage="Appointment has been deleted."
          queryKey="appointment"
          id={appointment_id}
          editAppointmentStatus={true}
          previewDialog={<ReceiptCard appointment={row.original} />}
          changeAestheticianDialog={
            canChangeAesthetician && branch_id ? (
              <ChangeAestheticianModal
                appointmentId={appointment_id}
                currentAestheticianId={aesthetician_id || ""}
                branchId={branch_id}
              />
            ) : undefined
          }
        />
      );
    },
  },
];
