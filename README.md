# 落文

落文是 Winston 的个人博客，写设计、代码、系统和慢一点的判断。站点基于 Astro 静态生成，保留 RSS、站内搜索、归档、标签和动态 Open Graph 图片，部署在 GitHub Pages。

线上地址：<https://blog.whynotsleep.cc/>

## 字体策略

项目只分发有明确再分发依据的字体文件。应用代码使用 MIT License，字体文件按各自目录下的 `LICENSE.fonts.txt` 单独授权。

保留字体：

- 中文：`LXGW WenKai`，用于正文、标题、引用和中文展示字。
- 品牌：`YRDZST-Regular`，只用于左上角“落文”两个字的子集字形。
- 英文：`Charter` 用于正文和标题，`Comic Neue` 用于导航、标签、按钮等界面小字，`Caveat` 只用于手写标语。
- 代码：`JetBrains Mono`，中文注释回落到 `LXGW WenKai`。

加载原则很简单：首屏只预加载可见字体，其他权重按需加载；所有 `@font-face` 都优先命中本机字体，再回落到仓库内的 WOFF2 文件。OG 图片生成器不解析 WOFF2，所以 `LXGW WenKai` 和 `Charter` 额外保留 OTF 构建副本，只在构建阶段读取，不会被浏览器预加载。

## 开发

要求：

- Node.js 24
- pnpm 11.0.8

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm build        # 类型检查、构建站点、生成 Pagefind 索引
pnpm lint         # ESLint
pnpm format:check # Prettier 检查
pnpm preview      # 预览 dist
pnpm clean        # 清理构建产物
```

## 内容

文章放在 `src/data/blog/*.md`，使用 Astro Content Collections。

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

加上 `draft: true` 可以隐藏文章。生产构建会排除草稿和未来发布时间超过容忍窗口的文章。

## 结构

```text
src/
  components/      Astro 和 React 组件
  data/blog/       Markdown 文章
  layouts/         页面与文章布局
  pages/           Astro 路由
  styles/          全局主题与排版
  utils/           内容、SEO、日期和 OG 图片工具
public/
  fonts/           字体文件与字体授权说明
  CNAME            GitHub Pages 自定义域名
```

## 部署

推送到 `main` 会触发 `.github/workflows/deploy.yml`。流程会安装依赖、检查格式、运行 lint、构建站点、上传 `dist` 并部署到 GitHub Pages。

生产域名由两处共同决定：

- `SITE.website` in `src/config.ts`
- `public/CNAME`

## 来源与授权

项目从 [AstroPaper](https://github.com/satnaing/astro-paper) 起步，当前的视觉系统、字体策略、内容结构和部署流程由 Winston 维护。

应用代码使用 MIT License。字体文件不随应用代码授权走，具体见 `public/fonts/*/LICENSE.fonts.txt`。
