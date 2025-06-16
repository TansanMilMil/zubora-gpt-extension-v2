import { callOpenAI } from "../services/openai";
import { Message } from "../types";
import { CHATGPT_INTERACTION_ACTIONS, CONTEXT_MENU_ID } from "../constants";

// コンテキストメニューの作成
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "選択テキストをAIサービスに送信",
    contexts: ["selection"],
  });
});

// 拡張機能アイコンのクリックイベント
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// コンテキストメニューのクリックイベント
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID && tab?.id) {
    const selectedText = info.selectionText;
    if (!selectedText) return;

    try {
      // ローディング表示
      await chrome.tabs.sendMessage(tab.id, {
        action: CHATGPT_INTERACTION_ACTIONS.SHOW_LOADING,
      });

      // OpenAI APIを呼び出し
      const result = await callOpenAI(selectedText);

      // 結果を表示
      await chrome.tabs.sendMessage(tab.id, {
        action: CHATGPT_INTERACTION_ACTIONS.SHOW_RESULT,
        result,
        prompt: selectedText,
      });
    } catch (error) {
      // エラー表示
      await chrome.tabs.sendMessage(tab.id, {
        action: CHATGPT_INTERACTION_ACTIONS.SHOW_ERROR,
        error: error instanceof Error ? error.message : "エラーが発生しました",
      });
    } finally {
      // ローディング非表示
      await chrome.tabs.sendMessage(tab.id, {
        action: CHATGPT_INTERACTION_ACTIONS.HIDE_LOADING,
      });
    }
  }
});

// キーボードショートカット
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "run-chatgpt") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) return;

    // 選択テキストを取得
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() || "",
    });

    if (!result) return;

    try {
      // ローディング表示
      await chrome.tabs.sendMessage(tab.id, {
        action: CHATGPT_INTERACTION_ACTIONS.SHOW_LOADING,
      });

      // OpenAI APIを呼び出し
      const response = await callOpenAI(result);

      // 結果を表示
      await chrome.tabs.sendMessage(tab.id, {
        action: CHATGPT_INTERACTION_ACTIONS.SHOW_RESULT,
        result: response,
        prompt: result,
      });
    } catch (error) {
      // エラー表示
      await chrome.tabs.sendMessage(tab.id, {
        action: CHATGPT_INTERACTION_ACTIONS.SHOW_ERROR,
        error: error instanceof Error ? error.message : "エラーが発生しました",
      });
    } finally {
      // ローディング非表示
      await chrome.tabs.sendMessage(tab.id, {
        action: CHATGPT_INTERACTION_ACTIONS.HIDE_LOADING,
      });
    }
  }
});
