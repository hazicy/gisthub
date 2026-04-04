import * as vscode from 'vscode';
import type { GistServiceManager } from './services/gist/gistManager';
/**
 * Gist 文件系统提供者
 * 使用适配器模式支持多种 Gist 服务提供商
 */
export declare class GistFileSystemProvider implements vscode.FileSystemProvider {
    private readonly eventEmitter;
    private readonly manager;
    readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;
    constructor(provider: GistServiceManager);
    /**
     * 监视文件变化（当前未实现）
     */
    watch(_uri: vscode.Uri, _options: {
        readonly recursive: boolean;
        readonly excludes: readonly string[];
    }): vscode.Disposable;
    /**
     * 获取文件状态
     */
    stat(_uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat>;
    /**
     * 读取目录（Gist 不支持真实文件夹）
     */
    readDirectory(_uri: vscode.Uri): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]>;
    /**
     * 创建目录（Gist 不支持真实文件夹）
     */
    createDirectory(_uri: vscode.Uri): void | Thenable<void>;
    /**
     * 读取文件内容
     */
    readFile(uri: vscode.Uri): Promise<Uint8Array>;
    /**
     * 写入文件内容
     */
    writeFile(uri: vscode.Uri, content: Uint8Array, options: {
        readonly create: boolean;
        readonly overwrite: boolean;
    }): Promise<void>;
    /**
     * 删除文件
     */
    delete(uri: vscode.Uri, _options: {
        readonly recursive: boolean;
    }): Promise<void>;
    /**
     * 重命名文件
     */
    rename(oldUri: vscode.Uri, newUri: vscode.Uri, _options: {
        readonly overwrite: boolean;
    }): Promise<void>;
    /**
     * 复制文件
     */
    copy(source: vscode.Uri, destination: vscode.Uri, _options: {
        readonly overwrite: boolean;
    }): Promise<void>;
    /**
     * 解析 URI 获取 Gist ID 和文件名
     */
    private parseUri;
    /**
     * 通知文件变化
     */
    private notifyFileChanged;
}
//# sourceMappingURL=gistFileSystem.d.ts.map