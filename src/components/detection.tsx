import Typography from "@/components/ui/typography";
import { format } from "date-fns";
import { useMemo } from "react";

export default function RockSlideDetection({ rockslideData, sensorCount }: {
  rockslideData: any,
  sensorCount: number
}) {

  const timestamp = useMemo(() => new Date().getTime(), []); // TODO: replace with actual warning time

  return (
    <div className="max-w-full w-[500px]">
      {rockslideData?.flaggedSensors.length ? (
        <div className="bg-yellow-100 border-2 border-yellow-400 p-6 rounded flex flex-col gap-2">
          <img src="/rockslide.svg" alt="Rockslide" className="h-14 mx-auto"/>
          <Typography variant="h3">
            Active rockslide danger: Close road
          </Typography>
          <p>
            Movement above threshold value has been detected, rockslides may occur. Close the road and notify of danger.
          </p>
          <p>
            Warnings from {rockslideData.flaggedSensors.length} out of {sensorCount} sensors
          </p>
          <p className="text-muted-foreground">
            {format(timestamp, 'HH:mm:ss')}
          </p>
        </div>
      ) : null}
    </div>
  );
}