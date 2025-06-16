import { showToast } from "./toast.js";

let zuboraBodyOverflowBackup: string | null = null;

export function showLoadingSpinner() {
  if (document.getElementById("zubora-gpt-loading")) return;
  const overlay = document.createElement("div");
  overlay.id = "zubora-gpt-loading";
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(255,255,255,0.3);
    z-index: 9998;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  const spinner = document.createElement("div");
  spinner.style.cssText = `
    border: 4px solid #e0e0e0;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    animation: zubora-spin 1s linear infinite;
    opacity: 0.7;
  `;
  overlay.appendChild(spinner);
  document.body.appendChild(overlay);

  // スピナー用アニメーションを追加
  if (!document.getElementById("zubora-gpt-spinner-style")) {
    const style = document.createElement("style");
    style.id = "zubora-gpt-spinner-style";
    style.textContent = `@keyframes zubora-spin { 0% { transform: rotate(0deg);} 100% {transform: rotate(360deg);} }`;
    document.head.appendChild(style);
  }
}

export function hideLoadingSpinner() {
  const overlay = document.getElementById("zubora-gpt-loading");
  if (overlay) overlay.remove();
}

function lockBodyScroll() {
  if (zuboraBodyOverflowBackup === null) {
    zuboraBodyOverflowBackup = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
}

function unlockBodyScroll() {
  if (zuboraBodyOverflowBackup !== null) {
    document.body.style.overflow = zuboraBodyOverflowBackup;
    zuboraBodyOverflowBackup = null;
  }
}

export function showResultPopup(result: string, prompt?: string) {
  // 既存のポップアップがあれば削除
  const existingPopup = document.getElementById("zubora-gpt-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // ポップアップの作成
  const popup = document.createElement("div");
  popup.id = "zubora-gpt-popup";
  popup.className = "zubora-gpt-popup";

  // タイトル
  const titleDiv = document.createElement("div");
  titleDiv.id = "zubora-gpt-title";
  titleDiv.className = "zubora-gpt-title";
  titleDiv.textContent = "AI回答";
  popup.appendChild(titleDiv);

  // バツボタン
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "&#10005;"; // ×
  closeBtn.title = "閉じる";
  closeBtn.id = "zubora-gpt-close";
  closeBtn.className = "zubora-gpt-close";
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    popup.remove();
  };
  popup.appendChild(closeBtn);

  // プロンプトを表示
  if (prompt) {
    const promptDiv = document.createElement("div");
    promptDiv.className = "zubora-gpt-prompt";
    promptDiv.textContent = prompt;
    popup.appendChild(promptDiv);
  }

  // 結果テキストの表示
  const resultText = document.createElement("div");
  resultText.id = "zubora-gpt-result";
  resultText.className = "zubora-gpt-result";
  resultText.textContent = result;
  popup.appendChild(resultText);

  // DOMに追加
  document.body.appendChild(popup);
}
