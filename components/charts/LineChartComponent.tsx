import React from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Card, CardHeader, CardTitle } from "../ui/card";

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

const LineChartComponent = () => {
  return (
    <Card className="flex-1 bg-gradient-to-br from-white to-[#fffcef]">
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <ChartContainer
        config={chartConfig}
        className="min-h-[300px] h-[300px] w-full"
      >
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* X axis */}
          <XAxis dataKey="month">
            <Label value="Month" offset={-5} position="insideBottom" />
          </XAxis>

          {/* Y axis */}
          <YAxis>
            <Label
              value="Number of Users"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>

          {/* Tooltip on hover */}
          <Tooltip />

          {/* Bars */}
          <Line
            type={"monotone"}
            stroke="var(--color-desktop)"
            dataKey="desktop"
            fill="var(--color-desktop)"
            radius={4}
          />
        </LineChart>
      </ChartContainer>
    </Card>
  );
};

export default LineChartComponent;
