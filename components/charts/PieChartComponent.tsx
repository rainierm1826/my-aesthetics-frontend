import React from "react";
import { Pie, PieChart, Cell, Tooltip } from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import { Card, CardHeader, CardTitle } from "../ui/card";

type ChartData<T> = T[];

type ChartConfig = Record<string, { label: string; color: string }>;

type PieChartProps<T extends Record<string, unknown>> = {
  title: string;
  dataKey: Extract<keyof T, string | number>;
  nameKey: Extract<keyof T, string | number>;
  chartConfig: ChartConfig;
  chartData: ChartData<T>;
};

const PieChartComponent = <T extends Record<string, unknown>>({
  title,
  dataKey,
  nameKey,
  chartConfig,
  chartData,
}: PieChartProps<T>) => {


  return (
    <Card className="flex-1 bg-gradient-to-br from-white to-[#fffcef]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <ChartContainer
        config={chartConfig}
        className="min-h-[150px] h-auto w-full"
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            stroke="#ffffff"
            strokeWidth={2}
            label
            labelLine={{ stroke: "#000000", strokeWidth: 1 }}
          >
            {chartData.map((entry, index) => {
              const key = String(entry[nameKey]);
              const color = chartConfig[key]?.color ?? "#ccc";
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>

          <Tooltip />
        </PieChart>
      </ChartContainer>
    </Card>
  );
};

export default PieChartComponent;
