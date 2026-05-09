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

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  base: "/blog",
  integrations: [
    react(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
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
      fallbacks: ["serif"],
      weights: [300, 500, 700],
      styles: ["normal"],
    },
    {
      name: "Cormorant Garamond",
      cssVariable: "--font-cormorant-garamond",
      provider: fontProviders.google(),
      fallbacks: ["serif"],
      weights: [300, 400, 600],
      styles: ["normal", "italic"],
    },
    {
      name: "Lora",
      cssVariable: "--font-lora",
      provider: fontProviders.google(),
      fallbacks: ["serif"],
      weights: [400, 600],
      styles: ["normal", "italic"],
    },
    {
      name: "Ma Shan Zheng",
      cssVariable: "--font-ma-shan-zheng",
      provider: fontProviders.google(),
      fallbacks: ["cursive"],
      weights: [400],
      styles: ["normal"],
    },
    {
      name: "Caveat",
      cssVariable: "--font-caveat",
      provider: fontProviders.google(),
      fallbacks: ["cursive"],
      weights: [400, 700],
      styles: ["normal"],
    },
    {
      name: "Fraunces",
      cssVariable: "--font-fraunces",
      provider: fontProviders.google(),
      fallbacks: ["serif"],
      weights: [300, 400, 600],
      styles: ["normal"],
    },
    {
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
    },
    {
      name: "Noto Sans SC",
      cssVariable: "--font-noto-sans-sc",
      provider: fontProviders.google(),
      fallbacks: ["sans-serif"],
      weights: [400, 500, 600, 700],
      styles: ["normal"],
    },
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.google(),
      fallbacks: ["sans-serif"],
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
    },
  ],
});
