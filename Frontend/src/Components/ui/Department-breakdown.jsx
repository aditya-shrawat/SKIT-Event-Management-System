import React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

function DepartmentBreakdown({ data = [] }) {
  return (
    <ChartContainer
      config={{
        count: { label: "Registrations", color: "hsl(var(--chart-3))" },
      }}
      className="h-[280px] w-full"
    >
      <BarChart data={data} margin={{ left: 8, right: 8, top: 12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" tickLine={false} axisLine={false} />
        <YAxis width={40} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="#00bebe" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export { DepartmentBreakdown }
export default DepartmentBreakdown