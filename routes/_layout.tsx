import { PageProps } from "$fresh/server.ts";
import { Header } from "../components/Header.tsx";
import type { AppState } from "./_middleware.ts";

export default function RootLayout(
  { Component, state }: PageProps<null, AppState>,
) {
  return (
    <>
      <Header isDarkTheme={state.isDarkTheme} user={state.user} />
      <main>
        <div class="px-8 py-4 mx-auto container max-w-3xl flex flex-col gap-8">
          <Component />
        </div>
      </main>
    </>
  );
}
