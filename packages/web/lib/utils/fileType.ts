import { FILE_TYPES, SUPPORTED_MARKDOWN_EXTENSIONS, SUPPORTED_JUPYTER_EXTENSIONS } from '../constants';

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

export function getFileType(filename: string): { icon: string; color: string; language: string } {
  const ext = getFileExtension(filename);
  return FILE_TYPES[ext] || { icon: 'file', color: 'gray', language: 'plaintext' };
}

export function isMarkdownFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return SUPPORTED_MARKDOWN_EXTENSIONS.includes(ext);
}

export function isJupyterFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return SUPPORTED_JUPYTER_EXTENSIONS.includes(ext);
}

export function getLanguageFromFilename(filename: string): string {
  const ext = getFileExtension(filename);
  return FILE_TYPES[ext]?.language || 'plaintext';
}