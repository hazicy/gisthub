'use client';

import { useMemo } from 'react';
import { Spinner } from '@heroui/react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CodeBlock } from './CodeBlock';
import { JupyterViewer } from './JupyterViewer';
import { isMarkdownFile, isJupyterFile, getLanguageFromFilename } from '@/lib/utils/fileType';

interface FileViewerProps {
  filename: string;
  content: string;
  isLoading?: boolean;
}

export function FileViewer({ filename, content, isLoading = false }: FileViewerProps) {
  const fileType = useMemo(() => {
    if (isMarkdownFile(filename)) return 'markdown';
    if (isJupyterFile(filename)) return 'jupyter';
    return 'code';
  }, [filename]);

  const language = useMemo(() => getLanguageFromFilename(filename), [filename]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="lg" />
        <p className="mt-4 text-default-500">加载中...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-default-500">文件为空</p>
      </div>
    );
  }

  switch (fileType) {
    case 'markdown':
      return <MarkdownRenderer content={content} />;
    case 'jupyter':
      return <JupyterViewer content={content} />;
    default:
      return <CodeBlock content={content} language={language} />;
  }
}