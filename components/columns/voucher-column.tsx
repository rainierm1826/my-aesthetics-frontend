"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Voucher } from "../../lib/types/voucher-type";
import ActionCell from "@/components/ActionCell";
import VoucherForm from "@/components/forms/VoucherForm";
import { deleteData, toLongDate } from "../../lib/function";

export const voucherColumn: ColumnDef<Voucher>[] = [
  {
    accessorKey: "voucher_code",
    header: "Voucher Code",
  },
  {
    accessorKey: "discount_type",
    header: "Discount Type",
    cell: ({ row }) => {
      return `${
        row.original.discount_type.charAt(0).toUpperCase() +
        row.original.discount_type.slice(1)
      }`;
    },
  },
  {
    accessorKey: "discount_amount",
    header: "Discount",
    cell: ({ row }) => {
      const { discount_amount, discount_type } = row.original;
      return `${
        discount_type === "percentage"
          ? `${discount_amount}%`
          : `₱${discount_amount}`
      }`;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },

  {
    accessorKey: "valid_from",
    header: "Valid From",
    cell: ({ row }) => {
      return toLongDate(row.original.valid_from);
    },
  },
  {
    accessorKey: "valid_until",
    header: "Valid Until",
    cell: ({ row }) => {
      return toLongDate(row.original.valid_until);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {
        discount_amount,
        discount_type,
        minimum_spend,
        quantity,
        valid_from,
        valid_until,
        voucher_code,
      } = row.original;

      return (
        <ActionCell
          queryKey="voucher"
          deleteMessage="Voucher has been deleted."
          id={voucher_code}
          deleteFn={(voucher_code: string) =>
            deleteData({ id: voucher_code, url:"voucher" })
          }
          editDialog={
            <VoucherForm
              renderDialog={false}
              buttonLabel="Update Voucher"
              formDescription="Update a existing voucher by filling in the details below."
              voucherCode={voucher_code}
              formTitle="Update Voucher"
              discountAmount={discount_amount}
              quantity={quantity}
              minimumSpend={minimum_spend}
              discountType={discount_type}
              validFrom={valid_from}
              validUntil={valid_until}
              method="patch"
            />
          }
        />
      );
    },
  },
];
