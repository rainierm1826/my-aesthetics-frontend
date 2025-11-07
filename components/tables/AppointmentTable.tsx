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
import { AppointmentsAnalyticsResponse } from "@/lib/types/analytics-type";
import SkeletonScoreBoard from "../skeletons/SkeletonScoreBoard";
import { useAppointmentAnalytics } from "@/hooks/useAppointmentAnalytics";
import { useAppointmentWebSocket } from "@/hooks/useAppointmentWebSocket";

export default function AppointmentTable() {
  const { auth, isAuthLoading, access_token } = useAuthStore();
  const { user } = useUserStore();
  
  // Enable real-time appointment updates via WebSocket
  useAppointmentWebSocket();
  
  const { data, isFetching, isError } = useAppointments({
    branchId: user?.branch?.branch_id,
    token: access_token || "",
  });
  const appointments: Appointment[] = data?.appointment ?? [];

  const { data: appointmentSummary, isFetching: isFetchingSummaryData } =
    useAppointmentAnalytics(access_token || "");
  const summary: AppointmentsAnalyticsResponse = appointmentSummary || {
    average_service_rating: [],
  };

  if (isAuthLoading) {
    return <SkeletonTable />;
  }

  return (
    <>
      {auth?.role === "owner" ? (
        isFetchingSummaryData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonScoreBoard key={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 mb-5">
            {summary.average_service_rating.map((value, index) => (
              <DashboardCard
                key={index}
                title={value.branch}
                content={value.daily_average}
                info={`Average daily appointments in ${value.branch}`}
              />
            ))}
          </div>
        )
      ) : null}

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
