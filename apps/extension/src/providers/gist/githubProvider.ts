import { GitHubProvider as CoreGitHubProvider } from '@gisthub/core';
import * as vscode from 'vscode';

function getGitHubApiProxy(): string | null {
  const customUrl = vscode.workspace
    .getConfiguration('gisthub')
    .get<string>('githubApiProxy', '');
  return customUrl || null;
}

/**
 * GitHub Gist Provider - 扩展 core 包实现，添加 VSCode 特定功能
 */
export class GitHubProvider extends CoreGitHubProvider {
  constructor(token?: string) {
    const proxyUrl = getGitHubApiProxy();
    super(token, proxyUrl || undefined);
  }
}