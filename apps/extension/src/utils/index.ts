import * as vscode from 'vscode';

export function parseUri(uri: vscode.Uri): {
  gistId: string;
  filename: string;
  providerId: string;
} {
  // URI: gisthub://providerId/filename?id=xxx

  const providerId = uri.authority;
  if (!providerId) {
    throw vscode.FileSystemError.FileNotFound(uri);
  }

  const filename = uri.path.startsWith('/') ? uri.path.slice(1) : uri.path;
  const params = new URLSearchParams(uri.query);
  const gistId = params.get('id');

  if (!gistId) {
    throw new Error(vscode.l10n.t('invalidGistUri'));
  }

  return { gistId, filename: decodeURIComponent(filename), providerId };
}
