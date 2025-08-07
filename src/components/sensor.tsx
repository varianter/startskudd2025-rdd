import { RockSlideResponse, SensorDocument } from "@/types/elastic";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { formatSensorId } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { spans } from "next/dist/build/webpack/plugins/profiling-plugin";
import { FileWarningIcon, MessageSquareWarningIcon, TriangleAlertIcon } from "lucide-react";
import { Warning } from "postcss";

function getRowStyle(status: string) {
  switch (status) {
    case "OFF":
      return "bg-gray-200 hover:bg-gray-200";
    case "ERROR":
      return "bg-red-300 hover:bg-red-300";
    default:
      return "";
  }
}

const maxWarnings = 10;

export function SensorTable({ sensors, rockslideData }: {
  sensors: SensorDocument[],
  rockslideData: RockSlideResponse
}) {

  return <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Sensor</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Position</TableHead>
        <TableHead>Last reading</TableHead>
        <TableHead>Updated</TableHead>
        <TableHead>Warnings</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {sensors.map((sensor) => {
          const rockSlides = rockslideData.counts.filter((x) => x.sensorId === sensor.sensorId);
          const warnings = rockSlides.length > 0 ? rockSlides[0].dangerCount : 0;

          return (
            <TableRow key={sensor.sensorId} className={getRowStyle(sensor.status)}>
              <TableCell>
                {formatSensorId(sensor.sensorId)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {sensor.status}
                </div>
              </TableCell>
              <TableCell>{sensor.sensor.placement.x}, {sensor.sensor.placement.y}, {sensor.sensor.placement.depthInMeter}</TableCell>
              <TableCell>{sensor.deltaMovementInMm ? `${sensor.deltaMovementInMm.toPrecision(2)} mm` : ''}</TableCell>
              <TableCell>{format(sensor.readingDate, 'HH:mm:ss')}</TableCell>
              <TableCell>
                <div className="flex flex-row gap-1.5">
                  {Array.from({ length: maxWarnings }).map((_, i) =>
                    <div key={i}>
                      {warnings >= i + 1
                        ? <TriangleAlertIcon color="red"/>
                        : <div className="h-[24px] w-[24px] border-dotted border-gray-400 border-[2px] rounded-[3px]"/>
                      }
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )
        }
      )}
    </TableBody>
  </Table>
}