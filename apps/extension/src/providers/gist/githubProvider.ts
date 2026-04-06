import { GitHubProvider as CoreGitHubProvider } from '@gisthub/core';
import * as vscode from 'vscode';

function getGitHubApiProxy(): string | null {
  const customUrl = vscode.workspace
    .getConfiguration('gisthub')
    .get<string>('githubApiProxy', '');
  return customUrl || null;
}

export class GitHubProvider extends CoreGitHubProvider {
  constructor(token?: string) {
    const proxyUrl = getGitHubApiProxy();
    super(token, proxyUrl || undefined);
  }
}
