"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { SensorDocument } from "@/types/elastic";
import { SensorTable } from "@/components/sensor";
import { useEffect } from "react";


export default function Dashboard() {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['sensors'],
    queryFn: async () => {
      const response = await fetch("/api/sensor-data");
      return await response.json();
    },
    retry: 3,
    refetchInterval: 5000,
  });

  const isConnected = !!data;
  const sensors: SensorDocument[] = data?.sensors;

  useEffect(() => {
    if (sensors) {
      console.debug(sensors); // TODO: remove
    }
  }, [sensors]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Typography variant="h1">Dashboard</Typography>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle className="gap-2 flex">
              Sensor Statuses
              {isFetching && <Badge variant="secondary">Updating...</Badge>}
              {isError && <Badge variant="destructive">Error fetching data</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {isConnected
              ? <SensorTable sensors={sensors}/>
              : <p>Not connected</p>}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
