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

console.log("content script loaded");
// import { ACTION_INPUT_TO_CHATGPT, TEXTAREA_SELECTOR, INTERVAL_MS, INPUT_EVENT_NAME, ENTER_KEY_NAME } from "./constants.js";

chrome.runtime.sendMessage({ action: "contentScriptReady" });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === ACTION_INPUT_TO_CHATGPT) {
    const inputText = message.text;
    // クリップボードにコピー
    navigator.clipboard.writeText(inputText).then(() => {
      // アニメーション用CSSを1度だけ注入
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
      showToast("コピーしました");
    });
  } else if (message.action === "showResult") {
    showResultPopup(message.result, message.prompt);
  } else if (message.action === "showError") {
    showToast(message.error);
  } else if (message.action === "showLoading") {
    showLoadingSpinner();
  } else if (message.action === "hideLoading") {
    hideLoadingSpinner();
  }
});
