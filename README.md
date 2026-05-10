# 落文 (luò wén)

Winston's bilingual editorial blog for design, code, systems, and slower judgment.

Live site: <https://blog.whynotsleep.cc/>

## Stack

- Astro 6 for content collections, static routes, RSS, sitemap, and dynamic Open Graph images.
- Tailwind CSS 4 for tokens, layout, and responsive styling.
- React 19 for small interactive islands.
- shadcn/ui conventions for component organization.
- Pagefind for static search.
- Shiki for code highlighting.
- GitHub Pages for production hosting.

## Font System

The project keeps web fonts under `public/fonts` when redistribution is clear. Each font directory includes its own `LICENSE.fonts.txt`. The repository MIT license covers the application code only; font files keep their original terms.

Current font roles:

- `YRDZST-Regular`: the two-glyph brand title, `落文`.
- `TsangerJinKai02`: Chinese display headings, cover text, quotes, and visual captions.
- `LXGW WenKai`: Chinese body text and Chinese fallback.
- `Charter`: English body text, English headings, and mixed-language headings.
- `Comic Neue`: navigation, tags, buttons, and small UI text.
- `Caveat`: the single `Larger than life` slogan treatment.
- `Hina Mincho`: local Japanese Mincho snippets.
- `JetBrains Mono`: code blocks and file names.

`Yu Mincho` / `YuMincho` is not vendored. Platform font catalogs list it as a JIYUKOBO font and point to redistribution licensing rather than a public source package. If a redistributable YuMincho source is provided later, it should be added under `public/fonts/yumincho/` with its license, then swapped into the `--font-japanese` token.

## Development

Requirements:

- Node.js 24
- pnpm 11.0.8

```bash
pnpm install
pnpm dev
```

Useful commands:

| Command             | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `pnpm dev`          | Start Astro at `http://localhost:4321`           |
| `pnpm build`        | Type-check, build static pages, and index search |
| `pnpm preview`      | Preview the generated `dist` output              |
| `pnpm lint`         | Run ESLint                                       |
| `pnpm format:check` | Check Prettier formatting                        |
| `pnpm format`       | Format source files                              |
| `pnpm clean`        | Remove generated build artifacts                 |

## Content

Posts live in `src/data/blog/*.md` and use Astro Content Collections.

```yaml
---
title: "Post title"
pubDatetime: 2026-05-09T10:00:00+08:00
description: "Short summary for SEO, feeds, and cards."
featured: true
tags:
  - design
  - engineering
---
```

Set `draft: true` to hide a post. Production builds exclude drafts and posts scheduled for future publication.

## Project Layout

```text
src/
  assets/          SVG icons and local visual assets
  components/      Astro and React UI components
  data/blog/       Markdown posts
  layouts/         Page and post layouts
  pages/           Astro routes
  styles/          Global theme and typography
  utils/           Content, SEO, date, and Markdown helpers
public/
  fonts/           Local font files and font licenses
  CNAME            GitHub Pages custom domain
.github/workflows/ CI and GitHub Pages deployment
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`. The workflow installs dependencies, runs lint, checks formatting, builds the site, uploads `dist`, and deploys to GitHub Pages.

The production domain is controlled by:

- `SITE.website` in `src/config.ts`
- `public/CNAME`

Current domain: <https://blog.whynotsleep.cc/>

## Credits

This project started from [AstroPaper](https://github.com/satnaing/astro-paper), created by Sat Naing under the MIT License. Winston maintains the current visual system, font system, content structure, and deployment setup.

## License

MIT for application code. See [LICENSE](LICENSE). Font files are licensed separately in `public/fonts/*/LICENSE.fonts.txt`.
