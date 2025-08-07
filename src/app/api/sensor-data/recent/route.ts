import { connect, INDEX_NAME } from "@/elastic";
import type { SensorDocument } from "@/types/elastic";
import { NextResponse } from "next/server";

// never cache
export const revalidate = 0;

export async function GET() {
  try {
    const client = await connect();

    const now            = new Date().toISOString();
    const tenMinutesAgo  = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    // fetch all docs in 10 min window
    const resp = await client.search<unknown, { hits: { hits: { _source: SensorDocument }[] } }>({
      index: INDEX_NAME,
      size: 10_000,
      query: {
        range: {
          readingDate: { gte: tenMinutesAgo, lte: now }
        }
      },
      sort: [
        { readingDate: { order: "desc" } }
      ]
    });

    const readings = resp.hits.hits.map(hit => hit._source as SensorDocument);
    const grouped: Record<string, SensorDocument[]> = {};

    readings.forEach((doc: SensorDocument) => {
    grouped[doc.sensorId] ??= [];
    grouped[doc.sensorId].push(doc);
    });

    return NextResponse.json({ recentReadings: grouped });
  } catch (error) {
    console.error("Failed to fetch recent sensor data:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent sensor data" },
      { status: 500 }
    );
  }
}
