import { getKV } from "../utils/kv.ts";

export type Metric = "metric_link_created" | "metric_link_visited";

export async function incrementMetric(metric: Metric) {
  const kv = await getKV();
  const res = await kv.atomic()
    .mutate({
      type: "sum",
      key: [metric],
      value: new Deno.KvU64(1n),
    })
    .commit();

  if (!res.ok) throw new TypeError("Couldn't increment metric");
}

export async function getMetricValue(metric: Metric) {
  const kv = await getKV();
  const res = await kv.get<Deno.KvU64>([metric]);

  if (!res.value) return 0n;

  return res.value.value;
}
