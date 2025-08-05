"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";


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

  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [clusterName, setClusterName] = useState("");
  const [docCount, setDocCount] = useState<number | null>(null);
  const [sensors, setSensors] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor-data");
        const data = await res.json();

        setConnectionStatus("Connected");
        setClusterName(data.clusterName);
        setDocCount(data.docCount);
        setSensors(data.sensors);

      } catch (err) {
        console.error(err);
        setConnectionStatus("Disconnected");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // refresh every 2s
    return () => clearInterval(interval);
  }, []);

  
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Typography variant="h1">Dashboard</Typography>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle className="gap-2 flex">
              Connection status
              {connectionStatus === "Connected" ? (
                <Badge variant="default">Connected</Badge>
              ) : (
                <Badge variant="destructive">Not connected</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {connectionStatus === "Connected" ? (
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
                    {sensors.map((sensor, idx) => {
                      const sensorNumber = parseInt(sensor.sensorId.replace("sensor-", ""), 10);

                      return (
                        <div
                          key={sensor.sensorId || idx}
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
    </main>
  );
}
