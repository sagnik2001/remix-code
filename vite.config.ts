// vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "@svgr/rollup";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    svgr(
      {
        svgo: true,
        // correct plugin format:
        svgoConfig: {
          plugins: [
            { name: "removeViewBox", active: false },
          ],
        },
      }
    ),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
});
