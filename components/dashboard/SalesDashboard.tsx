"use client";
import React from "react";
import PieChartComponent from "@/components/charts/PieChartComponent";
import ToggleDates from "@/components/ToggleDates";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import DashboardCard from "@/components/cards/DashboardCard";
import DropDownBranch from "@/components/selects/DropDownBranch";
import LineChartComponent from "@/components/charts/LineChartComponent";
import {
  RevenueOvertimeResponse,
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
import { useAuthStore } from "@/provider/store/authStore";
import { useRevenueOvertime } from "@/hooks/useRevenueOvertime";
import { useSearchParams } from "next/navigation";
import DropDownYear from "../selects/DropDownYear";
import DropDownMonth from "../selects/DropDownMonth";

const SalesDashboard = () => {
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
    useSalesSummary({ token: access_token || "" });
  const summary = (summaryData as SalesSummaryResponse) || {};

  const { data: salesData, isFetching: isFetchingSalesData } =
    useAnalyticsSales({ token: access_token || "" });
  const sales = (salesData as SalesAnalyticsResponse) || {};

  const { data: revenueOvertime, isFetching: isFetchingRevenueOvertime } =
    useRevenueOvertime({ token: access_token || "" });
  const revenue = (revenueOvertime as RevenueOvertimeResponse) || {};

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="w-full sm:w-auto">
            <ToggleDates />
          </div>
          <div className="grid grid-cols-2 sm:flex gap-3">
            <DropDownYear />
            <DropDownMonth />
          </div>
        </div>

        <div className="w-full sm:w-auto lg:min-w-[200px]">
          <DropDownBranch useUrlParams={true} includeAllOption={true} />
        </div>
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
            title="Total Revenue"
            content={`₱${formatNumber(summary.total_revenue)}`}
            info="Overall income generated across all branches"
          />
          <DashboardCard
            title="Average Transaction"
            content={`₱${formatNumber(summary.average_transaction_value)}`}
            info="Average revenue earned per appointment"
          />
          <DashboardCard
            title="Total Discounts"
            content={`₱${formatNumber(summary.total_discount_given)}`}
            info="Total amount discounted via vouchers and sales"
          />
          <DashboardCard
            title="Cancellation Loss"
            content={`₱${formatNumber(summary.cancellation_loss)}`}
            info="Total potential revenue lost from cancelled appointments"
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
            {isFetchingSalesData || isAuthLoading ? (
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
            {isFetchingSalesData || isAuthLoading ? (
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
            {isFetchingRevenueOvertime || isAuthLoading ? (
              <SkeletonLineChart />
            ) : (
              <LineChartComponent
                value="Total Revenue"
                title="Revenue Overtime"
                dataKey="revenue"
                nameKey={getNameKey(groupBy)}
                chartConfig={aestheticianRevenueChartConfig}
                chartData={revenue.revenue_overtime}
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
            {isFetchingSalesData || isAuthLoading ? (
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

            {isFetchingSalesData || isAuthLoading ? (
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
            {isFetchingSalesData || isAuthLoading ? (
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
