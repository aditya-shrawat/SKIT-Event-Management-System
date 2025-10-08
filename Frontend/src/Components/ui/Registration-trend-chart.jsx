import React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

export default function RegistrationTrendChart({ data = [] }) {
  // ChartContainer injects CSS vars for colors via config keys below.
  return (
    <ChartContainer
      config={{
        registrations: {
          label: "Daily Registrations",
          color: "hsl(var(--chart-1))",
        },
        cumulative: {
          label: "Cumulative",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[280px] w-full"
    >
      <AreaChart data={data} margin={{ left: 8, right: 8, top: 12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <YAxis width={40} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="registrations"
          stroke="var(--color-registrations)"
          fill="var(--color-registrations)"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="cumulative"
          stroke="var(--color-cumulative)"
          fill="var(--color-cumulative)"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}