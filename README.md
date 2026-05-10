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

The project keeps the currently used web font files under `public/fonts`. Each font directory includes its own `LICENSE.fonts.txt`; the repository MIT license covers application code only and does not relicense font files. Review the original font terms before reuse, especially for fonts with personal-use or commercial-use constraints.

Current role map:

| Area                                           | Font chain                                                               | Notes                                                                                                                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brand mark `落文`                              | `YRDZST-Regular` -> `TsangerJinKai02` -> `LXGW WenKai`                   | `YRDZST-Regular` is subset to the two brand glyphs.                                                                                                                                          |
| Hero display, cover text, large Chinese labels | `TsangerJinKai02` -> `LXGW WenKai`                                       | The paper-like Chinese display voice.                                                                                                                                                        |
| Mixed headings                                 | `Charter` -> `TsangerJinKai02` -> `LXGW WenKai`                          | English uses Charter; Chinese glyphs fall through to the Chinese display/body fonts.                                                                                                         |
| Body copy                                      | `Charter` -> `LXGW WenKai`                                               | English keeps a book serif; Chinese long-form text uses LXGW WenKai.                                                                                                                         |
| Quotes and callouts                            | `TsangerJinKai02` -> `Charter` -> `LXGW WenKai`                          | Short Chinese pull quotes use Tsanger; English remains readable through Charter.                                                                                                             |
| Navigation, tags, buttons, small UI            | `Comic Neue` -> `LXGW WenKai`                                            | UI text stays looser and lighter than article prose.                                                                                                                                         |
| Slogan `Larger than life`                      | `Caveat`                                                                 | Used only for the handwritten slogan treatment.                                                                                                                                              |
| Japanese snippets                              | `Yu Mincho Local` -> `Hina Mincho` -> `TsangerJinKai02` -> `LXGW WenKai` | `Yu Mincho Local` is a system-only alias for Yu Mincho / YuMincho / 游明朝 names. If the visitor's device does not have Yu Mincho installed, the site falls back to the bundled Hina Mincho. |
| Code and filenames                             | `JetBrains Mono` -> `LXGW WenKai`                                        | Monospace for code; LXGW WenKai covers Chinese comments.                                                                                                                                     |
| Open Graph images                              | `TsangerJinKai02` TTF                                                    | Satori needs TTF/OTF/WOFF input, so the TTF is used during OG image generation.                                                                                                              |

Loading policy:

- Preloaded above the fold: Charter regular/medium, TsangerJinKai02 W04, LXGW WenKai 500, Comic Neue 400, Caveat 400, and the two YRDZST brand subsets.
- Loaded on demand: LXGW WenKai 700, Comic Neue 700, JetBrains Mono weights, Hina Mincho, and other non-critical faces.
- Local-first: `@font-face` uses `local()` before `url()` so installed fonts can render without downloading the bundled copy.

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
