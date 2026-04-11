import * as vscode from 'vscode';
import type { GistServiceManager } from './services/gist/gistManager';
import { parseUri } from './utils';

export class GistFileSystemProvider implements vscode.FileSystemProvider {
  private readonly eventEmitter = new vscode.EventEmitter<
    vscode.FileChangeEvent[]
  >();
  private readonly manager: GistServiceManager;

  public readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> =
    this.eventEmitter.event;

  constructor(provider: GistServiceManager) {
    this.manager = provider;
  }

  watch(
    _uri: vscode.Uri,
    _options: {
      readonly recursive: boolean;
      readonly excludes: readonly string[];
    },
  ): vscode.Disposable {
    return {
      dispose: () => {},
    };
  }

  stat(_uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
    return {
      type: vscode.FileType.File,
      ctime: 0,
      mtime: Date.now(),
      size: 0,
    };
  }

  readDirectory(
    _uri: vscode.Uri,
  ): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
    return [];
  }

  createDirectory(_uri: vscode.Uri): void | Thenable<void> {
    // Gist 不支持真实文件夹
  }

  async readFile(uri: vscode.Uri): Promise<Uint8Array> {
    try {
      const { gistId, filename, providerId } = parseUri(uri);
      const provider = this.manager.getService(providerId);

      if (!provider) {
        throw vscode.FileSystemError.FileNotFound(uri);
      }

      const content = await provider.getGistContent(gistId, filename);

      if (!content) {
        throw vscode.FileSystemError.FileNotFound();
      }

      return new TextEncoder().encode(content);
    } catch (e) {
      if (e instanceof vscode.FileSystemError) {
        throw e;
      }
      throw vscode.FileSystemError.FileNotFound(uri);
    }
  }

  async writeFile(
    uri: vscode.Uri,
    content: Uint8Array,
    options: { readonly create: boolean; readonly overwrite: boolean },
  ): Promise<void> {
    const { gistId, filename, providerId } = parseUri(uri);
    const provider = this.manager.getService(providerId);
    const contentStr = new TextDecoder().decode(content);

    if (!provider) {
      throw vscode.FileSystemError.FileNotFound(uri);
    }

    if (options.create && !options.overwrite) {
      // 创建新 Gist
      await provider.createGist({
        description: vscode.l10n.t('newGist'),
        public: false,
        files: { [filename]: { content: contentStr } },
      });
      return;
    }

    if (options.create && options.overwrite) {
      // 更新已存在的 Gist 文件
      await provider.updateGistContent(gistId, filename, contentStr);
      return;
    }

    this.notifyFileChanged(uri, vscode.FileChangeType.Changed);
  }

  async delete(
    uri: vscode.Uri,
    _options: { readonly recursive: boolean },
  ): Promise<void> {
    const { gistId, filename, providerId } = parseUri(uri);

    const provider = this.manager.getService(providerId);

    if (!provider) {
      throw vscode.FileSystemError.FileNotFound(uri);
    }

    // 如果有 filename，说明是删除文件；否则删除整个 Gist
    if (filename) {
      await provider.deleteGistFile(gistId, filename);
    } else {
      await provider.deleteGist(gistId);
    }

    this.notifyFileChanged(uri, vscode.FileChangeType.Deleted);
  }

  async rename(
    oldUri: vscode.Uri,
    newUri: vscode.Uri,
    _options: { readonly overwrite: boolean },
  ): Promise<void> {
    const { gistId, filename: oldFilename, providerId } = parseUri(oldUri);
    const provider = this.manager.getService(providerId);

    if (!provider) {
      throw vscode.FileSystemError.FileNotFound(oldUri);
    }

    const { filename: newFilename } = parseUri(newUri);

    const content = await provider.getGistContent(gistId, oldFilename);

    await provider.updateGist(gistId, {
      files: {
        [oldFilename]: null,
        [newFilename]: {
          content,
        },
      },
    });

    this.notifyFileChanged(oldUri, vscode.FileChangeType.Deleted);
    this.notifyFileChanged(newUri, vscode.FileChangeType.Created);
  }

  async copy(
    source: vscode.Uri,
    destination: vscode.Uri,
    _options: { readonly overwrite: boolean },
  ): Promise<void> {
    const {
      gistId: sourceGistId,
      filename: sourceFilename,
      providerId,
    } = parseUri(source);
    const provider = this.manager.getService(providerId);

    if (!provider) {
      throw vscode.FileSystemError.FileNotFound(source);
    }

    const { gistId: destGistId, filename: destFilename } =
      parseUri(destination);

    const content = await provider.getGistContent(sourceGistId, sourceFilename);

    if (sourceGistId === destGistId) {
      await provider.updateGist(sourceGistId, {
        files: {
          [destFilename]: {
            content,
          },
        },
      });
    } else {
      await provider.updateGistContent(destGistId, destFilename, content ?? '');
    }

    this.notifyFileChanged(destination, vscode.FileChangeType.Created);
  }

  private notifyFileChanged(
    uri: vscode.Uri,
    type: vscode.FileChangeType,
  ): void {
    this.eventEmitter.fire([{ uri, type }]);
  }
}
