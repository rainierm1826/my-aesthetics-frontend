"use client";
import React from "react";
import PieChartComponent from "@/components/PieChartComponent";
import ToggleDates from "@/components/ToggleDates";
import { BarChartComponent } from "@/components/BarChartComponent";
import DashboardCard from "@/components/cards/DashboardCard";
import DropDownBranch from "@/components/DropDownBranch";
import LineChartComponent from "@/components/LineChartComponent";
const AppointmentDashboard = () => {
  return (
    <>
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
    </>
  );
};

export default AppointmentDashboard;
