export type AIService = { name: string; url: string };

export type MessageAction =
  | "showLoading"
  | "hideLoading"
  | "showError"
  | "showResult"
  | "inputToChatGPT"
  | "contentScriptReady";

export interface Message {
  action: MessageAction;
  error?: string;
  result?: string;
  prompt?: string;
  text?: string;
}

export interface StorageData {
  openai_api_key: string;
  prompt: string;
}

export interface TabInfo {
  id: number;
  url?: string;
}

export interface ContextMenuInfo {
  menuItemId: string;
  selectionText?: string;
  tab?: TabInfo;
}

// Chrome拡張機能の型定義を使用
export type ChromeTab = chrome.tabs.Tab;
export type ChromeOnClickData = chrome.contextMenus.OnClickData;
