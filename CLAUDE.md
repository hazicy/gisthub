# GistHub 项目指南

## 项目概述

GistHub 是一个统一的 Gist 管理解决方案，同时提供 VS Code 插件和 Web Dashboard，支持 GitHub 平台。

## 项目结构

```
gisthub/
├── packages/
│   ├── core/          # 核心库 - Gist 操作的通用接口和实现
│   ├── extension/     # VS Code 插件
│   └── web/           # Next.js Web Dashboard
```

## 技术栈

- **@gisthub/core**: TypeScript, Axios, Octokit
- **VS Code 插件**: TypeScript, Octokit, VS Code API
- **Web Dashboard**: Next.js 16, React 19, HeroUI, Tailwind CSS 4

## 常用命令

```bash
# 开发 Web Dashboard
pnpm dev:web

# 开发 VS Code 插件
pnpm --filter gisthub-extension watch

# 构建项目
pnpm build

# 构建 Web
pnpm build:web

# 构建 Extension
pnpm build:extension
```

## 关键文件

- `packages/core/src/index.ts` - 核心库入口
- `packages/core/src/services/factory.ts` - Provider 工厂
- `packages/extension/src/extension.ts` - VS Code 插件入口
- `packages/web/app/page.tsx` - Web Dashboard 首页

## 注意事项

- 这是一个 pnpm monorepo 项目
- Web Dashboard 使用 HeroUI 组件库（配置在 `packages/web` 中）
- 已有 CLAUDE.md 在 `packages/web/CLAUDE.md`，可根据需要参考
