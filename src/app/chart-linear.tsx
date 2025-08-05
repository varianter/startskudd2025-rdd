"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ReferenceLine, Label } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A linear line chart"

const chartData = [
  { time: "1", sensor: 2 },
  { time: "2", sensor: 1 },
  { time: "3", sensor: 7 },
  { time: "4", sensor: 4 },
  { time: "5", sensor: 3 },
  { time: "6", sensor: 9 },
  { time: "7", sensor: 2.3 },
  { time: "8", sensor: 3.5 },
  { time: "9", sensor: 4 },
  { time: "10", sensor: 2 },
]

const chartConfig = {
  sensor: {
    label: "Sensor",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartLineLinear() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sanntidsvisning av sensordata</CardTitle>
        <CardDescription>De siste 10 minutt</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: 32, 
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            >
                <Label value="Minutt" offset={-15} position="insideBottom" />
            </XAxis>
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8} 
            >
                <Label value="Millimeter" offset={0} position="insideLeft" angle={-90} />
            </YAxis>
            <ReferenceLine y={5} stroke="red" strokeWidth={2} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="sensor"
              type="natural"
              stroke={`hsl(var(--chart-2))`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Viser maks-bevegelse for sensor X i løpet av de siste 10 minuttene.
        </div>
      </CardFooter>
    </Card>
  )
}
