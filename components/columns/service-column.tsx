"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Service } from "../../lib/types/service-types";
import { RatingStar } from "@/components/RatingStar";
import { Badge } from "@/components/ui/badge";
import ActionCell from "@/components/ActionCell";
import ServicesCard from "@/components/cards/ServicesCard";
import ServiceForm from "@/components/forms/ServiceForm";
import { deleteData } from "@/lib/function";

export const serviceColumn: ColumnDef<Service>[] = [
  {
    accessorKey: "service_name",
    header: "Service Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "average_rate",
    header: "Avarage Rate",
    cell: ({ row }) => {
      return <RatingStar rating={row.original.avarage_rate} />;
    },
  },
  {
    accessorKey: "is_sale",
    header: "Sale",
    cell: ({ row }) => {
      const { is_sale } = row.original;
      return (
        <Badge
          className={`rounded-full ${
            is_sale
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {is_sale ? "Yes" : "No"}
        </Badge>
      );
    },
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
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => {
      return row.original.discount_type === "percentage"
        ? `${row.original.discount}%`
        : `₱${row.original.discount}`;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const { price, is_sale, discounted_price } = row.original;
      return (
        <p>
          {is_sale && (
            <span className="line-through decoration- text-[#7C7C7C]">
              ₱{price.toFixed(2)}
            </span>
          )}{" "}
          ₱{discounted_price.toFixed(2)}
        </p>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const {
        service_id,
        service_name,
        branch_id,
        category,
        is_sale,
        description,
        price,
        discount,
        image,
        discount_type,
        discounted_price,
        avarage_rate,
        duration,
      } = row.original;

      return (
        <ActionCell
          id={service_id}
          deleteFn={(id: string) => deleteData({ id: id, url: "service" })}
          previewDialog={
            <ServicesCard
              duration={duration}
              service_id={service_id}
              category={category}
              isSale={is_sale}
              serviceName={service_name}
              price={price}
              discount={discount}
              discountType={discount_type}
              discountedPrice={discounted_price}
              image={image}
              rating={avarage_rate}
            />
          }
          deleteMessage="Service has been deleted."
          queryKey="service"
          editDialog={
            <ServiceForm
              serviceId={service_id}
              method="patch"
              description={description}
              image={image}
              renderDialog={false}
              formTitle="Edit Branch"
              formDescription="Update a existing service by filling in the details below."
              buttonLabel="Update"
              dialogButtonLabel=""
              category={category}
              serviceName={service_name}
              price={price}
              isOnSale={is_sale}
              discount={discount}
              branchId={branch_id}
              discountType={discount_type}
              priceDiscounted={discounted_price}
            />
          }
        />
      );
    },
  },
];
