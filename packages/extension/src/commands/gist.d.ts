import * as vscode from 'vscode';
import type { GistTreeItem } from '../views/tree/gistTreeData';
export declare function openGist(id: string, filename: string, providerId?: string): Promise<void>;
export declare function renameGist({ id, label }: GistTreeItem, context: vscode.ExtensionContext, refreshCallback?: () => void): Promise<void>;
export declare function deleteFileCommand({ id, label, resourceUri }: GistTreeItem, context: vscode.ExtensionContext, refreshCallback?: () => void): Promise<void>;
export declare function createGistCommand(context: vscode.ExtensionContext, refreshCallback?: () => void, item?: GistTreeItem): Promise<void>;
export declare function createFileCommand({ id, providerId }: GistTreeItem, context: vscode.ExtensionContext, refreshCallback?: () => void): Promise<void>;
export declare function deleteGistCommand({ id, label, providerId, resourceUri }: GistTreeItem, context: vscode.ExtensionContext, refreshCallback?: () => void): Promise<void>;
export declare function openInExternal(context: vscode.ExtensionContext): Promise<void>;
//# sourceMappingURL=gist.d.ts.map