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
import DashboardCard from "../cards/DashboardCard";
import { useAppointmentSummary } from "@/hooks/useAppointmentSummary";
import {
  AppointmentAnalyticsResponse,
  AppointmentSummaryResponse,
} from "@/lib/types/analytics-type";
import { useAnalyticsAppointment } from "@/hooks/useAnalyticsAppointment";
import SkeletonScoreBoard from "../skeletons/SkeletonScoreBoard";

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
  } = useAppointmentSummary({});
  const summary = (summaryData as AppointmentSummaryResponse) || {};

  const appointments: Appointment[] = data?.appointment ?? [];
  const { data: appointmentData, isFetching: isFetchingAppointmentData } =
    useAnalyticsAppointment({});
  const appointment = (appointmentData as AppointmentAnalyticsResponse) || {};

  if (isAuthLoading) {
    return <SkeletonTable />;
  }

  return (
    <>
      {isFetchingSummaryData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonScoreBoard key={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 mb-5">
          <DashboardCard
            title="Total Appointments"
            content={summary.total_appointments.toLocaleString()}
            info="All scheduled bookings in the period"
          />
          <DashboardCard
            title="Total Appointments"
            content={summary.total_appointments.toLocaleString()}
            info="All scheduled bookings in the period"
          />
          <DashboardCard
            title="Total Appointments"
            content={summary.total_appointments.toLocaleString()}
            info="All scheduled bookings in the period"
          />
          <DashboardCard
            title="Total Appointments"
            content={summary.total_appointments.toLocaleString()}
            info="All scheduled bookings in the period"
          />
        </div>
      )}
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
