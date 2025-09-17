"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
  Cell,
} from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import { Card, CardHeader, CardTitle } from "../ui/card";

type ChartData<T> = T[];

type ChartConfig = Record<string, { label: string; color: string }>;

type BarChartProps<T extends Record<string, unknown>> = {
  title: string;
  value: string;
  dataKey: Extract<keyof T, string | number>; // numeric value (y-axis)
  nameKey: Extract<keyof T, string | number>; // category (x-axis)
  chartConfig: ChartConfig;
  chartData: ChartData<T>;
};

export const BarChartComponent = <T extends Record<string, unknown>>({
  title,
  value,
  dataKey,
  nameKey,
  chartConfig,
  chartData,
}: BarChartProps<T>) => {
  return (
    <Card className="flex-1 bg-gradient-to-br from-white to-[#fffcef]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <ChartContainer
        config={chartConfig}
        className="min-h-[300px] h-[300px] w-full"
      >
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          {/* X axis = categories */}
          <XAxis dataKey={nameKey}>
            <Label
              value={String(nameKey)
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              offset={-5}
              position="insideBottom"
            />
          </XAxis>

          {/* Y axis = values */}
          <YAxis>
            <Label
              value={value}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>

          <Tooltip />

          {/* Bars with dynamic colors */}
          <Bar dataKey={dataKey} radius={4}>
            {chartData.map((entry, index) => {
              const key = String(entry[nameKey]);
              const config = chartConfig[key];
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={config ? config.color : "#BDA658"} // fallback to brand color
                />
              );
            })}
          </Bar>
        </BarChart>
      </ChartContainer>
    </Card>
  );
};
