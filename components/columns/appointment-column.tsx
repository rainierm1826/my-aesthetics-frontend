"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@/lib/types/appointment-types";
import { ordinal } from "@/lib/function";
import ActionCell from "@/components/ActionCell";
import AppointmentForm from "../forms/AppointmentForm";
import ReceiptCard from "../cards/ReceiptCard";
import { deleteData } from "@/api/branch";

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
  {
    id: "actions",
    cell: ({ row }) => {
      const {
        appointment_id,
        user,
        walk_in,
        aesthetician,
        service,
        to_pay,
        branch,
        final_payment_method,
        voucher_code,
      } = row.original;
      const first_name = walk_in?.first_name || user?.first_name;
      const last_name = walk_in?.last_name || user?.last_name;
      const middle_initial = walk_in?.middle_initial || user?.middle_initial;
      const phone_number = walk_in?.phone_number || user?.phone_number;
      const sex = walk_in?.sex || user?.sex;

      return (
        <ActionCell
          deleteFn={(id: string) => deleteData({ id: id, url: "appointment" })}
          deleteMessage="Appointment has been deleted."
          queryKey="appointment"
          id={appointment_id}
          editAppointmentStatus
          infoDialog={<ReceiptCard appointment={row.original} />}
          editDialog={
            <AppointmentForm
              method="patch"
              renderDialog={false}
              formTitle="Edit Appointment"
              formDescription="Update the appointment by changing in the details below."
              buttonLabel="Update Appointment"
              appointmentId={appointment_id}
              firstName={first_name}
              lastName={last_name}
              middleInitial={middle_initial}
              branchId={branch.branch_id}
              serviceId={service.service_id}
              aestheticianId={aesthetician.aesthetician_id}
              finalPaymentMethod={final_payment_method || ""}
              phoneNumber={phone_number}
              toPay={to_pay}
              sex={sex}
              voucherCode={voucher_code || ""}
            />
          }
        />
      );
    },
  },
];
