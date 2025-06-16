import { CHATGPT_INTERACTION_ACTIONS } from "../constants";
import { showResultPopup } from "../components/Popup";
import {
  showLoadingSpinner,
  hideLoadingSpinner,
} from "../components/LoadingSpinner";
import { showToast } from "../components/Toast";
import { Message } from "../types";
import "../styles/popup.css";
import "../styles/animations.css";

// メッセージハンドラ
const handleMessage = async (message: Message): Promise<void> => {
  switch (message.action) {
    case CHATGPT_INTERACTION_ACTIONS.INPUT_TO_CHATGPT:
      if (message.text) {
        await navigator.clipboard.writeText(message.text);
        showToast("コピーしました");
      }
      break;
    case CHATGPT_INTERACTION_ACTIONS.SHOW_RESULT:
      if (message.result && message.prompt) {
        showResultPopup(message.result, message.prompt);
      }
      break;
    case CHATGPT_INTERACTION_ACTIONS.SHOW_ERROR:
      if (message.error) {
        showToast(message.error);
      }
      break;
    case CHATGPT_INTERACTION_ACTIONS.SHOW_LOADING:
      showLoadingSpinner();
      break;
    case CHATGPT_INTERACTION_ACTIONS.HIDE_LOADING:
      hideLoadingSpinner();
      break;
  }
};

// 初期化
console.log("content script loaded");

chrome.runtime.sendMessage({ action: "contentScriptReady" });

// メッセージリスナーの設定
chrome.runtime.onMessage.addListener((message: Message) => {
  handleMessage(message);
});
