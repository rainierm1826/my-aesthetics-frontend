"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Service } from "./types";
import { RatingStar } from "@/components/RatingStar";
import { Badge } from "@/components/ui/badge";
import ActionCell from "@/components/ActionCell";
import ServicesCard from "@/components/ServicesCard";
import ServiceForm from "@/components/ServiceForm";

export const serviceColumn: ColumnDef<Service>[] = [
  {
    accessorKey: "serviceName",
    header: "Service Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "avarageRate",
    header: "Avarage Rate",
    cell: ({ row }) => {
      return <RatingStar rating={row.original.averageRate} />;
    },
  },
  {
    accessorKey: "isSale",
    header: "Sale",
    cell: ({ row }) => {
      const { isSale } = row.original;
      return (
        <Badge
          className={`rounded-full ${
            isSale ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {isSale ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount",
    cell: ({ row }) => {
      return `${row.original.discountPercentage}%`;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const { originalPrice, isSale, finalPrice } = row.original;
      return (
        <p>
          {isSale && (
            <span className="line-through decoration- text-[#7C7C7C]">
              ₱{originalPrice}
            </span>
          )}{" "}
          ₱{finalPrice}
        </p>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ActionCell
          data={row.original}
          getId={(u) => u.serviceName}
          onEdit={(u) => console.log("Edit user", u)}
          onDelete={(u) => console.log("Delete user", u.serviceName)}
          onPreview={(a) => console.log("More info", a)}
          previewDialog={<ServicesCard />}
          editDialog={
            <ServiceForm
              renderDialog={false}
              formTitle="Edit Branch"
              formDescription="Update a existing service by filling in the details below."
              buttonLabel="Update"
              dialogButtonLabel=""
              category={row.original.category}
              serviceName={row.original.serviceName}
              price={row.original.finalPrice.toString()}
              isOnSale={row.original.isSale}
              discount={row.original.discountPercentage.toString()}
            />
          }
        />
      );
    },
  },
];
