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
        <title>FreshLinks</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="dark:bg-gray-900">
        <Component />
      </body>
    </html>
  );
}
