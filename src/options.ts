import {
  STORAGE_KEY_PROMPT,
  SAVE_BUTTON_ID,
  STATUS_ID,
  STATUS_TIMEOUT_MS,
  STORAGE_KEY_AI_SERVICES,
  STORAGE_KEY_DEFAULT_AI,
  AI_STATUS_ID,
} from "./constants.js";
import { AIService } from "./types.js";
import { showToast } from "./toast.js";
// import { STORAGE_KEY_PROMPT, SAVE_BUTTON_ID, STATUS_ID, STATUS_TIMEOUT_MS } from "./constants.js";

function renderAIServiceList(services: AIService[]): void {
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
}

function renderAIDefaultSelect(services: AIService[], selected?: string): void {
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
}

function showAIStatus(msg: string): void {
  // 既存のトーストがあれば消す
  const oldToast = document.getElementById("zubora-gpt-toast");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.id = "zubora-gpt-toast";
  toast.textContent = msg;
  toast.style.cssText = `
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
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 1800);
}

document.addEventListener("DOMContentLoaded", () => {
  initPromptInput();
  initApiKeyInput();
  bindSavePromptButton();
  bindSaveApiKeyButton();
});

function initPromptInput() {
  chrome.storage.sync.get({ prompt: "" }, (data: { prompt: string }) => {
    const promptInput = document.getElementById(
      "prompt"
    ) as HTMLTextAreaElement | null;
    if (promptInput) promptInput.value = data.prompt;
  });
}

function initApiKeyInput() {
  chrome.storage.sync.get(
    { openai_api_key: "" },
    (data: { openai_api_key: string }) => {
      const apiKeyInput = document.getElementById(
        "openai-api-key"
      ) as HTMLInputElement | null;
      if (apiKeyInput) apiKeyInput.value = data.openai_api_key;
    }
  );
}

function bindSavePromptButton() {
  const saveBtn = document.getElementById("save") as HTMLButtonElement | null;
  if (saveBtn) {
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
  }
}

function bindSaveApiKeyButton() {
  const saveBtn = document.getElementById(
    "save-api-key"
  ) as HTMLButtonElement | null;
  if (saveBtn) {
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
  }
}
