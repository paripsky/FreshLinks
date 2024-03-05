import { GitHubUser } from "../utils/github.ts";
import { getKV } from "../utils/kv.ts";

export async function setUserBySessionId(sessionId: string, user: GitHubUser) {
  const kv = await getKV();
  const { ok } = await kv.set(["user_by_session", sessionId], user);

  return ok;
}

export async function getUserBySessionId(sessionId: string) {
  const kv = await getKV();
  const user = await kv.get<GitHubUser>(["user_by_session", sessionId]);

  if (!user.value) throw new Error("user not found");

  return user.value;
}
