import { type PageProps } from "$fresh/server.ts";

export default function App(
  { Component, state }: PageProps<null, { isDarkTheme: boolean }>,
) {
  return (
    <html
      class={state.isDarkTheme ? "dark" : ""}
      style={{ colorScheme: state.isDarkTheme ? "dark" : "light" }}
    >
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta
          name="description"
          content="FreshLinks - Short link generator with analytics"
        />
        <meta
          name="keywords"
          content="FreshLinks, short link, URL shortener, analytics, Fresh, Deno"
        />
        <meta name="author" content="paripsky" />
        <meta property="og:title" content="FreshLinks - Short Link Generator" />
        <meta
          property="og:description"
          content="Generate short links with analytics using FreshLinks. Built with Fresh and Deno."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://freshlinks.deno.dev" />
        <meta
          property="og:image"
          content="https://freshlinks.deno.dev/logo.png"
        />
        <meta property="og:image:alt" content="FreshLinks Logo" />
        <meta property="og:site_name" content="FreshLinks" />
        <title>FreshLinks</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="dark:bg-gray-900">
        <Component />
      </body>
    </html>
  );
}
