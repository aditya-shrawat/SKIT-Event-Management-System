import React from "react"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

function CapacityGauge({ percent = 0 }) {
  const value = Math.max(0, Math.min(100, percent))
  const data = [
    { name: "Filled", value, fill: "var(--color-filled)" },
    { name: "Remaining", value: 100 - value, fill: "var(--color-remaining)" },
  ]

  return (
    <div className="relative">
      <ChartContainer
        config={{
          filled: { label: "Filled", color: "#00bebe" },
          remaining: { label: "Remaining", color: "#00bebe" },
        }}
        className="h-[280px] w-full"
      >
        <RadialBarChart innerRadius="60%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <RadialBar dataKey="value" background cornerRadius={6} />
        </RadialBarChart>
      </ChartContainer>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-semibold">{value}%</div>
          <div className="text-muted-foreground text-xs">Capacity Used</div>
        </div>
      </div>
    </div>
  )
}

export { CapacityGauge }
export default CapacityGauge
