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

const AppointmentDashboard = () => {
  const { data: summaryData, isFetching: isFetchingSummaryData } =
    useAppointmentSummary({});
  const summary = (summaryData as AppointmentSummaryResponse) || {};

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
              content={summary?.total_appointments?.toLocaleString() ?? '0'}
              info="All scheduled bookings in the period"
            />

            <DashboardCard
              title="Completion Rate"
              content={`${summary.completion_rate}%`}
              info="Percentage of finished appointments"
            />

            <DashboardCard
              title="Cancellation Rate"
              content={`${summary.cancellation_rate}%`}
              info="Share of canceled bookings"
            />

            <DashboardCard
              title="Overall Rating"
              content={summary.avarage_overall_rating}
              info="Combined average of aestheticians, branches, and services"
            />
          </div>
        </>
      )}
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-3">
          {isFetchingAppointmentData ? (
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
          {isFetchingAppointmentData ? (
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

        {isFetchingAppointmentData ? (
          <div>
            <SkeletonLineChart />
          </div>
        ) : (
          <LineChartComponent
            value="Number of Appointments"
            title="Appointments Overtime"
            dataKey="count"
            nameKey="year"
            chartConfig={aestheticianRevenueChartConfig}
            chartData={appointment.appointments_overtime}
          />
        )}

        {/* <BarChartComponent /> */}
        {isFetchingAppointmentData ? (
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

        {isFetchingAppointmentData ? (
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

        {isFetchingAppointmentData ? (
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

        {isFetchingAppointmentData ? (
          <SkeletonBarChart />
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
          <SkeletonBarChart />
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
          <SkeletonBarChart />
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
