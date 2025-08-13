"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Aesthetician } from "./types";
import { Badge } from "@/components/ui/badge";
import { RatingStar } from "@/components/RatingStar";
import ActionCell from "@/components/ActionCell";
import AestheticianCard from "@/components/AestheticianCard";

export const aestheticianColumn: ColumnDef<Aesthetician>[] = [
  {
    id: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const { firstName, lastName, middleInitial } = row.original;
      return `${firstName} ${middleInitial}. ${lastName}`;
    },
  },
  {
    accessorKey: "branchName",
    header: "Works At",
  },
  {
    accessorKey: "experience",
    header: "Experience",

    // pro = green
    // regular = grey

    cell: ({ row }) => {
      const { experience } = row.original;
      const e = experience.charAt(0).toUpperCase() + experience.slice(1);
      return (
        <Badge
          className={`text-white rounded-full ${
            e == "Professional"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {e}
        </Badge>
      );
    },
  },
  {
    accessorKey: "availability",
    header: "Availability",
    cell: ({ row }) => {
      const { availability } = row.original;
      const a = availability.charAt(0).toUpperCase() + availability.slice(1);

      //   available = green
      //   working = yellow
      //   OffDuty = RED
      //   Break = orange

      return (
        <Badge
          className={`text-white rounded-full ${
            a == "Available"
              ? "bg-green-100 text-green-700"
              : a == "Working"
              ? "bg-yellow-100 text-yellow-500"
              : a == "Off-duty"
              ? "bg-red-100 text-red-700"
              : a == "On-break"
              ? "bg-orange-100 text-orange-500"
              : ""
          }`}
        >
          {a}
        </Badge>
      );
    },
  },

  {
    accessorKey: "avarageRate",
    header: "Avarage Rate",
    cell: ({ row }) => {
      return <RatingStar rating={row.original.averageRate} />;
    },
  },
  {
    accessorKey: "sex",
    header: "Sex",
    cell: ({ row }) => {
      const { sex } = row.original;
      return sex.charAt(0).toUpperCase() + sex.slice(1);
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ActionCell
          data={row.original}
          getId={(u) => u.firstName}
          onEdit={(u) => console.log("Edit user", u)}
          onDelete={(u) => console.log("Delete user", u.firstName)}
          onPreview={(a) => console.log("More info", a)}
          previewDialog={<AestheticianCard/>}
        />
      );
    },
  },
];
