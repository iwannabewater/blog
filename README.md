# 落文（luò wén）

Winston 的双语个人博客，写设计、代码、系统与慢一点的判断。

Live site: <https://blog.whynotsleep.cc/>

## 技术栈

- Astro 6：内容集合、静态页面、RSS、sitemap、动态 OG 图。
- Tailwind CSS 4：设计 token、响应式布局和主题样式。
- React 19：只用于小型交互岛。
- shadcn/ui：保留组件组织约定。
- Pagefind：静态搜索索引。
- Shiki：代码高亮。
- GitHub Pages：生产部署。

## 字体策略

本项目优先使用本地字体文件，所有入库字体都放在 `public/fonts`，并保留对应许可证。

已入库字体：

- `YRDZST-Regular`：品牌字“落文”。
- `TsangerJinKai02`：中文标题、题签、引用和视觉短句。
- `LXGW WenKai`：中文正文和中文 fallback。
- `Charter`：英文正文、英文标题和混排标题。
- `Comic Neue`：导航、按钮、标签等 UI 小字。
- `Caveat`：仅用于 `Larger than life`。
- `JetBrains Mono`：代码和文件名。

`YuMincho` 没有放进 `public/fonts`。它只作为系统优先字体出现在 `--font-japanese` 中，用于日文短句；缺字时回到 `TsangerJinKai02` 和 `LXGW WenKai`。这样做是为了保持授权边界干净：系统字体可以被 CSS 引用，但不代表可以把字体文件提交到公开仓库再分发。字体仍然在 token 层统一管理；如果以后要完全本地化日文字体，应换成可再分发的开源字体，并把字体文件和许可证一起入库。

## 本地开发

要求：

- Node.js 24
- pnpm 11.0.8

```bash
pnpm install
pnpm dev
```

常用命令：

| Command             | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `pnpm dev`          | Start Astro locally at `http://localhost:4321`   |
| `pnpm build`        | Type-check, build static pages, and index search |
| `pnpm preview`      | Preview the generated `dist` output              |
| `pnpm lint`         | Run ESLint                                       |
| `pnpm format:check` | Check Prettier formatting                        |
| `pnpm format`       | Format source files                              |
| `pnpm clean`        | Remove generated build artifacts                 |

## 内容

文章位于 `src/data/blog/*.md`，使用 Astro Content Collections。

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

`draft: true` 会隐藏草稿。生产构建会排除草稿和超出发布时间窗口的文章。

## 目录

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
  fonts/           Local font files and licenses
  CNAME            GitHub Pages custom domain
.github/workflows/ CI and GitHub Pages deployment
```

## 部署

`main` 分支推送后会触发 `.github/workflows/deploy.yml`。流程会安装依赖、运行 lint、检查格式、构建站点、上传 `dist`，并部署到 GitHub Pages。

生产域名由两处共同维护：

- `SITE.website` in `src/config.ts`
- `public/CNAME`

当前域名是 `https://blog.whynotsleep.cc/`。

## 归因

项目基于 [AstroPaper](https://github.com/satnaing/astro-paper) 改造。AstroPaper 由 Sat Naing 创建，使用 MIT License。当前站点的视觉系统、字体系统、内容结构和部署配置由 Winston 维护。

字体文件保留各自许可证，不随本仓库重新授权。

## License

MIT. See [LICENSE](LICENSE).
