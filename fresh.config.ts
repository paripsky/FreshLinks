import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import auth from "./plugins/auth.ts";

export default defineConfig({
  plugins: [tailwind(), auth],
});
