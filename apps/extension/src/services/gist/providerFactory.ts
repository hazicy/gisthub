import * as vscode from 'vscode';
import { GistProviderEnum } from '@gisthub/core';
import { GistServiceManager } from './gistManager';
import { createGistService } from '@gisthub/core';

/**
 * 创建 Gist provider 并注册服务
 * @param type Provider 类型
 * @param token 访问令牌
 * @param context VSCode 扩展上下文
 */
export async function createProvider(
  type: GistProviderEnum,
  token: string,
  context: vscode.ExtensionContext,
) {
  const manager = GistServiceManager.getInstance(context);

  const proxyUrl = vscode.workspace
    .getConfiguration('gisthub')
    .get<string>('githubApiProxy', '') || undefined;

  const service = createGistService(type, token, proxyUrl);

  switch (type) {
    case GistProviderEnum.GitHub:
      manager.registerService('github', service);
      break;
    case GistProviderEnum.Gitee:
      manager.registerService('gitee', service);
      break;
  }
}