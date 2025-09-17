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

const SalesDashboard = () => {
  const { data: summaryData, isFetching: isFetchingSummaryData } =
    useAnalyticsSummary({});
  const summary = (summaryData as AnalyticsSummaryResponse) || {};

  const { data: salesData, isFetching: isFetchingSalesData } =
    useAnalyticsSales({});
  const sales = (salesData as SalesAnalyticsResponse) || {};

  const paymentMethodChartConfig = {
    cash: {
      label: "Cash",
      color: "#4CAF50",
    },
    "e-wallet": {
      label: "E-Wallet",
      color: "#2196F3",
    },
    "bank-transfer": {
      label: "Bank Transfer",
      color: "#9C27B0",
    },
    "credit-card": {
      label: "Credit Card",
      color: "#FF9800",
    },
    "debit-card": {
      label: "Debit Card",
      color: "#F44336",
    },
  };

  const aestheticianRevenueChartConfig = {
    aesthetician: {
      label: "Aesthetician",
      color: "#D6C285",
    },
  };

  return (
    <>
      <div className="mb-5 flex justify-between items-center">
        <ToggleDates />
        <DropDownBranch />
      </div>
      <div className="flex flex-wrap gap-3 mb-5">{/* <DashboardCard /> */}</div>
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
              title="Most Used Payment Method"
              dataKey="count"
              nameKey="final_payment_method"
              chartConfig={paymentMethodChartConfig}
              chartData={sales.payment_popularity}
            />
          )}
        </div>
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

        <LineChartComponent />
      </div>
    </>
  );
};

export default SalesDashboard;
