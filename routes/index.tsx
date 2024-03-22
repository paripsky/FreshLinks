import { Handlers, PageProps } from "$fresh/server.ts";
import { createLink, getUserLinks } from "../actions/links.ts";
import type { FreshLink } from "../types/link.ts";
import { formatTimeAgo } from "../utils/date.ts";
import { CopyButton } from "../islands/CopyButton.tsx";
import { Alert } from "../islands/Alert.tsx";
import { AppState } from "./_middleware.ts";

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
  async POST(req, ctx) {
    if (!ctx.state.user) {
      throw new Error("Must be logged in");
    }

    const url = (await req.formData()).get("url");

    if (!url) throw new Error("URL is a required param");

    const linkId = await createLink({
      createdBy: ctx.state.user.id,
      url: url.toString(),
    });

    const headers = new Headers();
    headers.set("location", `/?created=${linkId}`);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function Home({ data, url, state }: PageProps<Data, AppState>) {
  const created = new URL(url).searchParams.get("created");
  return (
    <>
      <div>
        <Alert defaultOpen={!!created} urlParamToRemove="created">
          <span class="font-medium">FreshLink created successfully!</span>
          Copy it to clipboard by clicking <CopyButton value={`/${created}`} />
        </Alert>
        <div class="flex items-center">
          <h1 class="text-4xl font-bold">Welcome to Freshlinks</h1>
        </div>
      </div>
      <section>
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Create a new FreshLink
        </h2>
        <form method="POST">
          <div class="flex flex-col">
            <label
              for="url"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Enter an https:// URL:
            </label>
            <div class="flex gap-2">
              <input
                type="url"
                name="url"
                id="url"
                placeholder="https://example.com"
                pattern="https://.*"
                size={30}
                required
                class="indent-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-600 focus:border-blue-600 block flex-1 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <button
                type="submit"
                class="flex disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!state.user}
                title={!state.user
                  ? "Please login to generate a FreshLink"
                  : undefined}
              >
                <span className="relative overflow-hidden rounded-full p-[2px] h-full">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffdb1e_0%,#ffffff_50%,#ffdb1e_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]" />
                  <div className="inline-flex h-full w-full cursor-pointer justify-center items-center rounded-full bg-white px-3 py-1 text-xs font-medium leading-5 text-slate-600 backdrop-blur-xl dark:bg-black dark:text-slate-200">
                    Generate FreshLink 🍋
                  </div>
                </span>
              </button>
            </div>
          </div>
        </form>
      </section>
      <section>
        {data.userLinks.length
          ? (
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              My FreshLinks
            </h2>
          )
          : null}
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
                <CopyButton value={`/${link.id}`} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
