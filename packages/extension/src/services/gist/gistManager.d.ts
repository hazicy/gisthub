import * as vscode from 'vscode';
import { type ProviderConfig } from '@gisthub/core';
import { GistService } from '@gisthub/core';
export declare class GistServiceManager {
    private context;
    private services;
    private configs;
    private static instance;
    activeServiceId?: string;
    constructor(context: vscode.ExtensionContext);
    static getInstance(context: vscode.ExtensionContext): GistServiceManager;
    init(): Promise<void>;
    registerService(id: string, service: GistService): void;
    getService(id: string): GistService | undefined;
    getAllServices(): [string, GistService][];
    getConfig(): ProviderConfig[];
    removeService(id: string): void;
}
//# sourceMappingURL=gistManager.d.ts.map