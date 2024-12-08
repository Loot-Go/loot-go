"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
  },
} satisfies ChartConfig;

export function PriceChart({ data }: { data: Record<string, number>[] }) {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10dc78" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          horizontal={false}
          stroke="#e0e0e0"
          strokeWidth={1}
        />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={false}
          tickFormatter={(value) => value}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />
        <Area
          dataKey="price"
          type="linear"
          fill="url(#priceGradient)"
          fillOpacity={0.8}
          stroke="#10DC78"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
