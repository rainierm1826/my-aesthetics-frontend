
import React from "react";

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
import { formatNumber } from "@/lib/function";

type ChartData<T> = T[];

type ChartConfig = Record<string, { label: string; color: string }>;

type BarChartProps<T extends Record<string, unknown>> = {
  title: string;
  value: string;
  dataKey: Extract<keyof T, string | number>;
  nameKey: Extract<keyof T, string | number>;
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
  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Responsive: hide XAxis ticks and label on small screens
  const [showXAxisLabels, setShowXAxisLabels] = React.useState(true);
  React.useEffect(() => {
    const handleResize = () => {
      setShowXAxisLabels(window.innerWidth >= 640); // 640px = tailwind 'sm' breakpoint
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card className="flex-1 bg-gradient-to-br from-white to-[#fffcef]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <ChartContainer
        config={chartConfig}
        className="min-h-[400px] h-[400px] w-full"
      >
        <BarChart data={chartData} margin={{ bottom: 40, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />

          {/* X axis = categories */}
          <XAxis
            dataKey={nameKey}
            interval={0}
            tick={showXAxisLabels ? { fontSize: 11 } : false}
            tickFormatter={showXAxisLabels ? (value) => truncateText(value, 15) : undefined}
          >
              <Label
                value={String(nameKey)
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                offset={15}
                position="bottom"
              />
          </XAxis>

          {/* Y axis = values */}
          <YAxis tickFormatter={(value: number) => formatNumber(value)}>
            <Label
              value={value}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>

          <Tooltip
            formatter={(val: number) => [formatNumber(val), value]}
            labelFormatter={(label) => String(label)}
            contentStyle={{ fontSize: '14px' }}
          />

          <Bar dataKey={dataKey} radius={4} fill="#BDA658">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill="#BDA658"
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </Card>
  );
};
