import { GistProviderEnum } from '../types';
import { GitHubProvider } from '../providers/github';
import { GiteeProvider } from '../providers/gitee';
import { GistService } from './gistService';

/**
 * 创建 GistService 实例的工厂函数
 */
export function createGistService(
  provider: GistProviderEnum,
  token: string,
  proxyUrl?: string,
): GistService {
  switch (provider) {
    case GistProviderEnum.GitHub:
      return new GistService(new GitHubProvider(token, proxyUrl));
    case GistProviderEnum.Gitee:
      return new GistService(new GiteeProvider(token));
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}