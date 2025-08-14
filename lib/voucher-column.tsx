"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Voucher } from "./types";
import ActionCell from "@/components/ActionCell";
import VoucherForm from "@/components/VoucherForm";

export const voucherColumn: ColumnDef<Voucher>[] = [
  {
    accessorKey: "voucherCode",
    header: "Voucher Code",
  },
  {
    accessorKey: "discountAmount",
    header: "Discounted Amount",
    cell: ({ row }) => {
      return `₱${row.original.discountAmount}`;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ActionCell
          data={row.original}
          getId={(u) => u.voucherCode}
          onEdit={(u) => console.log("Edit user", u)}
          onDelete={(u) => console.log("Delete user", u.voucherCode)}
          editDialog={
            <VoucherForm
              renderDialog={false}
              buttonLabel="Update Voucher"
              formDescription="Update a existing voucher by filling in the details below."
              formTitle="Update Voucher"
              discountAmount={row.original.discountAmount.toString()}
              quantity={row.original.quantity.toString()}
              minimumSpend={"1500"}
              discountType="percentage"
              validFrom="2025-08-14"
              validUntil="2025-12-31"
            />
          }
        />
      );
    },
  },
];
