import * as vscode from 'vscode';
import type { GistProvider, Gist, CreateGistParams, UpdateGistParams, ProviderConfig } from '@gisthub/core';
import { GistProviderEnum } from '@gisthub/core';
/**
 * 星标 Gist 树形项数据类型
 */
export type StarGistTreeItem = {
    gist?: Gist;
} & vscode.TreeItem;
export type { GistProvider, Gist, CreateGistParams, UpdateGistParams, ProviderConfig };
export { GistProviderEnum };
//# sourceMappingURL=types.d.ts.map