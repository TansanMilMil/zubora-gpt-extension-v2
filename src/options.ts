import {
  STORAGE_KEY_PROMPT,
  SAVE_BUTTON_ID,
  STATUS_ID,
  STATUS_TIMEOUT_MS,
  STORAGE_KEY_AI_SERVICES,
  STORAGE_KEY_DEFAULT_AI,
  AI_STATUS_ID,
} from "./constants.js";
import { AIService, StorageData } from "./types.js";
import { showToast } from "./toast.js";
// import { STORAGE_KEY_PROMPT, SAVE_BUTTON_ID, STATUS_ID, STATUS_TIMEOUT_MS } from "./constants.js";

// スタイル定義
const STYLES = {
  toast: `
    position: fixed;
    top: 32px;
    right: 32px;
    background: #222;
    color: #fff;
    padding: 14px 28px;
    border-radius: 8px;
    font-size: 15px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.18);
    z-index: 99999;
    opacity: 0.96;
    transition: opacity 0.3s;
    pointer-events: none;
  `,
} as const;

// AIサービスのリストをレンダリング
const renderAIServiceList = (services: AIService[]): void => {
  const list = document.getElementById(
    "ai-service-list"
  ) as HTMLUListElement | null;
  if (!list) return;

  list.innerHTML = "";
  services.forEach((service: AIService, idx: number) => {
    const li = document.createElement("li");
    li.textContent = `${service.name}（${service.url}）`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.onclick = () => {
      services.splice(idx, 1);
      chrome.storage.sync.set({ [STORAGE_KEY_AI_SERVICES]: services }, () => {
        renderAIServiceList(services);
        renderAIDefaultSelect(services, undefined);
        showAIStatus("削除しました");
      });
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });
};

// デフォルトAIサービスの選択肢をレンダリング
const renderAIDefaultSelect = (
  services: AIService[],
  selected?: string
): void => {
  const select = document.getElementById(
    "default-ai-service"
  ) as HTMLSelectElement | null;
  if (!select) return;

  select.innerHTML = "";
  services.forEach((service: AIService) => {
    const opt = document.createElement("option");
    opt.value = service.url;
    opt.textContent = service.name;
    if (selected && selected === service.url) opt.selected = true;
    select.appendChild(opt);
  });
};

// ステータスメッセージの表示
const showAIStatus = (msg: string): void => {
  const oldToast = document.getElementById("zubora-gpt-toast");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.id = "zubora-gpt-toast";
  toast.textContent = msg;
  toast.style.cssText = STYLES.toast;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 1800);
};

// 文字数の更新
const updateCharCount = (text: string): void => {
  const charCountElement = document.getElementById("prompt-char-count");
  if (!charCountElement) return;

  const count = text.length;
  const maxCount = 1000;
  const remaining = maxCount - count;
  charCountElement.textContent = `${count}文字 / ${maxCount}文字 (残り${remaining}文字)`;
  charCountElement.style.color = count > maxCount ? "#e74c3c" : "#666";
};

// プロンプト入力の初期化
const initPromptInput = (): void => {
  chrome.storage.sync.get({ prompt: "" }, (data: StorageData) => {
    const promptInput = document.getElementById(
      "prompt"
    ) as HTMLTextAreaElement | null;
    if (!promptInput) return;

    promptInput.value = data.prompt;
    updateCharCount(promptInput.value);

    promptInput.addEventListener("input", (e) => {
      const target = e.target as HTMLTextAreaElement;
      updateCharCount(target.value);
    });
  });
};

// APIキー入力の初期化
const initApiKeyInput = (): void => {
  chrome.storage.sync.get({ openai_api_key: "" }, (data: StorageData) => {
    const apiKeyInput = document.getElementById(
      "openai-api-key"
    ) as HTMLInputElement | null;
    if (apiKeyInput) apiKeyInput.value = data.openai_api_key;
  });
};

// プロンプト保存ボタンのバインド
const bindSavePromptButton = (): void => {
  const saveBtn = document.getElementById("save") as HTMLButtonElement | null;
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    const promptInput = document.getElementById(
      "prompt"
    ) as HTMLTextAreaElement | null;
    if (!promptInput) return;

    const prompt = promptInput.value;
    chrome.storage.sync.set({ prompt }, () => {
      showAIStatus("保存しました");
    });
  });
};

// APIキー保存ボタンのバインド
const bindSaveApiKeyButton = (): void => {
  const saveBtn = document.getElementById(
    "save-api-key"
  ) as HTMLButtonElement | null;
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    const apiKeyInput = document.getElementById(
      "openai-api-key"
    ) as HTMLInputElement | null;
    if (!apiKeyInput) return;

    const apiKey = apiKeyInput.value;
    chrome.storage.sync.set({ openai_api_key: apiKey }, () => {
      showAIStatus("APIキーを保存しました");
    });
  });
};

// 初期化
document.addEventListener("DOMContentLoaded", () => {
  initPromptInput();
  initApiKeyInput();
  bindSavePromptButton();
  bindSaveApiKeyButton();
});
