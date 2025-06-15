import { callOpenAI } from "./openai.js";
import { CONTEXT_MENU_ID, CHATGPT_URL } from "./constants.js";

// 右クリックメニューの作成
function recreateContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: `OpenAIでサクッと質問`,
      contexts: ["selection"],
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  recreateContextMenus();
});

// OpenAI APIを呼び出して結果を表示する関数
async function processWithOpenAI(query: string, tabId: number) {
  try {
    chrome.tabs.sendMessage(tabId, { action: "showLoading" });
    chrome.storage.sync.get({ openai_api_key: "" }, async (data) => {
      const apiKey = data.openai_api_key;
      if (!apiKey) {
        chrome.tabs.sendMessage(tabId, { action: "hideLoading" });
        chrome.tabs.sendMessage(tabId, {
          action: "showError",
          error:
            "OpenAI APIキーが設定されていません。オプション画面で設定してください。",
        });
        return;
      }
      try {
        const result = await callOpenAI(query, apiKey);
        chrome.tabs.sendMessage(tabId, {
          action: "showResult",
          result: result,
        });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        chrome.tabs.sendMessage(tabId, {
          action: "showError",
          error: "APIの呼び出しに失敗しました: " + msg,
        });
      } finally {
        chrome.tabs.sendMessage(tabId, { action: "hideLoading" });
      }
    });
  } catch (error) {
    chrome.tabs.sendMessage(tabId, { action: "hideLoading" });
    const msg = error instanceof Error ? error.message : String(error);
    chrome.tabs.sendMessage(tabId, {
      action: "showError",
      error: "APIの呼び出しに失敗しました: " + msg,
    });
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || typeof tab.id !== "number") return;
  const tabId = tab.id;
  const menuItemId = info.menuItemId as string;
  if (menuItemId === CONTEXT_MENU_ID) {
    const selectedText = info.selectionText as string;
    chrome.storage.sync.get({ prompt: "" }, (data) => {
      const prompt = data.prompt || "";
      const query = prompt + selectedText;
      processWithOpenAI(query, tabId);
    });
  }
});

// ショートカットキー対応
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "run-chatgpt" && tab && typeof tab.id === "number") {
    const tabId = tab.id;
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => window.getSelection()?.toString() ?? "",
      },
      (results) => {
        if (!results || !results[0]) return;
        const selectedText = results[0].result;
        if (!selectedText) return;
        chrome.storage.sync.get({ prompt: "" }, (data) => {
          const prompt = data.prompt || "";
          const query = prompt + selectedText;
          processWithOpenAI(query, tabId);
        });
      }
    );
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
});
