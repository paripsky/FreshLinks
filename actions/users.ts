import { GitHubUser } from "../utils/github.ts";
import { getKV } from "../utils/kv.ts";

const SESSION_EXPIRY_TIME = 1000 * 60 * 60 * 24 * 7; // 7d

export async function setUserBySessionId(sessionId: string, user: GitHubUser) {
  const kv = await getKV();
  const { ok } = await kv.set(["user_by_session", sessionId], user, {
    expireIn: SESSION_EXPIRY_TIME,
  });

  return ok;
}

export async function deleteUserBySessionId(sessionId: string) {
  const kv = await getKV();
  await kv.delete(["user_by_session", sessionId]);
}

export async function getUserBySessionId(sessionId: string) {
  const kv = await getKV();
  const user = await kv.get<GitHubUser>(["user_by_session", sessionId]);

  return user.value;
}
