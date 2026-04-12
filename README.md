# GistHub

<div align="center">

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-blue?style=flat-square&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=Hazi.gisthub)
[![Web Dashboard](https://img.shields.io/badge/Web-Dashboard-green?style=flat-square&logo=next.js)](https://gisthub.dev)
[![License](https://img.shields.io/github/license/hazicy/gisthub?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/github/v/release/hazicy/gisthub?style=flat-square)](https://github.com/hazicy/gisthub/releases)

一个统一的 Gist 管理解决方案，同时提供 VS Code 插件和 Web Dashboard，支持 GitHub。

</div>

## 特性

- **多平台支持**: 支持 GitHub Gist 服务商
- **VS Code 插件**: 在 VS Code 中直接管理你的 Gist
- **Web Dashboard**: 基于 Next.js 的 Web 管理界面
- **虚拟文件系统**: 通过 VS Code 虚拟文件系统直接编辑 Gist
- **双向同步**: 支持创建、编辑、删除 Gist 和文件

## 快速开始

### 前置要求

- Node.js >= 18
- pnpm >= 8
- VS Code >= 1.110.0 (用于使用插件)

### 安装

```bash
# 克隆项目
git clone https://github.com/hazicy/gisthub.git
cd gisthub

# 安装依赖
pnpm install

# 构建项目
pnpm build
```

### 开发

```bash
# 开发 Web Dashboard
pnpm dev:web

# 开发 VS Code 插件
pnpm --filter gisthub-extension watch
```

## 项目结构

```
gisthub/
├── packages/
│   ├── core/          # 核心库 - Gist 操作的通用接口和实现
│   ├── extension/     # VS Code 插件
│   └── web/           # Next.js Web Dashboard
├── README.md
└── package.json
```

## 子包说明

### @gisthub/core

核心库，提供 Gist 服务的统一接口，支持 GitHub 提供商。

详细文档: [packages/core/README.md](packages/core/README.md)

### gisthub (VS Code 插件)

VS Code 扩展，提供 Gist 管理的图形界面，支持虚拟文件系统。

详细文档: [packages/extension/README.md](packages/extension/README.md)

### gisthub-web

基于 Next.js 的 Web Dashboard，提供可视化的 Gist 管理界面。

详细文档: [packages/web/README.md](packages/web/README.md)

## 使用

### VS Code 插件

1. 在 VS Code 中打开项目目录
2. 按 `F5` 启动调试模式
3. 或者将 `packages/extension` 目录打包安装

### Web Dashboard

```bash
pnpm dev:web
```

然后访问 http://localhost:3000

## 技术栈

- **VS Code 插件**: TypeScript, Octokit, VS Code API
- **Web Dashboard**: Next.js 16, React 19, HeroUI, ProseMirror
- **核心库**: TypeScript, Axios, Octokit

## License

MIT License - 详见 [LICENSE](LICENSE)