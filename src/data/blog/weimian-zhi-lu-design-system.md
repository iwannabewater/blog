---
title: 未眠纸录的纸面系统
pubDatetime: 2026-05-09T09:30:00+08:00
description: 记录未眠纸录如何在 AstroPaper 的静态内容基础上，建立 Kami 式纸面、字体分工和视觉节奏。
featured: true
tags:
  - design
  - typography
  - astro
---

未眠纸录的第一原则很简单：界面要像一张好纸，让文字显得值得被读，而不是把读者推向装饰。

这个站点保留 AstroPaper 的内容集合、RSS、sitemap、搜索、归档和静态输出能力。视觉层参考 Kami 的纸面系统：暖纸底、墨蓝线、温灰层级、轻边框和少量题签。

## 字体角色

中文正文使用霞鹜文楷，中文题签、封面和引用使用仓耳金楷。英文正文与标题优先使用 Charter，导航、标签、按钮和代码区交给 Comic Neue。日文短句优先使用 YuMincho，缺字时也只回到已允许的中文字体。

这套分工不追求字体数量，而是让每种字体有边界：金楷负责气韵，文楷负责耐读，Charter 负责英文书页感，Comic Neue 负责轻一点的界面语气。

## 内容组件

文章页需要的不是更多卡片，而是更好的阅读结构。提示块、引用、代码块、表格、标签和相关文章都被当作内容的一部分处理。它们有边界，但不应该喧宾夺主。

```ts
export const principle = {
  staticFirst: true,
  reactIslands: "only where interaction earns its cost",
  typography: [
    "LXGW WenKai",
    "TsangerJinKai02",
    "Charter",
    "Comic Neue",
    "YuMincho",
  ],
};
```

## 设计边界

这个博客不会追求过度动效，也不会把每一屏都做成展示页。好的博客首先应该稳定、快速、可维护；美感必须建立在这些条件之上。
