import { createGitHubOAuthConfig, createHelpers } from "$deno_kv_oauth/mod.ts";
import type { Plugin } from "$fresh/server.ts";
import { deleteUserBySessionId, setUserBySessionId } from "../actions/users.ts";
import { getGitHubUser, getGitHubUserEmail } from "../utils/github.ts";

const { signIn, handleCallback, signOut, getSessionId } = createHelpers(
  createGitHubOAuthConfig({
    scope: ["user:email"],
  }),
);

export default {
  name: "kv-oauth",
  routes: [
    {
      path: "/signin",
      async handler(req) {
        return await signIn(req);
      },
    },
    {
      path: "/callback",
      async handler(req) {
        const { response, tokens, sessionId } = await handleCallback(req);
        const githubUser = await getGitHubUser(tokens.accessToken);

        if (!githubUser.email) {
          const email = await getGitHubUserEmail(tokens.accessToken);
          githubUser.email = email;
        }

        await setUserBySessionId(sessionId, githubUser);

        return response;
      },
    },
    {
      path: "/signout",
      async handler(req) {
        const sessionId = await getSessionId(req);
        if (!sessionId) throw new Error("Not logged in");
        await deleteUserBySessionId(sessionId);
        return await signOut(req);
      },
    },
  ],
} as Plugin;
