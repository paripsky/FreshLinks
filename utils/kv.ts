const kv = await Deno.openKv();

export function getKV() {
  return kv;
}
