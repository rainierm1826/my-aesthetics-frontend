"use client";
import React from "react";
import PieChartComponent from "@/components/charts/PieChartComponent";
import ToggleDates from "@/components/ToggleDates";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import DashboardCard from "@/components/cards/DashboardCard";
import DropDownBranch from "@/components/selects/DropDownBranch";
import LineChartComponent from "@/components/charts/LineChartComponent";
import {
  SalesAnalyticsResponse,
  SalesSummaryResponse,
} from "@/lib/types/analytics-type";
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
import { useSalesSummary } from "@/hooks/useSalesSummary";
import { SkeletonPieChart } from "../skeletons/SkeletonPieChart";
import SkeletonLineChart from "../skeletons/SkeletonLineChart";
import { SkeletonBarChart } from "../skeletons/SkeletonBarChart";

const SalesDashboard = () => {
  const { data: summaryData, isFetching: isFetchingSummaryData } =
    useSalesSummary({});
  const summary = (summaryData as SalesSummaryResponse) || {};

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
            content={`₱${formatNumber(summary.total_revenue)}`}
            info="Overall income generated across all branches"
          />

          <DashboardCard
            title="Total Revenue"
            content={`₱${formatNumber(summary.total_revenue)}`}
            info="Sum of all completed sales and services"
          />

          <DashboardCard
            title="Total Revenue"
            content={`₱${formatNumber(summary.total_revenue)}`}
            info="Gross revenue before expenses and deductions"
          />

          <DashboardCard
            title="Total Revenue"
            content={`₱${formatNumber(summary.total_revenue)}`}
            info="Represents earnings within the selected period"
          />
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-3">
          {isFetchingSalesData ? (
            <SkeletonPieChart />
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
            <SkeletonPieChart />
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
          <SkeletonLineChart />
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
          <SkeletonBarChart />
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
          <SkeletonBarChart />
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
          <SkeletonBarChart />
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
