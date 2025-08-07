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

export function ChartLineLinear({ sensordata }: { sensordata: Record<string, SensorDocument[]> }) {

  const sensorIds = Object.keys(sensordata);
  const [selectedSensorId, setSelectedSensorId] = useState(sensorIds[0] ?? "");

  useEffect(() => {
    if (sensorIds.length && !sensorIds.includes(selectedSensorId)) {
      setSelectedSensorId(sensorIds[0]);
    }
  }, [sensorIds.join(","), selectedSensorId]);

  const history = sensordata[selectedSensorId] ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor data in true time</CardTitle>
        <CardDescription>The last 10 minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="sensor-select" className="mr-2 font-medium">Sensor:</label>
          <select
            id="sensor-select"
            value={selectedSensorId}
            onChange={e => setSelectedSensorId(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {sensorIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={history}
            margin={{ left: 12, right: 12, bottom: 32 }}
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
              <Label value="Time" offset={-15} position="insideBottom" />
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
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Shows movement for {selectedSensorId} the last 10 minutes.
        </div>
      </CardFooter>
    </Card>
  );
}


