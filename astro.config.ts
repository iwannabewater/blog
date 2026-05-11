import { defineConfig, envField } from "astro/config";
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
    settings: [
      { settings: { foreground: "#141413" } },
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: "#8a8375" },
      },
      {
        scope: ["keyword", "storage", "constant.language"],
        settings: { foreground: "#1B365D" },
      },
      {
        scope: ["string", "string.quoted", "markup.inline.raw"],
        settings: { foreground: "#98553F" },
      },
      {
        scope: [
          "entity.name.function",
          "support.function",
          "variable.function",
        ],
        settings: { foreground: "#2D5A8A" },
      },
      {
        scope: ["constant.numeric", "constant.character", "support.constant"],
        settings: { foreground: "#6B5A3D" },
      },
      {
        scope: ["entity.name.type", "support.type", "meta.type"],
        settings: { foreground: "#504E49" },
      },
      {
        scope: ["punctuation", "meta.brace"],
        settings: { foreground: "#6B6A64" },
      },
    ],
  },
  dark: {
    name: "kami-dark",
    type: "dark" as const,
    colors: {
      "editor.background": "#22211d",
      "editor.foreground": "#f4efe2",
    },
    settings: [
      { settings: { foreground: "#f4efe2" } },
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: "#8f887b" },
      },
      {
        scope: ["keyword", "storage", "constant.language"],
        settings: { foreground: "#9AB3CF" },
      },
      {
        scope: ["string", "string.quoted", "markup.inline.raw"],
        settings: { foreground: "#C28769" },
      },
      {
        scope: [
          "entity.name.function",
          "support.function",
          "variable.function",
        ],
        settings: { foreground: "#C0D0DF" },
      },
      {
        scope: ["constant.numeric", "constant.character", "support.constant"],
        settings: { foreground: "#C7BFAE" },
      },
      {
        scope: ["entity.name.type", "support.type", "meta.type"],
        settings: { foreground: "#D8D0C0" },
      },
      {
        scope: ["punctuation", "meta.brace"],
        settings: { foreground: "#B1AA9B" },
      },
    ],
  },
};

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    react(),
    sitemap({
      filter: page => {
        const pathname = new URL(page).pathname.replace(/\/+$/, "") || "/";
        return (
          pathname !== "/analytics" &&
          (SITE.showArchives || pathname !== "/archives")
        );
      },
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
      PUBLIC_ANALYTICS_ENDPOINT: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
});
