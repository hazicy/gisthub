import axios from 'axios';
import * as vscode from 'vscode';

const CLIENT_ID = process.env.GITEE_CLIENT_ID;
const CLIENT_SECRET = process.env.GITEE_CLIENT_SECRET;

const SECRET_KEYS = {
  TOKEN: 'gitee-token',
  EXPIRES_AT: 'gitee-token-expiresAt',
  REFRESH_TOKEN: 'gitee-token-refreshToken',
} as const;

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export class GiteeAuthenticationProvider
  implements vscode.AuthenticationProvider
{
  private readonly _onDidChangeSessions =
    new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();

  readonly onDidChangeSessions = this._onDidChangeSessions.event;

  constructor(private readonly context: vscode.ExtensionContext) {}

  async getSessions(): Promise<vscode.AuthenticationSession[]> {
    const isValid = await this.isTokenValid();

    if (!isValid) {
      try {
        await this.refreshAccessToken();
      } catch {
        await this.clearSecrets();
        return [];
      }
    }

    const token = await this.context.secrets.get(SECRET_KEYS.TOKEN);
    if (!token) return [];

    return [this.buildSession(token, ['gist'])];
  }

  async createSession(
    scopes: readonly string[],
  ): Promise<vscode.AuthenticationSession> {
    const redirectUri = `${vscode.env.uriScheme}://Hazi.gisthub`;
    const authUri =
      `https://gitee.com/oauth/authorize` +
      `?client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code`;

    await vscode.env.openExternal(vscode.Uri.parse(authUri));

    const code = await this.waitForCode();
    const tokenData = await this.exchangeCodeForToken(code, redirectUri);
    await this.storeTokenData(tokenData);

    const session = this.buildSession(
      tokenData.access_token,
      scopes as string[],
    );

    this._onDidChangeSessions.fire({
      added: [session],
      removed: [],
      changed: [],
    });

    return session;
  }

  async removeSession(): Promise<void> {
    const token = await this.context.secrets.get(SECRET_KEYS.TOKEN);
    if (!token) return;

    await this.clearSecrets();

    this._onDidChangeSessions.fire({
      added: [],
      removed: [this.buildSession(token, ['gist'])],
      changed: [],
    });
  }

  private buildSession(
    token: string,
    scopes: string[],
  ): vscode.AuthenticationSession {
    return {
      id: 'gitee-session',
      accessToken: token,
      account: { id: 'gitee', label: 'Gitee User' },
      scopes,
    };
  }

  private async storeTokenData(data: TokenResponse): Promise<void> {
    const expiresAt = (data.created_at + data.expires_in) * 1000;
    await Promise.all([
      this.context.secrets.store(SECRET_KEYS.TOKEN, data.access_token),
      this.context.secrets.store(SECRET_KEYS.EXPIRES_AT, String(expiresAt)),
      this.context.secrets.store(SECRET_KEYS.REFRESH_TOKEN, data.refresh_token),
    ]);
  }

  private async clearSecrets(): Promise<void> {
    await Promise.all(
      Object.values(SECRET_KEYS).map((k) => this.context.secrets.delete(k)),
    );
  }

  private async exchangeCodeForToken(
    code: string,
    redirectUri: string,
  ): Promise<TokenResponse> {
    const { data } = await axios.post<TokenResponse>(
      'https://gitee.com/oauth/token',
      {
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: redirectUri,
      },
      { headers: { Accept: 'application/json' } },
    );
    return data;
  }

  private waitForCode(): Promise<string> {
    return new Promise((resolve, reject) => {
      // 添加超时，避免永久挂起
      const timeout = setTimeout(
        () => {
          handler.dispose();
          reject(new Error('OAuth timeout: no code received within 5 minutes'));
        },
        5 * 60 * 1000,
      );

      const handler = vscode.window.registerUriHandler({
        handleUri(uri: vscode.Uri) {
          const code = new URLSearchParams(uri.query).get('code');
          if (code) {
            clearTimeout(timeout);
            handler.dispose();
            resolve(code);
          }
        },
      });
    });
  }

  private async refreshAccessToken(): Promise<void> {
    const refreshToken = await this.context.secrets.get(
      SECRET_KEYS.REFRESH_TOKEN,
    );
    if (!refreshToken) throw new Error('Missing refresh token');

    const { data } = await axios.post<TokenResponse>(
      'https://gitee.com/oauth/token',
      { grant_type: 'refresh_token', refresh_token: refreshToken },
      { headers: { Accept: 'application/json' } },
    );

    await this.storeTokenData(data);
  }

  private async isTokenValid(): Promise<boolean> {
    const expiresAt = await this.context.secrets.get(SECRET_KEYS.EXPIRES_AT);
    if (!expiresAt) return false;

    return Date.now() < Number(expiresAt) - 60_000;
  }
}
