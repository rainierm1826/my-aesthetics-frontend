"use client";

import { DataTable } from "@/components/DataTable";
import SearchInput from "@/components/SearchInput";
import SkeletonTable from "../skeletons/SkeletonTable";
import { toast } from "sonner";
import { useAppointments } from "@/hooks/useAppointments";
import { appointmentColumn } from "../columns/appointment-column";
import { Appointment } from "@/lib/types/appointment-types";
import DatePagination from "../paginations/DatePagination";
import DropDownBranch from "../selects/DropDownBranch";
import DropDownAppointmentStatus from "../selects/DropDownAppointmentStatus";
import AppointmentForm from "../forms/AppointmentForm";
import { useAuthStore } from "@/provider/store/authStore";
import { useUserStore } from "@/provider/store/userStore";
import { useAnalyticsSummary } from "@/hooks/useAnalyticsSummary";
import { AnalyticsSummaryResponse } from "@/lib/types/analytics-type";
import DashboardCard from "../cards/DashboardCard";

export default function AppointmentTable() {
  const { auth, isAuthLoading } = useAuthStore();
  const { user } = useUserStore();
  const { data, isFetching, isError } = useAppointments(
    user?.branch?.branch_id
  );
  const {
    data: summaryData,
    isFetching: isFetchingSummaryData,
    isError: isErrorSummaryData,
  } = useAnalyticsSummary({});

  const appointments: Appointment[] = data?.appointment ?? [];
  const summary = (summaryData as AnalyticsSummaryResponse) || {};

  if (isAuthLoading) {
    return <SkeletonTable />;
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-5">
        <DashboardCard
          title="Total Appointments"
          content={summary.total_appointments ?? 0}
        />
        <DashboardCard
          title="Total Appointments"
          content={summary.total_appointments ?? 0}
        />
        <DashboardCard
          title="Total Appointments"
          content={summary.total_appointments ?? 0}
        />
        <DashboardCard
          title="Total Appointments"
          content={summary.total_appointments ?? 0}
        />
      </div>
      <div className="mb-5 flex">
        <DatePagination />
      </div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-3 w-full">
          <SearchInput placeholder="Search by appointment id..." size="w-1/3" />
          {auth?.role == "owner" && (
            <DropDownBranch useUrlParams={true} includeAllOption={true} />
          )}
          <DropDownAppointmentStatus useUrlParams={true} includeAllOption />
        </div>
        <AppointmentForm
          method="post"
          dialogButtonLabel="New Appointment"
          buttonLabel="Add Appointment"
          formDescription="Create a new appointment by filling in the details below."
          formTitle="Add New Appointment"
        />
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
