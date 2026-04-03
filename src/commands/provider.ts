import * as vscode from 'vscode';
import { GistProviderEnum as GistProviderEnum } from '../providers/gist/types';
import { createProvider } from '../services/gist/providerFactory';
import {
  getGiteeAccessToken,
  getGithubAccessToken,
} from '../services/authService';
import type { GistServiceManager } from '../services/gist/gistManager';
import { L10n } from '../utils/l10n';

export async function openProviderManager(
  gistManager: GistServiceManager,
  context: vscode.ExtensionContext,
): Promise<void> {
  const configs = gistManager.getConfig();

  if (configs.length === 0) {
    const pick = await vscode.window.showQuickPick(
      [
        { label: '$(mark-github) Add GitHub', value: 'github' },
        { label: '$(cloud) Add Gitee', value: 'gitee' },
      ],
      {
        placeHolder: L10n.t('noActiveProviders'),
      },
    );

    if (!pick) {
      return;
    }

    if (pick.value === 'github') {
      const token = await getGithubAccessToken();
      await createProvider(GistProviderEnum.GitHub, token, context);
    }

    if (pick.value === 'gitee') {
      const token = await getGiteeAccessToken();
      await createProvider(GistProviderEnum.GitHub, token, context);
    }

    return;
  }

  const items: vscode.QuickPickItem[] = [];

  for (const config of configs) {
    items.push({
      label: config.id,
      description: config.enabled
        ? '$(check) Enabled'
        : '$(circle-slash) Disabled',
      kind: vscode.QuickPickItemKind.Separator,
    });

    items.push({
      label: 'Edit Provider',
    });

    items.push({
      label: 'Delete Provider',
    });
  }

  items.push({
    label: '',
    kind: vscode.QuickPickItemKind.Separator,
  });

  items.push({
    label: '$(add) Add New Provider',
  });

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: L10n.t('manageProviders.title'),
  });

  if (!selected) {
    return;
  }
}

export async function addProvider(
  gistManager: GistServiceManager,
  type: GistProviderEnum,
): Promise<void> {
  const alias = await vscode.window.showInputBox({
    prompt: L10n.t('enterGistName'),
    placeHolder: type === GistProviderEnum.GitHub ? 'GitHub' : 'Gitee',
  });

  if (alias === undefined) {
    return;
  }

  const token = await vscode.window.showInputBox({
    prompt: type === GistProviderEnum.GitHub
      ? 'Enter your GitHub access token'
      : 'Enter your Gitee access token',
    password: true,
    placeHolder:
      type === GistProviderEnum.GitHub ? 'ghp_xxxxxxxx' : 'access_token',
  });

  if (token === undefined) {
    return;
  }

  const username = await vscode.window.showInputBox({
    prompt: L10n.t('enterGistName'),
    placeHolder: 'username',
  });

  if (username === undefined) {
    return;
  }

  vscode.window.showInformationMessage(L10n.t('gistUpdated'));
}
