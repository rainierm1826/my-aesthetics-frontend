"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Aesthetician } from "../../lib/types/aesthetician-types";
import { Badge } from "@/components/ui/badge";
import { RatingStar } from "@/components/RatingStar";
import ActionCell from "@/components/ActionCell";
import AestheticianCard from "@/components/cards/AestheticianCard";
import AestheticianForm from "@/components/forms/AestheticianForm";
import { deleteData } from "@/lib/function";

export const aestheticianColumn: ColumnDef<Aesthetician>[] = [
  {
    id: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const { first_name, last_name, middle_initial } = row.original;
      return `${first_name} ${middle_initial}. ${last_name}`;
    },
  },
  { accessorKey: "branch.branch_name", id: "branch_name", header: "Works At" },
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
            e == "Pro"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {e == "Pro" ? "Professional" : "Regular"}
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
              : a == "Break"
              ? "bg-orange-100 text-orange-500"
              : ""
          }`}
        >
          {a == "Break" ? "On-break" : a}
        </Badge>
      );
    },
  },

  {
    accessorKey: "avarage_rate",
    header: "Avarage Rate",
    cell: ({ row }) => {
      return <RatingStar rating={row.original.average_rate} />;
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
    accessorKey: "phone_number",
    header: "Phone Number",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {
        aesthetician_id,
        availability,
        branch,
        experience,
        first_name,
        image,
        last_name,
        middle_initial,
        phone_number,
        sex,
        average_rate,
      } = row.original;
      const { branch_id } = branch;

      return (
        <ActionCell
          deleteFn={(id: string) => deleteData({ id: id, url:"aesthetician" })}
          deleteMessage="Aesthetician has been deleted."
          queryKey="aesthetician"
          id={aesthetician_id}
          editDialog={
            <AestheticianForm
              method="patch"
              renderDialog={false}
              formTitle="Edit Aesthetician"
              formDescription="Fill in the aesthetician’s name, contact number, experience, gender, and branch. Add a profile photo to complete their profile."
              buttonLabel="Update Aesthetician"
              aestheticianId={aesthetician_id}
              firstName={first_name}
              lastName={last_name}
              middleInitial={middle_initial}
              phoneNumber={phone_number}
              experience={experience}
              sex={sex}
              branchId={branch_id}
              image={image}
              availability={availability}
            />
          }
          previewDialog={
            <AestheticianCard
              aesthetician_id={aesthetician_id}
              firstName={first_name}
              lastName={last_name}
              middleInitial={middle_initial}
              image={image}
              availability={availability}
              experience={experience}
              rating={average_rate}
              action={false}
            />
          }
        />
      );
    },
  },
];
