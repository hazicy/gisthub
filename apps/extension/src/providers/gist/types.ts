import * as vscode from 'vscode';

import type {
  GistProvider,
  Gist,
  CreateGistParams,
  UpdateGistParams,
  ProviderConfig,
} from '@gisthub/core';
import { GistProviderEnum } from '@gisthub/core';

export type StarGistTreeItem = {
  gist?: Gist;
} & vscode.TreeItem;

export type {
  GistProvider,
  Gist,
  CreateGistParams,
  UpdateGistParams,
  ProviderConfig,
};
export { GistProviderEnum };
