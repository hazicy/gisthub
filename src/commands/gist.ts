import * as vscode from 'vscode';
import { SCHEMA } from '../extension';
import { L10n } from '../utils/l10n';
import type { GistTreeItem } from '../views/tree/gistTreeData';
import { GistServiceManager } from '../services/gist/gistManager';

/**
 * 打开 Gist 文件
 */
export async function openGist(
  id: string,
  filename: string,
  providerId?: string,
): Promise<void> {
  const fileUri = vscode.Uri.from({
    scheme: SCHEMA,
    authority: providerId,
    path: `/${filename}`,
    query: `id=${id}`,
  });

  const document = await vscode.workspace.openTextDocument(fileUri);
  vscode.window.showTextDocument(document);
}

/**
 * 重命名 Gist 文件
 */
export async function renameGist(
  { id, label }: GistTreeItem,
  context: vscode.ExtensionContext,
): Promise<void> {
  if (!id) {
    throw vscode.FileSystemError.FileExists();
  }

  const manager = GistServiceManager.getInstance(context);
  const service = manager.getService(id);
  const currentName = typeof label === 'string' ? label : label?.label || '';

  const newName = await vscode.window.showInputBox({
    value: currentName,
    prompt: L10n.t('enterNewName'),
  });

  if (!newName || newName === currentName) {
    return;
  }

  try {
    await service?.updateGist(id, {
      files: {
        [currentName]: null,
        [newName]: {
          content: '', // 临时内容，后续会填充
        },
      },
    });

    vscode.window.showInformationMessage(L10n.t('fileRenamed'));
  } catch (error) {
    vscode.window.showErrorMessage(L10n.t('errorRenamingFile'));
  }
}

/**
 * 删除 Gist 文件
 */
export async function deleteFileCommand(
  { id, label }: GistTreeItem,
  context: vscode.ExtensionContext,
): Promise<void> {
  if (!id) {
    throw vscode.FileSystemError.FileExists();
  }

  const manager = GistServiceManager.getInstance(context);
  const service = manager.getService(id);
  const confirm = await vscode.window.showWarningMessage(
    L10n.t('confirmDelete', label),
    { modal: true },
    L10n.t('delete'),
  );

  if (confirm !== L10n.t('delete')) {
    return;
  }

  try {
    await service?.deleteGistFile(id, label as string);
    vscode.window.showInformationMessage(L10n.t('fileDeleted'));
  } catch (error) {
    vscode.window.showErrorMessage(L10n.t('errorDeletingFile'));
  }
}

/**
 * 创建新 Gist
 */
export async function createGistCommand(): Promise<void> {
  try {
    const description = await vscode.window.showInputBox({
      prompt: L10n.t('enterGistDescription'),
      placeHolder: L10n.t('gistDescriptionPlaceholder'),
    });

    if (!description) {
      return;
    }

    const filename = await vscode.window.showInputBox({
      prompt: L10n.t('enterFileName'),
      placeHolder: L10n.t('fileNamePlaceholder'),
    });

    if (!filename) {
      return;
    }

    vscode.window.showInformationMessage(L10n.t('gistCreated'));
  } catch (error) {
    vscode.window.showErrorMessage(L10n.t('errorCreatingGist'));
  }
}

/**
 * 在 Gist 中创建新文件
 */
export async function createFileCommand(
  { id }: GistTreeItem,
  context: vscode.ExtensionContext,
): Promise<void> {
  if (!id) {
    throw vscode.FileSystemError.FileExists();
  }

  const manager = GistServiceManager.getInstance(context);
  const service = manager.getService(id);

  const filename = await vscode.window.showInputBox({
    prompt: L10n.t('enterFileName'),
    placeHolder: L10n.t('fileNamePlaceholder'),
  });

  if (!filename) {
    return;
  }

  try {
    await service?.updateGist(id, {
      files: {
        [filename]: {
          content: '',
        },
      },
    });

    vscode.window.showInformationMessage(L10n.t('fileCreated'));
  } catch (error) {
    vscode.window.showErrorMessage(L10n.t('errorCreatingFile'));
  }
}

/**
 * 删除 Gist
 */
export async function deleteGistCommand(
  { id, label }: GistTreeItem,
  context: vscode.ExtensionContext,
): Promise<void> {
  if (!id) {
    throw vscode.FileSystemError.FileExists();
  }

  const manager = GistServiceManager.getInstance(context);
  const service = manager.getService(id);
  const gistName = typeof label === 'string' ? label : label?.label || '';
  const confirm = await vscode.window.showWarningMessage(
    L10n.t('confirmDeleteGist', gistName),
    { modal: true },
    L10n.t('delete'),
  );

  if (confirm !== L10n.t('delete')) {
    return;
  }

  try {
    await service?.deleteGist(id);
    vscode.window.showInformationMessage(L10n.t('gistDeleted'));
  } catch (error) {
    vscode.window.showErrorMessage(L10n.t('errorDeletingGist'));
  }
}
