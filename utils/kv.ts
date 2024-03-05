export async function getKV() {
  // TODO: add kv url from the project
  const kv = await Deno.openKv();
  return kv;
}
