import * as vscode from 'vscode';
import { GistProviderEnum } from '@gisthub/core';
/**
 * 创建 Gist provider 并注册服务
 * @param type Provider 类型
 * @param token 访问令牌
 * @param context VSCode 扩展上下文
 */
export declare function createProvider(type: GistProviderEnum, token: string, context: vscode.ExtensionContext): Promise<void>;
//# sourceMappingURL=providerFactory.d.ts.map