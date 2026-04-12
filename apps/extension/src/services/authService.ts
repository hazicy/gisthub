import * as vscode from 'vscode';

export async function getGithubAccessToken() {
  const scopes: string[] = ['gist'];

  const session = await vscode.authentication.getSession('github', scopes, {
    createIfNone: true,
  });

  if (!session) {
    throw new Error('Failed to get GitHub session. Please try again.');
  }

  return session.accessToken;
}
