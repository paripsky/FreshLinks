export async function getKV() {
  return await Deno.openKv();
}
