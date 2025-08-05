"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { SensorDocument } from "@/types/elastic";
import { connect, getConnectionInfo } from "@/elastic";
import { ChartLineLinear } from "../chart-linear";


const getStatusColor = (status: string) => {
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
};


export default function Dashboard() {
  const { data, isPending } = useQuery({
    queryKey: ['sensors'],
    queryFn: async () => {
      const response = await fetch("/api/sensor-data");
      return await response.json();
    },
    refetchInterval: 2000,
  });

  const isConnected = !!data;
  const sensors: SensorDocument[] = data?.sensors ?? [];
  const clusterName = data?.clusterName;
  const docCount = data?.docCount;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Typography variant="h1">Dashboard</Typography>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle className="gap-2 flex">
              Connection status
              {isPending
                ? (<Badge variant="secondary">Connecting...</Badge>)
                : (
                  isConnected
                    ? <Badge variant="default">Connected</Badge>
                    : <Badge variant="destructive">Not connected</Badge>
                )
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {isConnected ? (
              <>
                <p>
                  Connected to cluster{" "}
                  <code className="bg-slate-200 p-1 font-mono rounded-sm">
                    {clusterName}
                  </code>
                  . Counting {docCount} documents
                </p>

                <div>
                  <Typography variant="h2" className="mb-2">Sensor Statuses</Typography>
                  <div className="grid grid-cols-5 gap-2 w-max">
                    {sensors.map((sensor) => {
                      const sensorNumber = parseInt(sensor.sensorId.replace("sensor-", ""), 10);

                      return (
                        <div
                          key={sensorNumber}
                          className={`relative w-20 h-20 flex items-center justify-center ${getStatusColor(sensor.status)} rounded-sm`}
                          title={`${sensor.sensorId}: ${sensor.status}`}
                        >
                          <span className="absolute text-xs text-white font-bold">
                            {sensorNumber}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Typography variant="h2">Latest Documents for Debugging</Typography>
                  {sensors.map((doc, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-100 p-2 rounded border border-slate-300"
                    >
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(doc, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </>

            ) : (
              <p>Not connected</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <ChartLineLinear />
      </div>
    </main>
  );
}
