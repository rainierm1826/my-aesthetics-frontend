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
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <ToggleDates />
        <DropDownBranch />
      </div>

      {/* Summary Cards */}
      {isFetchingSummaryData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonScoreBoard key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Revenue"
            content={`₱${formatNumber(summary.total_revenue)}`}
            info="Overall income generated across all branches"
          />
          <DashboardCard
            title="Total Revenue"
            content={`₱${formatNumber(summary.total_revenue)}`}
            info="Overall income generated across all branches"
          />
          <DashboardCard
            title="Total Revenue"
            content={`₱${formatNumber(summary.total_revenue)}`}
            info="Overall income generated across all branches"
          />
          <DashboardCard
            title="Total Revenue"
            content={`₱${formatNumber(summary.total_revenue)}`}
            info="Overall income generated across all branches"
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Overview Charts */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Sales Overview
          </h2>

          {/* Pie Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          {/* Time Series Chart */}
          <div className="w-full">
            {isFetchingSalesData ? (
              <SkeletonLineChart />
            ) : (
              <LineChartComponent
                value="Total Revenue"
                title="Revenue Overtime"
                dataKey="revenue"
                nameKey="year"
                chartConfig={aestheticianRevenueChartConfig}
                chartData={sales.revenue_overtime}
              />
            )}
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Revenue Distribution
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {isFetchingSalesData ? (
              <SkeletonBarChart />
            ) : (
              <BarChartComponent
                value="Total Revenue"
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
                value="Total Revenue"
                title="Revenue by Branch"
                dataKey="revenue"
                nameKey="branch"
                chartConfig={branchRevenueChartConfig}
                chartData={sales.revenue_by_branch}
              />
            )}
          </div>

          <div className="w-full">
            {isFetchingSalesData ? (
              <SkeletonBarChart />
            ) : (
              <BarChartComponent
                value="Total Revenue"
                title="Revenue by Service"
                dataKey="revenue"
                nameKey="service"
                chartConfig={serviceRevenueChartConfig}
                chartData={sales.revenue_by_service}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
