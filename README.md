# Luowen

Luowen (`落文`, `luò wén`) is Winston's bilingual editorial blog for design, code, systems thinking, and slower judgment. The site is built as a static-first Astro application with a custom paper-inspired design system, local font pipeline, Pagefind search, RSS, sitemap generation, and dynamic Open Graph images.

Production site: <https://blog.whynotsleep.cc/>

## Status

This repository is maintained as a small but production-grade publishing system:

- Static output is the default runtime model. GitHub Pages serves generated files from `dist`.
- React is limited to interaction islands that need client-side behavior.
- Local fonts are versioned with explicit license files. Browser preload is kept to the visible first-screen font set.
- CI verifies lint, formatting, type checks, static build, and Pagefind indexing before deployment.

## Architecture

```text
src/
  components/      Astro components, React islands, and shadcn/ui primitives
  data/blog/       Markdown entries managed by Astro Content Collections
  layouts/         Shared document shells for index, about, and post detail pages
  pages/           File-system routes, RSS, robots, search, and dynamic OG endpoints
  styles/          Tailwind 4 theme tokens, global surfaces, and prose typography
  utils/           Post filtering, paths, reading time, fonts, SEO, and OG generation
public/
  fonts/           Redistributable font files and per-family license notices
  CNAME            GitHub Pages custom domain
```

The project started from [AstroPaper](https://github.com/satnaing/astro-paper) and keeps its static publishing strengths. Luowen's current system replaces the generic theme layer with a custom editorial identity, bounded typography roles, locally served fonts, dynamic OG generation, and a stricter deployment contract.

## Design System

Luowen uses a warm paper canvas, ink-blue emphasis, and low-contrast warm surfaces. The design goal is not to decorate the content. The goal is to make long-form reading, scanning, and maintenance feel deliberate.

Typeface roles are intentionally narrow:

| Role    | Font stack                      | Usage                                               |
| ------- | ------------------------------- | --------------------------------------------------- |
| Brand   | `YRDZST-Regular`, `LXGW WenKai` | The two-character `落文` wordmark only              |
| Display | `LXGW WenKai`                   | Chinese hero lines and short editorial display text |
| Heading | `Charter`, `LXGW WenKai`        | English and mixed-script headings                   |
| Body    | `Charter`, `LXGW WenKai`        | Long-form prose                                     |
| UI      | `Comic Neue`, `LXGW WenKai`     | Navigation, buttons, tags, and small controls       |
| Slogan  | `Caveat`                        | The single handwritten English slogan               |
| Code    | `JetBrains Mono`, `LXGW WenKai` | Code blocks, filenames, and inline code             |

Font policy:

- Application source is MIT licensed.
- Font files are governed by their own license files under `public/fonts/*/LICENSE.fonts.txt`.
- The browser preload set is limited to first-screen fonts: Charter, LXGW WenKai, Comic Neue, Caveat, and the Luowen wordmark subset.
- Dynamic OG generation reads local OTF builds because Satori/Resvg does not consume the browser WOFF2 pipeline.

## Content Model

Posts live in `src/data/blog/*.md` and use Astro Content Collections.

```yaml
---
title: "Post title"
pubDatetime: 2026-05-09T10:00:00+08:00
description: "Short summary for SEO, feeds, cards, and search."
featured: true
tags:
  - design
  - engineering
---
```

Supported fields:

- `draft: true` excludes the post from production lists.
- `modDatetime` controls the updated date when present.
- `timezone` overrides the global display timezone for a post.
- `ogImage` may point to a remote URL or local asset. When omitted, the dynamic OG endpoint generates the image.
- `canonicalURL` is available for syndicated or migrated essays.

Production filtering excludes drafts and future posts beyond `SITE.scheduledPostMargin` in `src/config.ts`.

## Development

Required runtime:

- Node.js 24
- pnpm 11.0.8

```bash
pnpm install
pnpm dev
```

Core commands:

```bash
pnpm lint          # ESLint across Astro, TypeScript, and React files
pnpm format:check  # Prettier verification
pnpm build         # Astro check, static build, Pagefind index, public search assets
pnpm preview       # Preview the generated site locally
pnpm clean         # Remove generated build artifacts
```

`pnpm build` intentionally refreshes `public/pagefind` from the generated `dist/pagefind` output so GitHub Pages can serve search assets consistently.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`.

The deploy workflow:

1. Checks out the repository.
2. Installs pnpm 11.0.8 and Node.js 24.
3. Installs dependencies with the lockfile.
4. Runs lint, format verification, and the production build.
5. Uploads `dist` as the GitHub Pages artifact.
6. Deploys to the configured Pages environment.

The production domain is controlled by both `SITE.website` in `src/config.ts` and `public/CNAME`.

## Verification Contract

Run the same checks locally before shipping:

```bash
pnpm lint
pnpm format:check
pnpm build
```

For UI changes, also inspect:

- Home page at desktop and 375px mobile width.
- A post detail page with code, tags, share links, and previous/next links.
- Search page after a production build.
- Light, dark, and system theme modes.
- Reduced-motion behavior for page and scroll reveal effects.

## Repository Metadata

Recommended GitHub About description:

```text
Luowen (luò wén), Winston's static-first editorial blog for design, code, systems thinking, and slower judgment.
```

Recommended topics:

```text
astro, tailwindcss, static-site, editorial, blog, typography, pagefind
```

## License

Application code is distributed under the MIT License. Font files are not covered by the application license; read the license notice in each `public/fonts/*` directory before redistributing them.
