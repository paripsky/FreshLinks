import { Handlers, PageProps } from "$fresh/server.ts";
import { getLink } from "../actions/links.ts";

type Data = {
  error: Error;
};

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    try {
      const userAgent = req.headers.get("user-agent");
      const referer = req.headers.get("referer");
      const ip = ctx.remoteAddr.hostname;
      const visit = userAgent
        ? {
          ip,
          userAgent,
          referer: referer ?? undefined,
        }
        : undefined;
      const link = await getLink({ linkId: ctx.params.link, visit });

      const headers = new Headers();
      headers.set("cache-control", "no-cache");
      headers.set("location", link.url);
      return new Response(null, {
        status: 301,
        headers,
      });
    } catch (error) {
      return ctx.render({ error });
    }
  },
};

export default function Link({ data }: PageProps<Data>) {
  return <div>Error: {data.error.message}</div>;
}
