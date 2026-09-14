export type RevitTheme = 'dark' | 'light';

export type GreetingTone = 'friendly' | 'humorous' | 'bim_manager';

export interface PyRevitFile {
  name: string;
  path: string;
  language: 'python' | 'xml' | 'yaml' | 'markdown' | 'plaintext' | 'json';
  description: string;
  content: string;
}

export type ToolCategory = 'Personal' | 'Documentation' | 'Modeling' | 'QA_QC' | 'Management';

export type ButtonType = 'pushbutton' | 'pulldown' | 'smartbutton' | 'urlbutton';

export interface PyRevitToolFile {
  name: string;
  path: string;
  language: 'python' | 'xml' | 'yaml' | 'markdown' | 'plaintext' | 'json';
  description: string;
  content: string;
}

export interface PyRevitTool {
  id: string;
  name: string; // e.g. "ChaoAnhDong.pushbutton"
  title: string; // e.g. "Chào\nAnh Đông"
  icon: string; // Lucide icon name or emoji
  category: ToolCategory;
  author: string;
  description: string;
  tooltip: string;
  version: string;
  minRevit: string;
  maxRevit: string;
  extensionTab: string; // e.g. "BIMHanoi.tab"
  panel: string; // e.g. "Personal.panel"
  buttonType: ButtonType;
  xamlFileName: string; // name of the main XAML file to preview
  files: PyRevitToolFile[];
  updatedAt: string;
  isCustom?: boolean;
}

export interface RevitDocInfo {
  title: string;
  activeView: string;
  userName: string;
  revitVersion: string;
  warningsCount: number;
  sheetsCount: number;
  syncedTime: string;
}

export interface ConsoleLogItem {
  id: string;
  timestamp: string;
  type: 'info' | 'event' | 'alert' | 'warn' | 'error';
  message: string;
  details?: string;
}

export interface XamlNode {
  tag: string;
  attributes: Record<string, string>;
  children: (XamlNode | string)[];
}
