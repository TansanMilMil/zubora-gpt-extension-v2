import { showToast } from "./toast.js";

// スタイル定義
const STYLES = {
  overlay: `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(255,255,255,0.3);
    z-index: 9998;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  spinner: `
    border: 4px solid #e0e0e0;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    animation: zubora-spin 1s linear infinite;
    opacity: 0.7;
  `,
  spinnerAnimation: `
    @keyframes zubora-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
} as const;

let zuboraBodyOverflowBackup: string | null = null;

// スピナー用アニメーションの注入
const injectSpinnerStyle = (): void => {
  if (!document.getElementById("zubora-gpt-spinner-style")) {
    const style = document.createElement("style");
    style.id = "zubora-gpt-spinner-style";
    style.textContent = STYLES.spinnerAnimation;
    document.head.appendChild(style);
  }
};

// ローディングスピナーの表示
export const showLoadingSpinner = (): void => {
  if (document.getElementById("zubora-gpt-loading")) return;

  const overlay = document.createElement("div");
  overlay.id = "zubora-gpt-loading";
  overlay.style.cssText = STYLES.overlay;

  const spinner = document.createElement("div");
  spinner.style.cssText = STYLES.spinner;
  overlay.appendChild(spinner);
  document.body.appendChild(overlay);

  injectSpinnerStyle();
};

// ローディングスピナーの非表示
export const hideLoadingSpinner = (): void => {
  const overlay = document.getElementById("zubora-gpt-loading");
  if (overlay) overlay.remove();
};

// スクロールのロック
const lockBodyScroll = (): void => {
  if (zuboraBodyOverflowBackup === null) {
    zuboraBodyOverflowBackup = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
};

// スクロールのアンロック
const unlockBodyScroll = (): void => {
  if (zuboraBodyOverflowBackup !== null) {
    document.body.style.overflow = zuboraBodyOverflowBackup;
    zuboraBodyOverflowBackup = null;
  }
};

// ポップアップの作成
const createPopupElement = (): HTMLDivElement => {
  const popup = document.createElement("div");
  popup.id = "zubora-gpt-popup";
  popup.className = "zubora-gpt-popup";
  return popup;
};

// タイトルの作成
const createTitleElement = (): HTMLDivElement => {
  const titleDiv = document.createElement("div");
  titleDiv.id = "zubora-gpt-title";
  titleDiv.className = "zubora-gpt-title";
  titleDiv.textContent = "AI回答";
  return titleDiv;
};

// 閉じるボタンの作成
const createCloseButton = (popup: HTMLDivElement): HTMLButtonElement => {
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "&#10005;"; // ×
  closeBtn.title = "閉じる";
  closeBtn.id = "zubora-gpt-close";
  closeBtn.className = "zubora-gpt-close";
  closeBtn.onclick = (e: MouseEvent) => {
    e.stopPropagation();
    popup.remove();
    unlockBodyScroll();
  };
  return closeBtn;
};

// プロンプトの作成
const createPromptElement = (prompt: string): HTMLDivElement => {
  const promptDiv = document.createElement("div");
  promptDiv.className = "zubora-gpt-prompt";
  promptDiv.textContent = prompt;
  return promptDiv;
};

// 結果テキストの作成
const createResultElement = (result: string): HTMLDivElement => {
  const resultText = document.createElement("div");
  resultText.id = "zubora-gpt-result";
  resultText.className = "zubora-gpt-result";
  resultText.textContent = result;
  return resultText;
};

// 結果ポップアップの表示
export const showResultPopup = (result: string, prompt?: string): void => {
  // 既存のポップアップがあれば削除
  const existingPopup = document.getElementById("zubora-gpt-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = createPopupElement();
  popup.appendChild(createTitleElement());
  popup.appendChild(createCloseButton(popup));

  if (prompt) {
    popup.appendChild(createPromptElement(prompt));
  }

  popup.appendChild(createResultElement(result));
  document.body.appendChild(popup);
  lockBodyScroll();
};
