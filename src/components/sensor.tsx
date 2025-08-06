import { SensorDocument } from "@/types/elastic";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

function getStatusColor(status: string) {
  switch (status) {
    case "ON":
      return "bg-green-500";
    case "OFF":
      return "bg-black";
    case "ERROR":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
        <TableRow key={sensor.sensorId}>
          <TableCell>
            {capitalizeFirstLetter(sensor.sensorId.replace("-", " "))}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1">
              <div className={cn("rounded-full h-3 w-3", getStatusColor(sensor.status))}/>
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