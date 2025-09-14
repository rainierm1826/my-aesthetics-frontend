"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ordinal } from "@/lib/function";
import ActionCell from "@/components/ActionCell";
import ReceiptCard from "../cards/ReceiptCard";
import { deleteData } from "@/api/branch";
import { Appointment } from "@/lib/types/appointment-types";

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
      const {
        appointment_id,
        // aesthetician_name_snapshot,
        // service_name_snapshot,
        // to_pay,
        // branch_name_snapshot,
        // final_payment_method,
        // voucher_code_snapshot,
      } = row.original;
      return (
        <ActionCell
          deleteFn={(id: string) => deleteData({ id: id, url: "appointment" })}
          deleteMessage="Appointment has been deleted."
          queryKey="appointment"
          id={appointment_id}
          editAppointmentStatus
          infoDialog={<ReceiptCard appointment={row.original} />}
          // editDialog={
          //   <AppointmentForm
          //     method="patch"
          //     renderDialog={false}
          //     formTitle="Edit Appointment"
          //     formDescription="Update the appointment by changing in the details below."
          //     buttonLabel="Update Appointment"
          //     appointmentId={appointment_id}
          //     firstName={first_name}
          //     lastName={last_name}
          //     middleInitial={middle_initial}
          //     branchId={branch.branch_id}
          //     serviceId={service.service_id}
          //     aestheticianId={aesthetician.aesthetician_id}
          //     finalPaymentMethod={final_payment_method || ""}
          //     phoneNumber={phone_number}
          //     toPay={to_pay}
          //     sex={sex}
          //     voucherCode={voucher_code || ""}
          //   />
          // }
        />
      );
    },
  },
];
