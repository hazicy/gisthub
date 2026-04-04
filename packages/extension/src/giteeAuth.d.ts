import * as vscode from 'vscode';
export declare class GiteeAuthenticationProvider implements vscode.AuthenticationProvider {
    context: vscode.ExtensionContext;
    private _onDidChangeSessions;
    onDidChangeSessions: vscode.Event<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>;
    constructor(context: vscode.ExtensionContext);
    getSessions(): Promise<vscode.AuthenticationSession[]>;
    createSession(scopes: readonly string[]): Promise<vscode.AuthenticationSession>;
    removeSession(): Promise<void>;
    private exchangeCodeForToken;
    private waitForCode;
}
//# sourceMappingURL=giteeAuth.d.ts.map