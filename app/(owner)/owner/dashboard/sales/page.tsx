"use client";

import { BarChartComponent } from "@/components/BarChartComponent";
import DashboardCard from "@/components/DashboardCard";
import DropDownBranch from "@/components/DropDownBranch";
import LineChartComponent from "@/components/LineChartComponent";
import OwnerWrapper from "@/components/OwnerWrapper";
import PieChartComponent from "@/components/PieChartComponent";
import ToggleDates from "@/components/ToggleDates";

export default function SalesDashboardPage() {
  return (
    <OwnerWrapper title="Sales Dashboard">
      <div className="mb-5 flex justify-between items-center">
        <ToggleDates />
        <DropDownBranch />
      </div>
      <div className="flex flex-wrap gap-3 mb-5">
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-3">
          <PieChartComponent />
          <PieChartComponent />
        </div>
        <BarChartComponent />
        <LineChartComponent />
      </div>
    </OwnerWrapper>
  );
}
