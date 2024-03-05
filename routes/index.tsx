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
      <section class="bg-white dark:bg-gray-900">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Create a new FreshLink
        </h2>
        <form method="POST">
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div class="sm:col-span-2">
              <label
                for="url"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Enter an https:// URL:
              </label>
              <input
                type="url"
                name="url"
                id="url"
                placeholder="https://example.com"
                pattern="https://.*"
                size={30}
                required
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!state.user}
            title={!state.user
              ? "Please login to generate a FreshLink"
              : undefined}
          >
            Generate FreshLink
          </button>
        </form>
      </section>
      <section class="bg-white dark:bg-gray-900">
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
