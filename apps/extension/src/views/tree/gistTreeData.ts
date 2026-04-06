import * as vscode from 'vscode';
import type { Gist } from '../../providers/gist/types';
import type { GistServiceManager } from '../../services/gist/gistManager';
import { SCHEMA } from '../../extension';

export type GistTreeItem = {
  gist?: Gist;
  providerId: string;
} & vscode.TreeItem;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 30 * 1000; // 30 秒缓存

export class GistTreeProvider implements vscode.TreeDataProvider<GistTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    GistTreeItem | undefined | null | void
  >();
  private cache = new Map<string, CacheEntry<unknown>>();
  private cacheTimer?: NodeJS.Timeout;

  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private readonly gistManager: GistServiceManager) {
    // 定期清理过期缓存
    this.cacheTimer = setInterval(() => this.cleanCache(), CACHE_TTL);
  }

  dispose(): void {
    if (this.cacheTimer) {
      clearInterval(this.cacheTimer);
      this.cacheTimer = undefined;
    }
    this.cache.clear();
    this._onDidChangeTreeData.dispose();
  }

  getTreeItem(element: GistTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(
    element?: GistTreeItem | undefined,
  ): Promise<GistTreeItem[]> {
    try {
      if (!element) {
        return await this.getAllGistItems();
      }

      const items = await this.getFileItems(element);

      return items;
    } catch (error) {
      vscode.window.showErrorMessage(vscode.l10n.t('errorFetchingGists'));
      return [];
    }
  }

  private getCached<T>(key: string): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data;
    }
    return undefined;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private cleanCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }

  private async getAllGistItems(): Promise<GistTreeItem[]> {
    const providers = this.gistManager.getAllServices();

    if (providers.length === 0) {
      vscode.window.showInformationMessage(vscode.l10n.t('noActiveProviders'));
      return [];
    }

    const cacheKey = 'allGists';
    const cached = this.getCached<GistTreeItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const items: GistTreeItem[] = [];

    for (const [providerId, provider] of providers) {
      const gists = await provider.getGists();
      for (const gist of gists) {
        const gistUri = vscode.Uri.from({
          scheme: SCHEMA,
          authority: providerId,
          query: `id=${gist.id}`,
        });

        items.push({
          gist,
          collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
          iconPath: new vscode.ThemeIcon('note'),
          id: gist.id,
          label: gist.description || vscode.l10n.t('unnamedGist'),
          providerId,
          resourceUri: gistUri,
          contextValue: 'gistFolder',
        });
      }
    }

    this.setCache(cacheKey, items);
    return items;
  }

  private async getFileItems(element: GistTreeItem): Promise<GistTreeItem[]> {
    if (!element.providerId || !element.id) {
      return [];
    }

    const service = this.gistManager.getService(element.providerId);

    if (!service) {
      return [];
    }

    const cacheKey = `gist:${element.providerId}:${element.id}`;
    const cached = this.getCached<GistTreeItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const gist = await service.getGist(element.id);

    if (!gist) {
      return [];
    }

    const files = Object.keys(gist.files ?? {});

    const items = files.map((filename): GistTreeItem => {
      const fileUri = vscode.Uri.from({
        scheme: SCHEMA,
        authority: element.providerId,
        path: `/${filename}`,
        query: `id=${gist.id}`,
      });

      return {
        id: filename,
        label: filename,
        iconPath: vscode.ThemeIcon.File,
        command: {
          command: 'gisthub.openGist',
          title: vscode.l10n.t('openGist'),
          arguments: [element.id, filename, element.providerId],
        },
        providerId: element.providerId,
        resourceUri: fileUri,
        contextValue: 'gistItem',
      };
    });

    this.setCache(cacheKey, items);
    return items;
  }

  refresh(): void {
    this.cache.clear();
    this._onDidChangeTreeData.fire();
  }
}
