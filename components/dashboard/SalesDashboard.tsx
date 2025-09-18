"use client";
import React from "react";
import PieChartComponent from "@/components/charts/PieChartComponent";
import ToggleDates from "@/components/ToggleDates";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import DashboardCard from "@/components/cards/DashboardCard";
import DropDownBranch from "@/components/selects/DropDownBranch";
import LineChartComponent from "@/components/charts/LineChartComponent";
import {
  AnalyticsSummaryResponse,
  SalesAnalyticsResponse,
} from "@/lib/types/analytics-type";
import { useAnalyticsSummary } from "@/hooks/useAnalyticsSummary";
import SkeletonScoreBoard from "../skeletons/SkeletonScoreBoard";
import { useAnalyticsSales } from "@/hooks/useAnalyticsSales";
import {
  aestheticianRevenueChartConfig,
  branchRevenueChartConfig,
  paymentMethodChartConfig,
  serviceCategoryChartConfig,
  serviceRevenueChartConfig,
} from "@/config/salesConfig";
import { formatNumber } from "@/lib/function";

const SalesDashboard = () => {
  const { data: summaryData, isFetching: isFetchingSummaryData } =
    useAnalyticsSummary({});
  const summary = (summaryData as AnalyticsSummaryResponse) || {};

  const { data: salesData, isFetching: isFetchingSalesData } =
    useAnalyticsSales({});
  const sales = (salesData as SalesAnalyticsResponse) || {};

  return (
    <>
      <div className="mb-5 flex justify-between items-center">
        <ToggleDates />
        <DropDownBranch />
      </div>
      {isFetchingSummaryData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonScoreBoard key={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 mb-5">
          <DashboardCard
            title="Total Revenue"
            content={`${formatNumber(summary.total_revenue)}`}
          />

          <DashboardCard
            title="Total Revenue"
            content={`${formatNumber(summary.total_revenue)}`}
          />
          <DashboardCard
            title="Total Revenue"
            content={`${formatNumber(summary.total_revenue)}`}
          />
          <DashboardCard
            title="Total Revenue"
            content={`${formatNumber(summary.total_revenue)}`}
          />
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-3">
          {isFetchingSalesData ? (
            <SkeletonScoreBoard />
          ) : (
            <PieChartComponent
              title="Most Used Payment Method"
              dataKey="count"
              nameKey="final_payment_method"
              chartConfig={paymentMethodChartConfig}
              chartData={sales.payment_popularity}
            />
          )}
          {isFetchingSalesData ? (
            <SkeletonScoreBoard />
          ) : (
            <PieChartComponent
              title="Revenue By Category"
              dataKey="revenue"
              nameKey="category_snapshot"
              chartConfig={serviceCategoryChartConfig}
              chartData={sales.revenue_by_category}
            />
          )}
        </div>

        {isFetchingSalesData ? (
          <p>Loading...</p>
        ) : (
          <LineChartComponent
            value="Number of Appointments"
            title="Appointments Overtime"
            dataKey="revenue"
            nameKey="year"
            chartConfig={aestheticianRevenueChartConfig}
            chartData={sales.revenue_overtime}
          />
        )}

        {isFetchingSalesData ? (
          <>Loading...</>
        ) : (
          <BarChartComponent
            value="Revenue"
            title="Revenue by Aesthetician"
            dataKey="revenue"
            nameKey="aesthetician"
            chartConfig={aestheticianRevenueChartConfig}
            chartData={sales.revenue_by_aesthetician}
          />
        )}

        {isFetchingSalesData ? (
          <>Loading...</>
        ) : (
          <BarChartComponent
            value="Revenue"
            title="Revenue by Service"
            dataKey="revenue"
            nameKey="service"
            chartConfig={serviceRevenueChartConfig}
            chartData={sales.revenue_by_service}
          />
        )}

        {isFetchingSalesData ? (
          <>Loading...</>
        ) : (
          <BarChartComponent
            value="Revenue"
            title="Revenue by Branch"
            dataKey="revenue"
            nameKey="branch"
            chartConfig={branchRevenueChartConfig}
            chartData={sales.revenue_by_branch}
          />
        )}
      </div>
    </>
  );
};

export default SalesDashboard;
