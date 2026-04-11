import * as vscode from 'vscode';
import type { GistServiceManager } from '../../services/gist/gistManager';
import {
  EmptyNode,
  ErrorNode,
  GistFileNode,
  GistFolderNode,
  type GistTreeItem,
} from './treeItem';

export class GistTreeProvider implements vscode.TreeDataProvider<GistTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    GistTreeItem | undefined | null | void
  >();

  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private readonly gistManager: GistServiceManager) {}

  dispose(): void {
    this._onDidChangeTreeData.dispose();
  }

  getTreeItem(element: GistTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: GistTreeItem): Promise<GistTreeItem[]> {
    try {
      if (!element) {
        return await this.getAllGistItems();
      }

      if (element instanceof GistFolderNode) {
        return await this.getFileItems(element);
      }

      return [];
    } catch (error) {
      return [new ErrorNode(vscode.l10n.t('errorFetchingGists'))];
    }
  }

  private async getAllGistItems(): Promise<GistTreeItem[]> {
    const providers = this.gistManager.getAllServices();

    if (providers.length === 0) {
      return [new EmptyNode(vscode.l10n.t('noActiveProviders'))];
    }

    const gistsResults = await Promise.all(
      providers.map(async ([providerId, provider]) => {
        try {
          const gists = await provider.getGists();
          return gists.map((gist) => new GistFolderNode(gist, providerId));
        } catch (error) {
          console.error(`Error fetching gists from ${providerId}:`, error);
          return [];
        }
      }),
    );

    return gistsResults.flat();
  }

  private async getFileItems(element: GistFolderNode): Promise<GistTreeItem[]> {
    const service = this.gistManager.getService(element.providerId);
    if (!service) return [];

    const gist = await service.getGist(element.gist.id);
    if (!gist) return [];

    return Object.keys(gist.files ?? {}).map(
      (filename) => new GistFileNode(filename, gist.id, element.providerId),
    );
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
