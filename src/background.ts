import { callOpenAI } from "./openai.js";
import { CONTEXT_MENU_ID, CHATGPT_URL } from "./constants.js";
import { Message, StorageData, ChromeTab, ChromeOnClickData } from "./types.js";

// 右クリックメニューの作成
const recreateContextMenus = (): void => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: `OpenAIでサクッと質問`,
      contexts: ["selection"],
    });
  });
};

// OpenAI APIを呼び出して結果を表示する関数
const processWithOpenAI = async (
  query: string,
  tabId: number
): Promise<void> => {
  try {
    await sendMessage(tabId, { action: "showLoading" });
    const { openai_api_key: apiKey } = (await chrome.storage.sync.get({
      openai_api_key: "",
    })) as StorageData;

    if (!apiKey) {
      await sendMessage(tabId, { action: "hideLoading" });
      await sendMessage(tabId, {
        action: "showError",
        error:
          "OpenAI APIキーが設定されていません。オプション画面で設定してください。",
      });
      return;
    }

    try {
      const result = await callOpenAI(query, apiKey);
      await sendMessage(tabId, {
        action: "showResult",
        result,
        prompt: query,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      await sendMessage(tabId, {
        action: "showError",
        error: msg,
      });
    } finally {
      await sendMessage(tabId, { action: "hideLoading" });
    }
  } catch (error) {
    await sendMessage(tabId, { action: "hideLoading" });
    const msg = error instanceof Error ? error.message : String(error);
    await sendMessage(tabId, {
      action: "showError",
      error: msg,
    });
  }
};

// メッセージ送信のヘルパー関数
const sendMessage = async (tabId: number, message: Message): Promise<void> => {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, resolve);
  });
};

// イベントリスナーの設定
chrome.runtime.onInstalled.addListener(recreateContextMenus);

chrome.contextMenus.onClicked.addListener(
  async (info: ChromeOnClickData, tab?: ChromeTab) => {
    if (!tab?.id) return;

    if (info.menuItemId === CONTEXT_MENU_ID && info.selectionText) {
      const { prompt = "" } = (await chrome.storage.sync.get({
        prompt: "",
      })) as StorageData;
      const query = prompt + info.selectionText;
      await processWithOpenAI(query, tab.id);
    }
  }
);

// ショートカットキー対応
chrome.commands.onCommand.addListener(
  async (command: string, tab?: ChromeTab) => {
    if (command === "run-chatgpt" && tab?.id) {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection()?.toString() ?? "",
      });

      const selectedText = results[0]?.result;
      if (!selectedText) return;

      const { prompt = "" } = (await chrome.storage.sync.get({
        prompt: "",
      })) as StorageData;
      const query = prompt + selectedText;
      await processWithOpenAI(query, tab.id);
    }
  }
);

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
});
