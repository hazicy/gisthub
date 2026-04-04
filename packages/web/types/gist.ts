/**
 * Gist 提供商类型
 */
export type GistProviderType = 'github' | 'gitee';

/**
 * Gist 服务商接口
 */
export interface GistProvider {
  id: string;
  type: GistProviderType;
  name: string;
  token: string;
  enabled: boolean;
}

/**
 * Gist 文件结构
 */
export interface GistFile {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
  content?: string;
}

/**
 * Gist 所有者信息
 */
export interface GistOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

/**
 * Gist 数据结构
 */
export interface Gist {
  id: string;
  description: string;
  html_url: string;
  git_pull_url: string;
  git_push_url: string;
  created_at: string;
  updated_at: string;
  public: boolean;
  files: Record<string, GistFile>;
  owner?: GistOwner;
}

/**
 * 创建 Gist 参数
 */
export interface CreateGistParams {
  description: string;
  files: Record<string, { content: string }>;
  public: boolean;
}

/**
 * 更新 Gist 参数
 */
export interface UpdateGistParams {
  description?: string;
  files?: Record<string, { content?: string; filename?: string } | null>;
}

/**
 * 提供商配置
 */
export interface ProviderConfig {
  id: string;
  provider?: GistProviderType;
  enabled?: boolean;
}

/**
 * Store 状态类型
 */
export interface GistStore {
  // 提供商相关
  providers: GistProvider[];
  currentProvider: GistProvider | null;
  setCurrentProvider: (provider: GistProvider | null) => void;
  addProvider: (provider: GistProvider) => void;
  removeProvider: (id: string) => void;
  toggleProvider: (id: string) => void;

  // Gist 相关
  gists: Gist[];
  selectedGist: Gist | null;
  isLoading: boolean;
  setGists: (gists: Gist[]) => void;
  setSelectedGist: (gist: Gist | null) => void;
  setLoading: (loading: boolean) => void;
  addGist: (gist: Gist) => void;
  updateGist: (id: string, gist: Gist) => void;
  removeGist: (id: string) => void;

  // UI 状态
  isCreateModalOpen: boolean;
  isDetailModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  setDetailModalOpen: (open: boolean) => void;
}