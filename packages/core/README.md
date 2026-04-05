# @gisthub/core

GistHub 核心库，提供 Gist 服务的统一接口和实现。

## 安装

```bash
pnpm add @gisthub/core
```

## 概述

`@gisthub/core` 是 GistHub 项目的核心库，定义了 Gist 操作的通用接口，并提供了 GitHub 和 Gitee 提供商的具体实现。

## 功能

- **统一接口**: 定义 `GistProvider` 接口，统一不同提供商的操作
- **多提供商支持**: 内置 GitHub 和 Gitee 支持
- **类型安全**: 完整的 TypeScript 类型定义
- **文件大小验证**: 支持不同提供商的文件大小限制验证

## 使用

### 基本用法

```typescript
import { GistProviderFactory, GistProviderEnum } from '@gisthub/core';

// 创建 GitHub 提供商实例
const githubProvider = GistProviderFactory.create(GistProviderEnum.GitHub, {
  token: 'your-github-token',
});

// 获取所有 Gist
const gists = await githubProvider.getGists();

// 创建新的 Gist
const newGist = await githubProvider.createGist({
  description: 'My new gist',
  files: {
    'hello.txt': { content: 'Hello World' },
  },
  public: false,
});
```

### GistProvider 接口

核心库定义了 `GistProvider` 接口，涵盖所有 Gist 操作：

| 方法 | 描述 |
|------|------|
| `getGists()` | 获取用户所有 Gist |
| `getStarredGists()` | 获取星标的 Gist |
| `getGist(id)` | 获取单个 Gist 详情 |
| `createGist(params)` | 创建新 Gist |
| `updateGist(id, params)` | 更新 Gist |
| `deleteGist(id)` | 删除 Gist |
| `getGistContent(id, filename)` | 获取文件内容 |
| `updateGistContent(id, filename, content)` | 更新文件内容 |
| `deleteGistFile(id, filename)` | 删除文件 |

### 类型

库中定义了完整的 TypeScript 类型：

- `Gist`: Gist 数据结构
- `GistFile`: Gist 文件结构
- `CreateGistParams`: 创建参数
- `UpdateGistParams`: 更新参数
- `GistProviderEnum`: 提供商枚举

## API 参考

详细 API 文档请查看 [类型定义](./src/types/gist.ts)。