import { connect, INDEX_NAME } from "@/elastic";
import type { SensorDocument } from "@/types/elastic";

export const revalidate = 0;

export async function GET() {
  try {
    const client = await connect();

    const info = await client.info();
    const clusterName = info.cluster_name;
    const docCountResult = await client.count({ index: INDEX_NAME });
    const docCount = docCountResult.count;

    // Get sensor statuses (latest 20 by readingDate)
    const statusResponse = await client.search({
      index: INDEX_NAME,
      query: { match_all: {} },
      size: 20,
      collapse: { field: "sensorId" },
      sort: [
        { readingDate: { order: "desc" } },
      ]
    });

    const sensors = statusResponse.hits.hits
      .map(hit => hit._source as SensorDocument)
      .sort((a, b) => {
        const numA = parseInt(a.sensorId.replace("sensor-", ""), 10);
        const numB = parseInt(b.sensorId.replace("sensor-", ""), 10);
        return numA - numB;
      });

    return Response.json({
      clusterName,
      docCount,
      sensors,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch sensor data" }),
      { status: 500 }
    );
  }
}