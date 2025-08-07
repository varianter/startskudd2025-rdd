import { SensorDocument } from "@/types/elastic";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { formatSensorId } from "@/lib/utils";

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

export function SensorTable({ sensors }: { sensors: SensorDocument[] }) {
  return <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Sensor</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Position</TableHead>
        <TableHead>Last reading</TableHead>
        <TableHead>Updated</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {sensors.map((sensor) => (
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
          <TableCell>{format(sensor.readingDate, 'PPpp')}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
}