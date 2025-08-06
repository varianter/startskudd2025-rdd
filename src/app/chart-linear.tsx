"use client"

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
import { SensorDocument } from "@/types/elastic"
import { useState, useEffect } from "react";

export const description = "A linear line chart"

const chartConfig = {
  sensor: {
    label: "Sensor",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartLineLinear({ sensordata }: { sensordata: SensorDocument[] }) {
  const firstSensorId = sensordata[0]?.sensorId;
  const latest = sensordata.find(d => d.sensorId === firstSensorId);

  // State to accumulate readings
  const [history, setHistory] = useState<{ readingDate: string; deltaMovementInMm: number }[]>([]);

  useEffect(() => {
    if (!latest) return;
    setHistory(prev => {
      // Add new reading
      const updated = [...prev, { readingDate: latest.readingDate, deltaMovementInMm: latest.deltaMovementInMm }];
      // Remove readings older than 10 minutes
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
      return updated.filter(d => new Date(d.readingDate).getTime() >= tenMinutesAgo);
    });
  }, [latest?.readingDate, latest?.deltaMovementInMm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor data in true time</CardTitle>
        <CardDescription>The last 10 minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={history}
            margin={{
              left: 12,
              right: 12,
              bottom: 32, 
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="readingDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleTimeString([], { second: '2-digit' })
            }
            >
                <Label value="Minutt" offset={-15} position="insideBottom" />
            </XAxis>
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8} 
                domain={[0, 10]}
            >
                <Label value="Millimeter" offset={0} position="insideLeft" angle={-90} />
            </YAxis>
            <ReferenceLine y={5} stroke="red" strokeWidth={2} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="deltaMovementInMm"
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
          Shows movement for sensor X the last 10 minutes.
        </div>
      </CardFooter>
    </Card>
  )
}

