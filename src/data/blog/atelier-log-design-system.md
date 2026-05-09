---
title: Atelier Log 的字体与界面系统
pubDatetime: 2026-05-09T09:30:00+08:00
description: 记录 Atelier Log 如何在 AstroPaper 的静态内容基础上，建立中英文混排、文章组件和视觉节奏。
featured: true
tags:
  - design
  - typography
  - astro
---

Atelier Log 的第一原则很简单：界面要让文字显得值得被读，而不是把读者推向装饰。

这个站点保留 AstroPaper 的内容集合、RSS、sitemap、搜索、归档和静态输出能力。视觉层只做必要的增量：更明确的字体角色、更稳的行距、更克制的颜色，以及适合中英文长文的页面密度。

## 字体角色

中文正文使用霞鹜文楷，英文正文使用 Lora。它们都有足够的人文气质，也能在长段落里保持耐读。Hero Display 使用 Cormorant Garamond 与霞鹜文楷，强调高对比度和轻重量；标题角色使用 Charter 与霞鹜文楷，让英文标题更接近书籍排版；UI 信息交给 Comic Neue 与霞鹜文楷，避免元信息抢走正文的注意力。

代码使用 Victor Mono。它的任务不是装饰，而是保持括号、缩进、数字和标点在技术文章里清晰可辨，同时减少默认等宽字体的机械感。

## 内容组件

文章页需要的不是更多卡片，而是更好的阅读结构。提示块、引用、代码块、表格、标签和相关文章都被当作内容的一部分处理。它们有边界，但不应该喧宾夺主。

```ts
export const principle = {
  staticFirst: true,
  reactIslands: "only where interaction earns its cost",
  typography: ["Charter", "LXGW WenKai", "Lora", "Comic Neue", "Victor Mono"],
};
```

## 设计边界

这个博客不会追求过度动效，也不会把每一屏都做成展示页。好的博客首先应该稳定、快速、可维护；美感必须建立在这些条件之上。
