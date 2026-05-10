---
layout: ../layouts/AboutLayout.astro
title: "关于"
---

落文（luò wén）是 Winston 的个人研究型博客，写设计、代码、系统与长期判断。它从 [AstroPaper](https://github.com/satnaing/astro-paper) 出发，保留静态生成、SEO、RSS、搜索、归档和动态 Open Graph 图片，再把视觉系统收束成一套可维护的纸面语言。

这里不追求把博客做成展示页。更重要的是让每一层都说得清楚：字体有角色，颜色有边界，组件有职责，文章页面适合长时间阅读。半卷纸痕，几行代码；桨声入夜，灯影成篇。

## 原则

- 文字优先，视觉服务阅读。
- Astro 负责内容模型与静态输出，React 只用于值得交互的小岛。
- Tailwind CSS 与 shadcn/ui 提供一致的设计令牌和组件基础。
- 中文、英文、代码、旁注和品牌字各自使用明确的字体角色，不依赖系统默认字体作为主要呈现。
- 构建结果必须能被复现、检查和长期维护，视觉改动不能绕开 lint、format 和 build。

## 技术栈

Astro 6, Tailwind CSS 4, React 19, shadcn/ui, Pagefind, Shiki, RSS, sitemap, dynamic OG images.

## 维护方向

落文会继续沿着三个方向迭代：更好的文章结构，更清晰的内容索引，更稳定的发布链路。任何新组件都需要先回答一个问题：它是否让读者更快进入内容，或者让作者更稳定地维护内容。
