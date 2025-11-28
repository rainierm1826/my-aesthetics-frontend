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

  // Sort by earliest service time, then by status priority
  const statusPriority: Record<string, number> = {
    pending: 1,
    waiting: 2, // shown as "Confirmed" in UI
    "on-process": 3,
    completed: 4,
    cancelled: 5,
  };

  const toTimestamp = (value: unknown): number => {
    if (!value) return Number.MAX_SAFE_INTEGER;
    const s = String(value);
    let d = new Date(s);
    if (!isNaN(d.getTime())) return d.getTime();
    d = new Date(s.replace(" ", "T"));
    if (!isNaN(d.getTime())) return d.getTime();
    const m = s.match(/^([0-2]\d):([0-5]\d)(?::([0-5]\d))?$/);
    if (m) {
      const now = new Date();
      now.setHours(parseInt(m[1], 10), parseInt(m[2], 10), m[3] ? parseInt(m[3], 10) : 0, 0);
      return now.getTime();
    }
    return Number.MAX_SAFE_INTEGER;
  };

  type AptServiceLite = { start_time?: string };
  type AptWithServices = Appointment & { services?: AptServiceLite[]; start_time?: string };

  const getEarliestServiceTime = (apt: Appointment): number => {
    const aptWithServices = apt as AptWithServices;
    const times = (aptWithServices.services ?? []).map((s) => toTimestamp(s.start_time));
    if (times.length === 0) return toTimestamp(aptWithServices.start_time);
    return Math.min(...times);
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const ta = getEarliestServiceTime(a);
    const tb = getEarliestServiceTime(b);
    if (ta !== tb) return ta - tb;
    const sa = statusPriority[a.status as keyof typeof statusPriority] ?? 99;
    const sb = statusPriority[b.status as keyof typeof statusPriority] ?? 99;
    return sa - sb;
  });

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonScoreBoard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
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

      <div className="mb-5">
        <DatePagination />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full sm:w-1/3">
            <SearchInput placeholder="Search by appointment id..." size="w-full" />
          </div>
          {auth?.role == "owner" && (
            <div className="w-full sm:w-auto">
              <DropDownBranch useUrlParams={true} includeAllOption={true} />
            </div>
          )}
          <div className="w-full sm:w-auto">
            <DropDownAppointmentStatus useUrlParams={true} includeAllOption />
          </div>
        </div>
        <div className="w-full sm:w-auto flex-shrink-0">
          <AppointmentForm
            method="post"
            dialogButtonLabel="New Appointment"
            buttonLabel="Add Appointment"
            formDescription="Create a new appointment by filling in the details below."
            formTitle="Add New Appointment"
          />
        </div>
      </div>

      {isFetching ? (
        <SkeletonTable />
      ) : isError ? (
        toast("Internal Error")
      ) : (
        <DataTable
          columns={appointmentColumn}
          data={sortedAppointments}
          pageCount={data?.pages}
          windowsSize={5}
        />
      )}
    </>
  );
}
