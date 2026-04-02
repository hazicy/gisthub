import * as vscode from 'vscode';

export async function getGitHubToken() {
  const session = await vscode.authentication.getSession('github', ['gist'], {
    createIfNone: false,
  });

  return session;
}
