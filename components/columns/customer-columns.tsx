"use client";

import { ColumnDef } from "@tanstack/react-table";
import ActionCell from "@/components/ActionCell";
import WalkInCustomerForm from "../forms/WalkInCustomerForm";
import CustomerAnalyticsModal from "@/components/modals/CustomerAnalyticsModal";
import { Badge } from "../ui/badge";
import { deleteWalkInCustomer } from "@/api/walk-in-customer";

export interface CustomerRow {
  id: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  phone_number: string;
  type: "online" | "walkin";
  created_at: string;
  image: string | null;
}

export const customerColumns: ColumnDef<CustomerRow>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {id}
        </span>
      );
    },
  },

  {
    id: "full_name",
    header: "Full Name",
    cell: ({ row }) => {
      const { first_name, middle_initial, last_name } = row.original;
      
      // Validate and handle null/empty names
      const firstName = first_name?.trim() || "";
      const lastName = last_name?.trim() || "";
      const middleInitial = middle_initial?.trim() ? ` ${middle_initial.trim()}.` : "";
      
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
      return phone ? phone : <span className="text-gray-400 italic">No Phone</span>;
    },
  },

  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <Badge
          className={`rounded-full ${
            type === "online"
              ? "bg-blue-100 text-blue-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {type === "online" ? "Online" : "Walk-in"}
        </Badge>
      );
    },
  },

  {
    accessorKey: "created_at",
    header: "Joined Date",
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

      // Walk-in customers have edit, delete, and more info actions
      if (customer.type === "walkin") {
        return (
          <ActionCell
            queryKey="all-customers"
            id={customer.id}
            deleteFn={async (id: string) => {
              const token = localStorage.getItem("token");
              return deleteWalkInCustomer({
                walk_in_id: id,
                token: token || "",
              });
            }}
            deleteMessage="Walk-in customer deleted successfully"
            previewDialog={null}
            infoDialog={
              <CustomerAnalyticsModal
                customerId={customer.id}
                customerType="walkin"
                customerName={`${customer.first_name} ${customer.last_name}`}
              />
            }
            editDialog={
              <WalkInCustomerForm
                method="patch"
                formTitle="Edit Walk-in Customer"
                formDescription="Update the customer's information."
                buttonLabel="Update Customer"
                walkInId={customer.id}
                firstName={customer.first_name}
                lastName={customer.last_name}
                middleInitial={customer.middle_initial}
                phoneNumber={customer.phone_number}
                renderDialog={false}
              />
            }
          />
        );
      }

      // Online customers only have more info action
      return (
        <ActionCell
          queryKey="all-customers"
          id={customer.id}
          infoDialog={
            <CustomerAnalyticsModal
              customerId={customer.id}
              customerType="online"
              customerName={`${customer.first_name} ${customer.last_name}`}
            />
          }
        />
      );
    },
  },
];
