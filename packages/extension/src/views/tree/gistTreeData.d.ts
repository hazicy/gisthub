import * as vscode from 'vscode';
import type { Gist, GistProviderEnum } from '../../providers/gist/types';
import type { GistServiceManager } from '../../services/gist/gistManager';
export type GistTreeItem = {
    gist?: Gist;
    adapter?: GistProviderEnum;
    providerId: string;
} & vscode.TreeItem;
export declare class GistTreeProvider implements vscode.TreeDataProvider<GistTreeItem> {
    private readonly gistManager;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | GistTreeItem | null | undefined>;
    constructor(gistManager: GistServiceManager);
    getTreeItem(element: GistTreeItem): vscode.TreeItem;
    getChildren(element?: GistTreeItem | undefined): Promise<GistTreeItem[]>;
    private getAllGistItems;
    private getFileItems;
    refresh(): void;
}
//# sourceMappingURL=gistTreeData.d.ts.map