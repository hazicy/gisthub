import * as vscode from 'vscode';
// 导入 core 包中的通用类型
import type {
  GistProvider,
  Gist,
  CreateGistParams,
  UpdateGistParams,
  ProviderConfig,
} from '@gisthub/core';
import { GistProviderEnum } from '@gisthub/core';

/**
 * 星标 Gist 树形项数据类型
 */
export type StarGistTreeItem = {
  gist?: Gist;
} & vscode.TreeItem;

// 重新导出 core 中的类型
export type { GistProvider, Gist, CreateGistParams, UpdateGistParams, ProviderConfig };
export { GistProviderEnum };