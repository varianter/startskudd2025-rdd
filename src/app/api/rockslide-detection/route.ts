import { connect, INDEX_NAME } from "@/elastic";

type LandslideAggs = {
  sensors: {
    buckets: Array<{
      key: string;
      hits_count: { value: number };
    }>;
  };
};

export async function GET() {
  const client = await connect();

  // ISO strings for now and 24h ago
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const resp = await client.search<unknown, LandslideAggs>({
    index: INDEX_NAME,
    size: 0,
    query: {
      bool: {
        must: [
          // time window
          { range: { readingDate: { gte: yesterday, lte: now } } },

          // nested depth check
          {
            nested: {
              path: "sensor",
              query: {
                range: {
                  "sensor.placement.depthInMeter": { gte: 1.0 }
                }
              }
            }
          },

          // movement threshold
          {
            bool: {
              should: [
                // Must match one of the following (so, between -5.0 and 5.0)
                { range: { deltaMovementInMm: { gt: 5.0 } } },
                { range: { deltaMovementInMm: { lt: -5.0 } } }
              ]
            }
          }
        ]
      }
    },
    aggs: {
      sensors: {
        terms: { field: "sensorId", size: 1000 },
        aggs: {
          hits_count: { value_count: { field: "sensorId" } },
          only_danger: {
            bucket_selector: {
              buckets_path: { count: "hits_count" },
              script: "params.count >= 10"
            }
          }
        }
      }
    }
  });

  const buckets = resp.aggregations?.sensors.buckets ?? [];
  const counts = buckets.map(b => ({
    sensorId: b.key,
    dangerCount: b.hits_count.value
  }));
  const flagged = counts.filter(c => c.dangerCount >= 10).map(c => c.sensorId);

  return new Response(JSON.stringify({ counts, flaggedSensors: flagged }));

}