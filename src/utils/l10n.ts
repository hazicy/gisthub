import * as vscode from 'vscode';

/**
 * 本地化工具类
 * 提供 l10n 字符串获取和格式化功能
 */
export class L10n {
  /**
   * 获取本地化字符串
   * @param key 字符串 key（不含 gisthub. 前缀）
   * @param args 格式化为 {0}, {1} 等占位符的参数
   */
  static t(key: string, ...args: any[]): string {
    const fullKey = `gisthub.${key}`;
    let message = vscode.l10n.t(fullKey);

    // 应用占位符替换
    args.forEach((arg, index) => {
      message = message.replace(new RegExp(`\\{${index}\\}`, 'g'), String(arg));
    });

    return message;
  }
}
