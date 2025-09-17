"use client";

import React from "react";
import PieChartComponent from "@/components/charts/PieChartComponent";
import ToggleDates from "@/components/ToggleDates";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import DashboardCard from "@/components/cards/DashboardCard";
import DropDownBranch from "@/components/selects/DropDownBranch";
import LineChartComponent from "@/components/charts/LineChartComponent";
import { useAnalyticsSummary } from "@/hooks/useAnalyticsSummary";
import {
  AnalyticsSummaryResponse,
  AppointmentAnalyticsResponse,
} from "@/lib/types/analytics-type";
import SkeletonScoreBoard from "../skeletons/SkeletonScoreBoard";
import { useAnalyticsAppointment } from "@/hooks/useAnalyticsAppointment";
import { statusChartConfig } from "@/config/appointmentConfig";
import {
  aestheticianRevenueChartConfig,
  serviceCategoryChartConfig,
} from "@/config/salesConfig";

const AppointmentDashboard = () => {
  const { data: summaryData, isFetching: isFetchingSummaryData } =
    useAnalyticsSummary({});
  const summary = (summaryData as AnalyticsSummaryResponse) || {};

  const { data: appointmentData, isFetching: isFetchingAppointmentData } =
    useAnalyticsAppointment({});
  const appointment = (appointmentData as AppointmentAnalyticsResponse) || {};

  return (
    <>
      {isFetchingSummaryData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonScoreBoard key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-5 flex justify-between items-center">
            <ToggleDates />
            <DropDownBranch useUrlParams={true} includeAllOption={true} />
          </div>
          <div className="flex flex-wrap gap-3 mb-5">
            <DashboardCard
              title="Total Appointments"
              content={summary.total_appointments}
            />
            <DashboardCard
              title="Completion Rate"
              content={`${summary.completion_rate}%`}
            />
            <DashboardCard
              title="Cancellation Rate"
              content={`${summary.cancellation_rate}%`}
            />
            <DashboardCard
              title="Overall Rating"
              content={summary.avarage_overall_rating}
            />
          </div>
        </>
      )}
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-3">
          {isFetchingAppointmentData ? (
            <SkeletonScoreBoard />
          ) : (
            <PieChartComponent
              title="Appointment Status"
              dataKey="count"
              nameKey="status"
              chartConfig={statusChartConfig}
              chartData={appointment.appointments_status}
            />
          )}
          {isFetchingAppointmentData ? (
            <SkeletonScoreBoard />
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

        {isFetchingAppointmentData ? (
          <p>Loading...</p>
        ) : (
          <LineChartComponent
            value="Number of Appointments"
            title="Appointments Overtime"
            dataKey="count"
            nameKey="weekday"
            chartConfig={aestheticianRevenueChartConfig}
            chartData={appointment.appointments_overtime}
          />
        )}

        {/* <BarChartComponent /> */}
        {isFetchingAppointmentData ? (
          <>Loading...</>
        ) : (
          <BarChartComponent
            value="Number of Appointments"
            title="Appointments By Branch"
            dataKey="count"
            nameKey="aesthetician"
            chartConfig={aestheticianRevenueChartConfig}
            chartData={appointment.appointments_by_aesthetician}
          />
        )}

        {isFetchingAppointmentData ? (
          <>Loading...</>
        ) : (
          <BarChartComponent
            value="Number of Appointments"
            title="Appointments By Branch"
            dataKey="count"
            nameKey="aesthetician"
            chartConfig={aestheticianRevenueChartConfig}
            chartData={appointment.appointments_by_aesthetician}
          />
        )}

        {isFetchingAppointmentData ? (
          <>Loading...</>
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

        {isFetchingAppointmentData ? (
          <>Loading...</>
        ) : (
          <BarChartComponent
            value="Avarage"
            title="Top Rated Aesthetician"
            dataKey="average_rate"
            nameKey="aesthetician"
            chartConfig={aestheticianRevenueChartConfig}
            chartData={appointment.top_rated_aesthetician}
          />
        )}

        {isFetchingAppointmentData ? (
          <>Loading...</>
        ) : (
          <BarChartComponent
            value="Avarage"
            title="Top Rated Service"
            dataKey="average_rate"
            nameKey="service_name"
            chartConfig={aestheticianRevenueChartConfig}
            chartData={appointment.top_rated_service}
          />
        )}

        {isFetchingAppointmentData ? (
          <>Loading...</>
        ) : (
          <BarChartComponent
            value="Avarage"
            title="Top Rated Branch"
            dataKey="average_rate"
            nameKey="branch_name"
            chartConfig={aestheticianRevenueChartConfig}
            chartData={appointment.top_rated_branch}
          />
        )}
      </div>
    </>
  );
};

export default AppointmentDashboard;
