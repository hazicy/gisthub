import * as vscode from 'vscode';
import type { GistServiceManager } from '../../services/gist/gistManager';

const ProviderIds = {
  GitHub: 'github',
  Gitee: 'gitee',
} as const;

export class StarDecorationProvider implements vscode.FileDecorationProvider {
  private _onDidChangeDecorations = new vscode.EventEmitter<vscode.Uri[]>();
  private starredGistIds = new Set<string>();

  readonly onDidChangeDecorations = this._onDidChangeDecorations.event;

  constructor(private readonly gistManager: GistServiceManager) {}

  async refresh(): Promise<void> {
    this.starredGistIds.clear();

    const providers = this.gistManager.getAllServices();
    for (const [providerId, provider] of providers) {
      try {
        const starredGists = await provider.getStarredGists();
        for (const gist of starredGists) {
          this.starredGistIds.add(`${providerId}:${gist.id}`);
        }
      } catch (error) {
        console.error(
          `Error fetching starred gists from ${providerId}:`,
          error,
        );
      }
    }

    // 通知 VS Code 刷新所有装饰
    this._onDidChangeDecorations.fire([]);
  }

  provideFileDecoration(
    uri: vscode.Uri,
  ): vscode.FileDecoration | undefined {
    const providerId = uri.authority;
    const gistId = uri.query.match(/id=([^&]+)/)?.[1];

    if (!providerId || !gistId) {
      return undefined;
    }

    // 根据 provider 显示不同装饰
    if (providerId === ProviderIds.GitHub) {
      return {
        badge: 'GH',
        color: new vscode.ThemeColor('charts.blue'),
        propagate: false,
      };
    } else if (providerId === ProviderIds.Gitee) {
      return {
        badge: 'GT',
        color: new vscode.ThemeColor('charts.red'),
        propagate: false,
      };
    }

    return undefined;
  }
}