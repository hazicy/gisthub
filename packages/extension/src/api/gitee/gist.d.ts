import type { GistObject } from './type';
export declare function getGist(): Promise<GistObject[]>;
export declare function createGist(): void;
export declare function getGistId(id: string): Promise<GistObject>;
export declare function updateGist(params: {
    id: string;
    description?: string;
    files?: Record<string, {
        content?: any;
        description?: string;
    } | null>;
}): Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare function deleteFile(params: {
    id: string;
    description?: string;
    files?: Record<string, {
        content?: string;
        description?: string;
    } | null>;
}): Promise<import("axios").AxiosResponse<any, any, {}>>;
//# sourceMappingURL=gist.d.ts.map