import { defineConfig, envField, fontProviders } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";

const kamiCodeTheme = {
  light: {
    name: "kami-light",
    type: "light" as const,
    colors: {
      "editor.background": "#faf9f5",
      "editor.foreground": "#141413",
    },
    settings: [{ settings: { foreground: "#141413" } }],
  },
  dark: {
    name: "kami-dark",
    type: "dark" as const,
    colors: {
      "editor.background": "#30302e",
      "editor.foreground": "#f5f4ed",
    },
    settings: [{ settings: { foreground: "#f5f4ed" } }],
  },
};

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    react(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      themes: { light: kamiCodeTheme.light, dark: kamiCodeTheme.dark },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  fonts: [
    {
      name: "LXGW WenKai",
      cssVariable: "--font-lxgw-wenkai",
      provider: fontProviders.fontsource(),
      fallbacks: [],
      weights: [300, 400, 700],
      styles: ["normal"],
    },
    {
      name: "Comic Neue",
      cssVariable: "--font-comic-neue",
      provider: fontProviders.google(),
      fallbacks: [],
      weights: [400, 700],
      styles: ["normal"],
    },
  ],
});
