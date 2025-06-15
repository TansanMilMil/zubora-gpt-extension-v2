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

export function showResultPopup(result: string) {
  // 既存のポップアップがあれば削除
  const existingPopup = document.getElementById("zubora-gpt-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // アニメーション用styleを追加（なければ）
  if (!document.getElementById("zubora-gpt-popup-anim-style")) {
    const style = document.createElement("style");
    style.id = "zubora-gpt-popup-anim-style";
    style.textContent = `
      @keyframes zubora-gpt-popup-in {
        0% { opacity: 0; transform: scale(0.96) translate(-50%, -50%); }
        100% { opacity: 1; transform: scale(1) translate(-50%, -50%); }
      }
    `;
    document.head.appendChild(style);
  }

  // ポップアップの作成
  const popup = document.createElement("div");
  popup.id = "zubora-gpt-popup";
  popup.style.cssText = `
    position: fixed;
    right: 8px;
    bottom: 8px;
    background: #fff;
    padding: 20px 12px 12px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px 0 rgba(0,0,0,0.22), 0 1.5px 8px 0 rgba(0,0,0,0.10);
    z-index: 10000;
    width: 420px;
    box-sizing: border-box;
    font-family: 'Segoe UI', 'Meiryo', 'sans-serif';
    color: #222;
    line-height: 1.7;
    font-size: 16px;
    letter-spacing: 0.01em;
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    border: none;
    opacity: 0;
    animation: zubora-gpt-popup-in 0.18s cubic-bezier(.4,1.4,.6,1) forwards;
  `;

  // タイトル
  const titleDiv = document.createElement("div");
  titleDiv.id = "zubora-gpt-title";
  titleDiv.textContent = "AI回答";
  titleDiv.style.cssText = `
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 6px;
    color: #888;
    letter-spacing: 0.01em;
    text-align: left;
    padding-right: 32px;
  `;
  popup.appendChild(titleDiv);

  // バツボタン
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "&#10005;"; // ×
  closeBtn.title = "閉じる";
  closeBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 14px;
    background: transparent;
    border: none;
    color: #888;
    font-size: 22px;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    transition: color 0.2s;
    z-index: 10001;
    border-radius: 50%;
  `;
  closeBtn.onmouseover = () => (closeBtn.style.color = "#007bff");
  closeBtn.onmouseout = () => (closeBtn.style.color = "#888");
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    popup.remove();
  };
  popup.appendChild(closeBtn);

  // 結果テキストの表示
  const resultText = document.createElement("div");
  resultText.id = "zubora-gpt-result";
  resultText.style.cssText = `
    margin-bottom: 4px;
    color: #222;
    font-size: 14px;
    word-break: break-word;
    white-space: pre-wrap;
    min-height: 32px;
  `;
  resultText.textContent = result;
  popup.appendChild(resultText);

  // DOMに追加
  document.body.appendChild(popup);
}
