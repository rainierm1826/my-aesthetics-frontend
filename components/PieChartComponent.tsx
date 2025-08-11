import React from "react";
import { Pie, PieChart, Cell, Tooltip } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Card, CardHeader, CardTitle } from "./ui/card";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "July", desktop: 180 },
  { month: "August", desktop: 195 },
  { month: "September", desktop: 220 },
  { month: "October", desktop: 245 },
  { month: "November", desktop: 260 },
  { month: "December", desktop: 275 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#BDA658",
  },
} satisfies ChartConfig;

const PieChartComponent = () => {
  return (
    <Card className="flex-1 bg-gradient-to-br from-white to-[#fffcef]">
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <ChartContainer
        config={chartConfig}
        className="min-h-[150px] h-auto w-full"
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="desktop"
            nameKey="month"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill={chartConfig.desktop.color}
            stroke="#ffffff"
            strokeWidth={2}
            label
            labelLine={{ stroke: "#000000", strokeWidth: 1 }}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={chartConfig.desktop.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartContainer>
    </Card>
  );
};

export default PieChartComponent;
