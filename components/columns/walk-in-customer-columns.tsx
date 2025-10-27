"use client";

import { ColumnDef } from "@tanstack/react-table";
import ActionCell from "@/components/ActionCell";
import { deleteWalkInCustomer } from "@/api/walk-in-customer";

export interface WalkInCustomerRow {
  id: string;
  walk_in_id: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  phone_number: string;
  created_at: string;
}

export const getWalkInCustomerColumns = (
  token: string
): ColumnDef<WalkInCustomerRow>[] => [
  {
    id: "full_name",
    header: "Full Name",
    cell: ({ row }) => {
      const { first_name, middle_initial, last_name } = row.original;

      // Validate and handle null/empty names
      const firstName = first_name?.trim() || "";
      const lastName = last_name?.trim() || "";
      const middleInitial = middle_initial?.trim()
        ? ` ${middle_initial.trim()}.`
        : "";

      // If no name is set, display "No Name"
      if (!firstName && !lastName) {
        return <span className="text-gray-400 italic">No Name</span>;
      }

      return `${firstName}${middleInitial} ${lastName}`.trim();
    },
  },

  {
    accessorKey: "phone_number",
    header: "Phone Number",
    cell: ({ row }) => {
      const phone = row.original.phone_number?.trim();
      return phone ? (
        phone
      ) : (
        <span className="text-gray-400 italic">No Phone</span>
      );
    },
  },

  {
    accessorKey: "created_at",
    header: "Visit Date",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <ActionCell
          queryKey="all-customers"
          id={customer.walk_in_id}
          previewDialog={null}
          deleteFn={(id: string) =>
            deleteWalkInCustomer({
              walk_in_id: id,
              token: token,
            })
          }
          deleteMessage="Walk-in customer has been deleted."
        />
      );
    },
  },
];
