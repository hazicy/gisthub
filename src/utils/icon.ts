import * as vscode from 'vscode';

/**
 * 获取文件图标
 */
export function getFileIcon(_language?: string): vscode.ThemeIcon {
  return new vscode.ThemeIcon('file');
}

/**
 * 获取文件夹图标
 */
export function getFolderIcon(): vscode.ThemeIcon {
  return new vscode.ThemeIcon('folder');
}
