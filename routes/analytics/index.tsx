import { Handlers, PageProps } from "$fresh/server.ts";
import { getUserLinks } from "../../actions/links.ts";
import { FreshLink } from "../../types/link.ts";
import { formatTimeAgo } from "../../utils/date.ts";
import type { AppState } from "../_middleware.ts";

interface Data {
  userLinks: FreshLink[];
}

export const handler: Handlers<Data, AppState> = {
  async GET(req, ctx) {
    if (!ctx.state.user) {
      return ctx.render({ userLinks: [] });
    }

    const userLinks = await getUserLinks({ userId: ctx.state.user.id });
    return ctx.render({ userLinks });
  },
};

export default function Analytics({ data }: PageProps<Data>) {
  return (
    <section>
      {data.userLinks.length
        ? (
          <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            My FreshLinks
          </h2>
        )
        : <h5 class="text-md">No FreshLinks yet, add one to see analytics</h5>}
      <ul class="flex flex-col gap-2">
        {data.userLinks.map((link) => (
          <li key={link.id} class="flex gap-2 flex-wrap">
            <a
              href={`/analytics/${link.id}`}
              class="text-blue-500 dark:text-blue-300 underline break-all"
            >
              {link.url}
            </a>
            <div class="flex gap-1 ml-auto">
              <span class="text-sm font-light">
                added {formatTimeAgo(new Date(link.createdAt))}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
