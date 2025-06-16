import {
  ACTION_INPUT_TO_CHATGPT,
  TEXTAREA_SELECTOR,
  INTERVAL_MS,
  INPUT_EVENT_NAME,
  ENTER_KEY_NAME,
} from "./constants.js";
import {
  showResultPopup,
  showLoadingSpinner,
  hideLoadingSpinner,
} from "./popup.js";
import { showToast } from "./toast.js";
import { Message } from "./types.js";

// アニメーション用CSSの注入
const injectAnimationStyle = (): void => {
  if (!document.getElementById("zubora-gpt-msg-anim")) {
    const style = document.createElement("style");
    style.id = "zubora-gpt-msg-anim";
    style.textContent = `
      @keyframes zubora-gpt-msg-slideup {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
};

// メッセージハンドラ
const handleMessage = async (message: Message): Promise<void> => {
  switch (message.action) {
    case ACTION_INPUT_TO_CHATGPT:
      if (message.text) {
        await navigator.clipboard.writeText(message.text);
        injectAnimationStyle();
        showToast("コピーしました");
      }
      break;
    case "showResult":
      if (message.result && message.prompt) {
        showResultPopup(message.result, message.prompt);
      }
      break;
    case "showError":
      if (message.error) {
        showToast(message.error);
      }
      break;
    case "showLoading":
      showLoadingSpinner();
      break;
    case "hideLoading":
      hideLoadingSpinner();
      break;
  }
};

// 初期化
console.log("content script loaded");
// import { ACTION_INPUT_TO_CHATGPT, TEXTAREA_SELECTOR, INTERVAL_MS, INPUT_EVENT_NAME, ENTER_KEY_NAME } from "./constants.js";

chrome.runtime.sendMessage({ action: "contentScriptReady" });

// メッセージリスナーの設定
chrome.runtime.onMessage.addListener((message: Message) => {
  handleMessage(message);
});
