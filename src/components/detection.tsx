import { formatSensorId } from "@/lib/utils";

export default function RockSlideDetection({ rockslideData }: any) {
    return (
        <div>
            {rockslideData?.flaggedSensors.length ? (
                <div className="bg-red-100 text-red-800 p-4 rounded">
                🚨 Potential rockslide detected on:{" "}
                {rockslideData.flaggedSensors.map(formatSensorId).join(", ")}
                </div>
            ) : null}
        </div>
    );
}