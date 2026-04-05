export const FILE_TYPES: Record<string, { icon: string; color: string; language: string }> = {
  md: { icon: 'markdown', color: 'blue', language: 'markdown' },
  markdown: { icon: 'markdown', color: 'blue', language: 'markdown' },
  js: { icon: 'javascript', color: 'yellow', language: 'javascript' },
  jsx: { icon: 'react', color: 'cyan', language: 'javascript' },
  ts: { icon: 'typescript', color: 'blue', language: 'typescript' },
  tsx: { icon: 'react', color: 'cyan', language: 'typescript' },
  py: { icon: 'python', color: 'green', language: 'python' },
  ipynb: { icon: 'jupyter', color: 'orange', language: 'jupyter' },
  json: { icon: 'json', color: 'gray', language: 'json' },
  html: { icon: 'html', color: 'red', language: 'html' },
  css: { icon: 'css', color: 'blue', language: 'css' },
  scss: { icon: 'sass', color: 'pink', language: 'scss' },
  txt: { icon: 'text', color: 'gray', language: 'plaintext' },
  yml: { icon: 'yaml', color: 'red', language: 'yaml' },
  yaml: { icon: 'yaml', color: 'red', language: 'yaml' },
  sh: { icon: 'shell', color: 'gray', language: 'bash' },
  bash: { icon: 'shell', color: 'gray', language: 'bash' },
  go: { icon: 'go', color: 'cyan', language: 'go' },
  rs: { icon: 'rust', color: 'orange', language: 'rust' },
  java: { icon: 'java', color: 'red', language: 'java' },
  cpp: { icon: 'cpp', color: 'blue', language: 'cpp' },
  c: { icon: 'c', color: 'blue', language: 'c' },
  rb: { icon: 'ruby', color: 'red', language: 'ruby' },
  php: { icon: 'php', color: 'purple', language: 'php' },
  sql: { icon: 'database', color: 'green', language: 'sql' },
  dockerfile: { icon: 'docker', color: 'blue', language: 'dockerfile' },
};

export const DEFAULT_FILE_EXTENSIONS = ['txt', 'md', 'js', 'ts', 'py', 'json', 'html', 'css'];

export const SUPPORTED_MARKDOWN_EXTENSIONS = ['md', 'markdown', 'mdown', 'mkd'];

export const SUPPORTED_JUPYTER_EXTENSIONS = ['ipynb'];

export const SUPPORTED_CODE_EXTENSIONS = [
  'js', 'jsx', 'ts', 'tsx', 'py', 'json', 'html', 'css', 'scss',
  'txt', 'yml', 'yaml', 'sh', 'bash', 'go', 'rs', 'java', 'cpp', 'c',
  'rb', 'php', 'sql', 'dockerfile', 'md', 'markdown'
];