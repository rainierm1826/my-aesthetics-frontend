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

import { ChartContainer } from "@/components/ui/chart";
import { Card, CardHeader, CardTitle } from "../ui/card";

type ChartData<T> = T[];

type ChartConfig = Record<string, { label: string; color: string }>;

type LineChartProps<T extends Record<string, unknown>> = {
  title: string;
  value: string;
  dataKey: Extract<keyof T, string | number>;
  nameKey: Extract<keyof T, string | number>;
  chartConfig: ChartConfig;
  chartData: ChartData<T>;
};

export const LineChartComponent = <T extends Record<string, unknown>>({
  title,
  value,
  dataKey,
  nameKey,
  chartConfig,
  chartData,
}: LineChartProps<T>) => {
  return (
    <Card className="flex-1 bg-gradient-to-br from-white to-[#fffcef]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
          <XAxis dataKey={nameKey}>
            <Label
              value={String(nameKey)
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              offset={-5}
              position="insideBottom"
            />
          </XAxis>

          {/* Y axis */}
          <YAxis>
            <Label
              value={value}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>

          {/* Tooltip on hover */}
          <Tooltip />

          {/* Bars */}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={Object.values(chartConfig)[0]?.color || "#BDA658"}
            strokeWidth={2}
            dot={{
              fill: Object.values(chartConfig)[0]?.color || "#BDA658",
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              r: 6,
              stroke: Object.values(chartConfig)[0]?.color || "#BDA658",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ChartContainer>
    </Card>
  );
};

export default LineChartComponent;
