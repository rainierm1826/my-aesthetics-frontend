"use client";

import React from "react";
import PieChartComponent from "@/components/charts/PieChartComponent";
import ToggleDates from "@/components/ToggleDates";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import DashboardCard from "@/components/cards/DashboardCard";
import DropDownBranch from "@/components/selects/DropDownBranch";
import LineChartComponent from "@/components/charts/LineChartComponent";
import {
  AppointmentAnalyticsResponse,
  AppointmentsOvertimeResponse,
  AppointmentSummaryResponse,
} from "@/lib/types/analytics-type";
import SkeletonScoreBoard from "../skeletons/SkeletonScoreBoard";
import { useAnalyticsAppointment } from "@/hooks/useAnalyticsAppointment";
import { statusChartConfig } from "@/config/appointmentConfig";
import {
  aestheticianRevenueChartConfig,
  serviceCategoryChartConfig,
} from "@/config/salesConfig";
import { useAppointmentSummary } from "@/hooks/useAppointmentSummary";
import SkeletonLineChart from "../skeletons/SkeletonLineChart";
import { SkeletonBarChart } from "../skeletons/SkeletonBarChart";
import { SkeletonPieChart } from "../skeletons/SkeletonPieChart";
import { useAuthStore } from "@/provider/store/authStore";
import { useAppointmentsOvertime } from "@/hooks/useAppointmentsOvertime";
import DropDownYear from "../selects/DropDownYear";
import DropDownMonth from "../selects/DropDownMonth";
import { useSearchParams } from "next/navigation";

const AppointmentDashboard = () => {
  const searchParams = useSearchParams();
  const groupBy = searchParams.get("group-by") || "year";

  const getNameKey = (groupBy: string) => {
    switch (groupBy) {
      case "weekday":
        return "weekday";
      case "month":
        return "month";
      case "year":
        return "year";
      default:
        return "year";
    }
  };

  const { access_token, isAuthLoading } = useAuthStore();

  const { data: summaryData, isFetching: isFetchingSummaryData } =
    useAppointmentSummary({ token: access_token || "" });
  const summary = (summaryData as AppointmentSummaryResponse) || {};

  const { data: appointmentData, isFetching: isFetchingAppointmentData } =
    useAnalyticsAppointment({ token: access_token || "" });
  const appointment = (appointmentData as AppointmentAnalyticsResponse) || {};

  const {
    data: appointmentsOvertime,
    isFetching: isFetchingAppointmentsOvertime,
  } = useAppointmentsOvertime({ token: access_token || "" });
  const appointments =
    (appointmentsOvertime as AppointmentsOvertimeResponse) || {};

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-3">
          <ToggleDates />
          <DropDownYear />
          <DropDownMonth />
        </div>

        <DropDownBranch useUrlParams={true} includeAllOption={true} />
      </div>

      {/* Summary Cards */}
      {isFetchingSummaryData || isAuthLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonScoreBoard key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Appointments"
            content={summary?.total_appointments?.toLocaleString() ?? "0"}
            info="All scheduled bookings in the period"
          />
          <DashboardCard
            title="Completion Rate"
            content={`${summary.completion_rate ?? 0}%`}
            info="Percentage of finished appointments"
          />
          <DashboardCard
            title="Cancellation Rate"
            content={`${summary.cancellation_rate ?? 0}%`}
            info="Share of canceled bookings"
          />
          <DashboardCard
            title="Overall Rating"
            content={summary.avarage_overall_rating ?? 0}
            info="Combined average of aestheticians, branches, and services"
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Overview Charts */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>

          {/* Pie Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isFetchingAppointmentData || isAuthLoading ? (
              <SkeletonPieChart />
            ) : (
              <PieChartComponent
                title="Appointment Status"
                dataKey="count"
                nameKey="status"
                chartConfig={statusChartConfig}
                chartData={appointment.appointments_status}
              />
            )}
            {isFetchingAppointmentData || isAuthLoading ? (
              <SkeletonPieChart />
            ) : (
              <PieChartComponent
                title="Appointments By Category"
                dataKey="count"
                nameKey="category"
                chartConfig={serviceCategoryChartConfig}
                chartData={appointment.appointments_by_service_category}
              />
            )}
          </div>

          {/* Time Series Chart */}
          <div className="w-full">
            {isFetchingAppointmentsOvertime || isAuthLoading ? (
              <SkeletonLineChart />
            ) : (
              <LineChartComponent
                value="Number of Appointments"
                title="Appointments Overtime"
                dataKey="count"
                nameKey={getNameKey(groupBy)}
                chartConfig={aestheticianRevenueChartConfig}
                chartData={appointments.appointments_overtime}
              />
            )}
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Distribution</h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {isFetchingAppointmentData || isAuthLoading ? (
              <SkeletonBarChart />
            ) : (
              <BarChartComponent
                value="Number of Appointments"
                title="Appointments By Aesthetician"
                dataKey="count"
                nameKey="aesthetician"
                chartConfig={aestheticianRevenueChartConfig}
                chartData={appointment.appointments_by_aesthetician}
              />
            )}

            {isFetchingAppointmentData || isAuthLoading ? (
              <SkeletonBarChart />
            ) : (
              <BarChartComponent
                value="Number of Appointments"
                title="Appointments By Branch"
                dataKey="count"
                nameKey="branch"
                chartConfig={aestheticianRevenueChartConfig}
                chartData={appointment.appointments_by_branch}
              />
            )}
          </div>

          <div className="w-full">
            {isFetchingAppointmentData || isAuthLoading ? (
              <SkeletonBarChart />
            ) : (
              <BarChartComponent
                value="Number of Appointments"
                title="Appointments By Service"
                dataKey="count"
                nameKey="service"
                chartConfig={aestheticianRevenueChartConfig}
                chartData={appointment.appointments_by_service}
              />
            )}
          </div>
        </div>

        {/* Performance & Ratings */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Performance & Ratings
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {isFetchingAppointmentData || isAuthLoading ? (
              <SkeletonBarChart />
            ) : (
              <BarChartComponent
                value="Avarage Ratings"
                title="Top Rated Aesthetician"
                dataKey="average_rate"
                nameKey="aesthetician"
                chartConfig={aestheticianRevenueChartConfig}
                chartData={appointment.top_rated_aesthetician}
              />
            )}

            {isFetchingAppointmentData || isAuthLoading ? (
              <SkeletonBarChart />
            ) : (
              <BarChartComponent
                value="Avarage Ratings"
                title="Top Rated Branch"
                dataKey="average_rate"
                nameKey="branch_name"
                chartConfig={aestheticianRevenueChartConfig}
                chartData={appointment.top_rated_branch}
              />
            )}
          </div>

          <div className="w-full">
            {isFetchingAppointmentData || isAuthLoading ? (
              <SkeletonBarChart />
            ) : (
              <BarChartComponent
                value="Avarage Ratings"
                title="Top Rated Service"
                dataKey="average_rate"
                nameKey="service_name"
                chartConfig={aestheticianRevenueChartConfig}
                chartData={appointment.top_rated_service}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDashboard;
