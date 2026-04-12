import { GistService, GitHubProvider } from '@gisthub/core';
import type { GistProvider, Gist, CreateGistParams, UpdateGistParams } from '@/types/gist';

class GistAPI {
  private services: Map<string, GistService> = new Map();

  private getService(provider: GistProvider): GistService {
    const cached = this.services.get(provider.id);
    if (cached) return cached;

    let coreProvider;
    switch (provider.type) {
      case 'github':
        coreProvider = new GitHubProvider(provider.token);
        break;
      default:
        throw new Error(`Unknown provider type: ${provider.type}`);
    }

    const service = new GistService(coreProvider);
    this.services.set(provider.id, service);
    return service;
  }

  async getGists(provider: GistProvider): Promise<Gist[]> {
    const service = this.getService(provider);
    return service.getGists();
  }

  async getGist(provider: GistProvider, id: string): Promise<Gist> {
    const service = this.getService(provider);
    return service.getGist(id);
  }

  async createGist(provider: GistProvider, params: CreateGistParams): Promise<Gist> {
    const service = this.getService(provider);
    return service.createGist(params);
  }

  async updateGist(provider: GistProvider, id: string, params: UpdateGistParams): Promise<Gist> {
    const service = this.getService(provider);
    return service.updateGist(id, params);
  }

  async deleteGist(provider: GistProvider, id: string): Promise<void> {
    const service = this.getService(provider);
    return service.deleteGist(id);
  }

  async getGistContent(provider: GistProvider, id: string, filename: string): Promise<string> {
    const service = this.getService(provider);
    return service.getGistContent(id, filename);
  }

  async updateGistContent(
    provider: GistProvider,
    id: string,
    filename: string,
    content: string
  ): Promise<Gist> {
    const service = this.getService(provider);
    return service.updateGistContent(id, filename, content);
  }

  async deleteGistFile(provider: GistProvider, id: string, filename: string): Promise<Gist> {
    const service = this.getService(provider);
    return service.deleteGistFile(id, filename);
  }

  clearCache(providerId?: string) {
    if (providerId) {
      this.services.delete(providerId);
    } else {
      this.services.clear();
    }
  }
}

export const gistApi = new GistAPI();
