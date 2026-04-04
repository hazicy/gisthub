import * as vscode from 'vscode';
import type { ProviderConfig } from '../providers/gist/types';
export declare function loadServices(context: vscode.ExtensionContext): ProviderConfig[];
export declare function saveService(context: vscode.ExtensionContext, services: ProviderConfig[]): Promise<void>;
//# sourceMappingURL=serviceStorage.d.ts.map