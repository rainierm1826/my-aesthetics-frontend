"use client";

import { DataTable } from "@/components/DataTable";
import SearchInput from "@/components/SearchInput";
import BranchForm from "../forms/BranchForm";
import SkeletonTable from "../skeletons/SkeletonTable";
import { toast } from "sonner";
import { useAppointments } from "@/hooks/useAppointments";
import { appointmentColumn } from "../columns/appointment-column";
import { Appointment } from "@/lib/types/appointment-types";
import DatePagination from "../paginations/DatePagination";
import DropDownBranch from "../selects/DropDownBranch";
import DropDownAppointmentStatus from "../selects/DropDownAppointmentStatus";
import { Button } from "../ui/button";

export default function AppointmentTable() {
  const { data, isFetching, isError } = useAppointments();

  const appointments: Appointment[] = data?.appointment ?? [];

  return (
    <>
      <div className="mb-5 flex">
        <DatePagination />
      </div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-3 w-full">
          <SearchInput placeholder="Search by appointment id..." size="w-1/3" />
          <DropDownBranch />
          <DropDownAppointmentStatus />
        </div>
        <Button className="rounded-sm">Add Appointment</Button>
      </div>

      {isFetching ? (
        <SkeletonTable />
      ) : isError ? (
        toast("Internal Error")
      ) : (
        <DataTable
          columns={appointmentColumn}
          data={appointments}
          pageCount={data?.pages}
          windowsSize={5}
        />
      )}
    </>
  );
}
