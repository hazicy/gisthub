# GistHub Web

基于 Next.js 的 Web Dashboard，用于管理 GitHub Gist。

## 功能

- **多提供商支持**: 管理 GitHub 账户
- **Gist 浏览**: 查看所有 Gist 和星标 Gist
- **在线编辑**: 内置 Markdown 编辑器，支持语法高亮
- **文件管理**: 创建、编辑、删除 Gist 和文件
- **响应式设计**: 支持桌面端和移动端访问

## 安装

```bash
# 开发模式
pnpm dev:web

# 生产构建
pnpm build:web
pnpm start
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev:web
```

访问 http://localhost:3000

## 技术栈

- **框架**: Next.js 16
- **UI 库**: HeroUI (React 19)
- **编辑器**: ProseMirror (富文本编辑器)
- **状态管理**: Zustand
- **样式**: Tailwind CSS 4

## 页面结构

| 路径 | 描述 |
|------|------|
| `/` | 首页 - 快速入口 |
| `/gists` | Gist 列表页 |
| `/gist/[id]` | Gist 详情/编辑页 |
| `/providers` | 提供商管理页 |

## 与核心库集成

Web Dashboard 使用 `@gisthub/core` 作为核心库，实现与 VS Code 插件相同的功能。

```typescript
import { GistProviderFactory, GistProviderEnum } from '@gisthub/core';
```

## License

MIT License - 详见 [根目录 LICENSE](../../LICENSE)