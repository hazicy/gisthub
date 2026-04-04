import * as vscode from 'vscode';
import { GistProviderEnum as GistProviderEnum } from '../providers/gist/types';
import type { GistServiceManager } from '../services/gist/gistManager';
export declare function openProviderManager(gistManager: GistServiceManager, context: vscode.ExtensionContext): Promise<void>;
export declare function addProvider(gistManager: GistServiceManager, type: GistProviderEnum): Promise<void>;
//# sourceMappingURL=provider.d.ts.map