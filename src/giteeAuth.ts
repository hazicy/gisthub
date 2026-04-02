import axios from 'axios';
import * as vscode from 'vscode';

export class GiteeAuthenticationProvider
  implements vscode.AuthenticationProvider
{
  context: vscode.ExtensionContext;

  private _onDidChangeSessions =
    new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();

  onDidChangeSessions = this._onDidChangeSessions.event;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async getSessions(): Promise<vscode.AuthenticationSession[]> {
    const token = await this.context.secrets.get('gitee-token');

    if (!token) {
      return [];
    }

    return [
      {
        id: 'gitee-session',
        accessToken: token,
        account: {
          id: 'gitee',
          label: 'Gitee User',
        },
        scopes: ['gist'],
      },
    ];
  }

  async createSession(
    scopes: readonly string[],
  ): Promise<vscode.AuthenticationSession> {
    const clientId = 'client_id';
    const clientSecret = '你的 client_secret';

    const redirectUri = `${vscode.env.uriScheme}://Hazi.gisthub`;

    const authUri = `https://gitee.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&response_type=code&scope=${encodeURIComponent(scopes.join(' '))}`;

    await vscode.env.openExternal(vscode.Uri.parse(authUri));
    const code = await this.waitForCode();

    const token = await this.exchangeCodeForToken(
      code as string,
      clientId,
      clientSecret,
      redirectUri,
    );

    await this.context.secrets.store('gitee-token', token);

    const session: vscode.AuthenticationSession = {
      id: 'gitee-session',
      accessToken: token,
      account: {
        id: 'gitee',
        label: 'Gitee User',
      },
      scopes: scopes as string[],
    };

    this._onDidChangeSessions.fire({
      added: [session],
      removed: [],
      changed: [],
    });

    return session;
  }

  async removeSession(): Promise<void> {
    await this.context.secrets.delete('gitee-token');

    this._onDidChangeSessions.fire({
      added: [],
      removed: [],
      changed: [],
    });
  }

  private async exchangeCodeForToken(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string,
  ): Promise<string> {
    const res = await axios.post(
      'https://gitee.com/oauth/token',
      {
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    return res.data.access_token;
  }

  private waitForCode(): Promise<string> {
    return new Promise((resolve) => {
      const handler = vscode.window.registerUriHandler({
        handleUri: (uri: vscode.Uri) => {
          const params = new URLSearchParams(uri.query);
          const code = params.get('code');

          if (code) {
            resolve(code);
            handler.dispose();
          }
        },
      });
    });
  }
}
