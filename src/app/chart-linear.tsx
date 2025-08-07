"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Label,
} from "recharts"

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
import { useEffect, useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

export const description = "Toggleable sensor data chart"

const chartConfig = {
  sensor: {
    label: "Sensor",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type ChartMode = "movement" | "depth"

export function ChartLineLinear({
  sensordata,
}: {
  sensordata: Record<string, SensorDocument[]>
}) {
    const sensorIds = Object.keys(sensordata).sort(
    new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }).compare
  )
  const [selectedSensorId, setSelectedSensorId] = useState(sensorIds[0] ?? "")
  const [mode, setMode] = useState<ChartMode>("depth")

  useEffect(() => {
    if (sensorIds.length && !sensorIds.includes(selectedSensorId)) {
      setSelectedSensorId(sensorIds[0])
    }
  }, [sensorIds.join(","), selectedSensorId])

  const history = sensordata[selectedSensorId] ?? []

  const chartData = history.map((d) => ({
    readingDate: d.readingDate,
    deltaMovementInMm: d.deltaMovementInMm,
    realtimeDepthInMeter: d.readingPlacement?.depthInMeter,
  }))

  // Get dynamic bounds from the green line (main measurement)
  const greenLineValues = chartData.map(d =>
    mode === "movement" ? d.deltaMovementInMm : d.realtimeDepthInMeter
  ).filter((v): v is number => typeof v === "number")

  const minValue = Math.min(...greenLineValues)
  const maxValue = Math.max(...greenLineValues)
  const padding = (maxValue - minValue) * 0.2 || 0.05 // fallback in case values are very tight

  const yDomain: [number, number] = [minValue - padding, maxValue + padding]

  const yAxisProps =
    mode === "movement"
      ? {
          dataKey: "deltaMovementInMm",
          yLabel: "Movement (mm)",
          domain: [0, 10],
        }
      : {
          dataKey: "realtimeDepthInMeter",
          yLabel: "Real-time depth (m)",
          domain: ["auto", "auto"],
        }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor data in real time</CardTitle>
        <CardDescription>The last 10 minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <label htmlFor="sensor-select" className="mr-2 font-medium">
              Sensor:
            </label>
            <select
              id="sensor-select"
              value={selectedSensorId}
              onChange={(e) => setSelectedSensorId(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {sensorIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
          <ToggleGroup className="gap-0">
            <ToggleGroupItem
              value="movement"
              isActive={mode === "movement"}
              onClick={() => setMode("movement")}
            >
              Movement (mm)
            </ToggleGroupItem>
            <ToggleGroupItem
              value="depth"
              isActive={mode === "depth"}
              onClick={() => setMode("depth")}
            >
              Real-time depth (m)
            </ToggleGroupItem>
          </ToggleGroup>

        </div>

        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12, bottom: 32 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="readingDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second: '2-digit' })
              }
            >
              <Label value="HH:MM:SS" offset={-15} position="insideBottom" />
            </XAxis>
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={yDomain}
              tickFormatter={(v) => v.toFixed(4)}
            >
              <Label
                value={yAxisProps.yLabel}
                offset={0}
                position="insideLeft"
                angle={-90}
              />
            </YAxis>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel={false} />}
            />

            {/* Main data line */}
            <Line
              dataKey={yAxisProps.dataKey}
              name={mode === "movement" ? "Movement in mm: " : "Reading depth (m)"}
              type="natural"
              stroke={`hsl(var(--chart-2))`}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />

            {/* Red threshold line for delta movement */}
            {mode === "movement" && (
              <>
                <Line
                  type="linear"
                  name="Upper threshold (m)"
                  dataKey={() => 5.0}
                  stroke="red"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="linear"
                  name="Lower threshold (m)"
                  dataKey={() => -5.0}
                  stroke="red"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </>
            )}

            {/* Black line for original placement in depth mode */}
            {mode === "depth" && history.length > 0 && (
              <Line
                type="linear"
                name="Sensor depth (m)"
                dataKey={() => history[0].sensor.placement.depthInMeter}
                stroke="black"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing {mode === "movement" ? "delta movement" : "real-time depth"} for {" "}
          <strong>{selectedSensorId}</strong>. The red line shows the threshold of 5mm movement, which leads to a warning.
           {mode === "movement" ? "" : " The black line indicates the original placement depth of the sensor."}
        </div>
      </CardFooter>
    </Card>
  )
}
