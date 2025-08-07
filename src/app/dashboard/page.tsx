"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { SensorDocument } from "@/types/elastic";
import { connect, getConnectionInfo } from "@/elastic";
import { ChartLineLinear } from "../chart-linear";
import { SensorTable } from "@/components/sensor";
import RockSlideDetection from "@/components/detection";


export default function Dashboard() {
  const { data: sensorsData, isFetching: isSensorsFetching, isError } = useQuery({
    queryKey: ['sensors'],
    queryFn: async () => {
      const response = await fetch("/api/sensor-data");
      return await response.json();
    },
    retry: 3,
    refetchInterval: 5000,
  });

  const isConnected = !!sensorsData;
  const sensors: SensorDocument[] = sensorsData?.sensors;

  const { data: rockslideData, isPending: isRockslidePending } = useQuery({
    queryKey: ['rockslide'],
    queryFn: async () => {
      const response = await fetch("/api/rockslide-detection");
      return await response.json();
    },
    refetchInterval: 60_000,
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Typography variant="h1">Dashboard</Typography>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle className="gap-2 flex">
              Sensors
              {isSensorsFetching && <Badge variant="secondary">Updating...</Badge>}
              {isError && <Badge variant="destructive">Error fetching data</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {isConnected
              ? <>
                <RockSlideDetection rockslideData={rockslideData}/>
                <SensorTable sensors={sensors}/>
              </>
              : <p>Not connected</p>}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        {isConnected ? 
        <ChartLineLinear sensordata={sensors} />
         : <p>Not connected</p>}
      </div>
    </main>
  );
}
