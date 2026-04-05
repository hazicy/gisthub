import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GistHub - Gist 管理工具',
  description: '管理你的 GitHub 和 Gitee Gist',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}