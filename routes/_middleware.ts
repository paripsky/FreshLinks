import { FreshContext } from "$fresh/server.ts";
import { getSessionId } from "$deno_kv_oauth/mod.ts";
import { getUserBySessionId } from "../actions/users.ts";
import type { GitHubUser } from "../utils/github.ts";
import { signOut } from "../plugins/auth.ts";

export interface AppState {
  isDarkTheme: boolean;
  user?: GitHubUser;
}

export async function handler(
  req: Request,
  ctx: FreshContext<AppState>,
) {
  const cookie = req.headers.get("cookie");
  const isDarkTheme = !!cookie?.includes("theme=dark");
  const sessionId = await getSessionId(req);

  if (sessionId) {
    const user = await getUserBySessionId(sessionId);
    if (!user) {
      await signOut(req);
      return ctx.next();
    }

    ctx.state.user = user;
  }
  ctx.state.isDarkTheme = isDarkTheme;

  return ctx.next();
}
