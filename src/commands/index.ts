import * as vscode from 'vscode';
import type { GistServiceManager } from '../services/gist/gistManager';
import {
  createFileCommand,
  createGistCommand,
  deleteFileCommand,
  deleteGistCommand,
  openGist,
  renameGist,
} from './gist';
import { openProviderManager } from './provider';

/**
 * 注册所有命令
 */
export function registerAllCommands(
  gistManager: GistServiceManager,
  refreshCallback: () => void,
  context: vscode.ExtensionContext,
): vscode.Disposable[] {
  const commands = [
    vscode.commands.registerCommand('gisthub.openGist', openGist, context),
    vscode.commands.registerCommand('gisthub.renameGist', renameGist, context),
    vscode.commands.registerCommand(
      'gisthub.deleteGist',
      deleteGistCommand,
      context,
    ),
    vscode.commands.registerCommand(
      'gisthub.deleteGistFile',
      deleteFileCommand,
    ),
    vscode.commands.registerCommand(
      'gisthub.createFile',
      createFileCommand,
      context,
    ),
    vscode.commands.registerCommand(
      'gisthub.createGist',
      createGistCommand,
      context,
    ),
    // Provider management commands
    vscode.commands.registerCommand('gisthub.manageProviders', () =>
      openProviderManager(gistManager, context),
    ),
  ];

  return commands;
}
