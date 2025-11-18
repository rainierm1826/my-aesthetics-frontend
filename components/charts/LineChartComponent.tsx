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
import { formatNumber } from "@/lib/function";

type ChartData<T> = T[];

type ChartConfig = Record<string, { label: string; color: string }>;

type LineChartProps<T extends object> = {
  title: string;
  value: string;
  dataKey: Extract<keyof T, string | number>;
  nameKey: Extract<keyof T, string | number>;
  chartConfig: ChartConfig;
  chartData: ChartData<T>;
};

export const LineChartComponent = <T extends object>({
  title,
  value,
  dataKey,
  nameKey,
  chartConfig,
  chartData,
}: LineChartProps<T>) => {
  const color = "#BDA658";

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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={nameKey}>
            <Label
              value={String(nameKey)
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              offset={-5}
              position="insideBottom"
            />
          </XAxis>
          <YAxis tickFormatter={(value: number) => formatNumber(value)}>
            <Label
              value={value}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip formatter={(val: number) => [formatNumber(val), value]} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </Card>
  );
};

export default LineChartComponent;
