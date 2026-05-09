# 流云栖木

流云栖木 is Winston's editorial blog for design, code, systems, and slower judgment. It is built as a careful increment on top of [AstroPaper](https://github.com/satnaing/astro-paper), preserving the template's static publishing strengths while adding a Kami-inspired paper visual system, bilingual typography, and production-ready project hygiene.

Live site: <https://blog.whynotsleep.cc/>

## Stack

- Astro 6 for content collections, static rendering, RSS, sitemap, and dynamic OG images.
- Tailwind CSS 4 for design tokens and responsive styling.
- React 19 for small interactive islands only.
- shadcn/ui conventions for reusable UI primitives.
- Pagefind for static search.
- Shiki for code highlighting.
- A constrained local font system: LXGW WenKai, TsangerJinKai02, Charter, Comic Neue, JetBrains Mono, and the single-use Caveat slogan font are served from `public/fonts`; YuMincho is reserved for Japanese snippets with allowed fallbacks.

## Local Development

Requirements:

- Node.js 24
- pnpm 11.0.8

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Build the production site:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Scripts

| Command             | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `pnpm dev`          | Start Astro locally at `http://localhost:4321`   |
| `pnpm build`        | Type-check, build static pages, and index search |
| `pnpm preview`      | Preview the generated `dist` output              |
| `pnpm lint`         | Run ESLint                                       |
| `pnpm format:check` | Check Prettier formatting                        |
| `pnpm format`       | Format source files                              |
| `pnpm clean`        | Remove generated build artifacts                 |

## Content Workflow

Blog posts live in `src/data/blog/*.md`. Each post uses Astro Content Collections frontmatter:

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

Draft posts can be hidden with `draft: true`. The production build excludes drafts and future-dated posts according to the AstroPaper content utilities preserved in this project.

## Project Structure

```text
src/
  assets/          SVG icons and local visual assets
  components/      Astro and React UI components
  data/blog/       Markdown posts
  layouts/         Page and post layouts
  pages/           Astro routes
  styles/          Global theme and typography system
  utils/           Content, SEO, date, and Markdown helpers
public/            Static public assets
.github/workflows/ CI and GitHub Pages deployment
```

## Deployment

The repository is configured for GitHub Pages. Pushing to `main` runs `.github/workflows/deploy.yml`, which installs dependencies, runs linting, checks formatting, builds the site, uploads `dist`, and deploys through GitHub Pages.

This project is intended to be deployed as a GitHub Pages site with its own
custom subdomain:

```text
iwannabewater/blog -> blog.whynotsleep.cc
```

The deployed URL is:

```text
https://blog.whynotsleep.cc/
```

The `public/CNAME` file is included in the Pages artifact so GitHub Pages binds
the repository to `blog.whynotsleep.cc`. If the GitHub account or custom domain
changes, update `SITE.website` in `src/config.ts`, `public/CNAME`, and the
repository homepage as well.

## Public Repository Policy

Committed:

- Application source under `src`
- Public assets under `public`
- Package manifests and lockfile
- Lint, formatting, TypeScript, Astro, and shadcn configuration
- GitHub Actions workflows
- README and license

Not committed:

- `node_modules`
- `dist`
- `.astro`
- Pagefind generated files
- Environment files
- Editor-local settings
- Temporary specs, scratch notes, and private agent files

## Attribution

This project is derived from [AstroPaper](https://github.com/satnaing/astro-paper), originally created by Sat Naing and released under the MIT License. The current design, content system customizations, and site configuration are maintained by Winston.

Font files keep their own licenses and are not relicensed by this repository.
Each font family under `public/fonts/*/` includes its own `LICENSE.fonts.txt`.

## License

MIT. See [LICENSE](LICENSE).
