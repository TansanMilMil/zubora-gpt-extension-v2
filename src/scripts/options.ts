import { STORAGE_KEYS } from "../constants/storage";
import { showToast } from "../components/Toast";

// APIキーの保存
const saveApiKey = async (): Promise<void> => {
  const apiKeyInput = document.getElementById(
    "openai-api-key"
  ) as HTMLInputElement;
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    showToast("APIキーを入力してください", 2300, "error");
    return;
  }

  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.OPENAI_API_KEY]: apiKey });
    showToast("APIキーを保存しました", 2300, "success");
  } catch (error) {
    showToast("APIキーの保存に失敗しました", 2300, "error");
  }
};

// APIキーの読み込み
const loadApiKey = async (): Promise<void> => {
  try {
    const { [STORAGE_KEYS.OPENAI_API_KEY]: openaiApiKey } =
      await chrome.storage.local.get(STORAGE_KEYS.OPENAI_API_KEY);
    if (openaiApiKey) {
      const apiKeyInput = document.getElementById(
        "openai-api-key"
      ) as HTMLInputElement;
      apiKeyInput.value = openaiApiKey;
    }
  } catch (error) {
    showToast("APIキーの読み込みに失敗しました", 2300, "error");
  }
};

// プロンプトの保存
const savePrompt = async (): Promise<void> => {
  const promptInput = document.getElementById("prompt") as HTMLTextAreaElement;
  const prompt = promptInput.value.trim();

  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.PROMPT]: prompt });
    showToast("プロンプトを保存しました", 2300, "success");
  } catch (error) {
    showToast("プロンプトの保存に失敗しました", 2300, "error");
  }
};

// プロンプトの読み込み
const loadPrompt = async (): Promise<void> => {
  try {
    const { [STORAGE_KEYS.PROMPT]: prompt } = await chrome.storage.local.get(
      STORAGE_KEYS.PROMPT
    );
    if (prompt) {
      const promptInput = document.getElementById(
        "prompt"
      ) as HTMLTextAreaElement;
      promptInput.value = prompt;
    }
  } catch (error) {
    showToast("プロンプトの読み込みに失敗しました", 2300, "error");
  }
};

// 初期化
document.addEventListener("DOMContentLoaded", () => {
  // APIキーの読み込み
  loadApiKey();
  // プロンプトの読み込み
  loadPrompt();

  // APIキー保存ボタンのクリックイベント
  const saveApiKeyButton = document.getElementById("save-api-key");
  if (saveApiKeyButton) {
    saveApiKeyButton.addEventListener("click", saveApiKey);
  }

  // プロンプト保存ボタンのクリックイベント
  const savePromptButton = document.getElementById("save");
  if (savePromptButton) {
    savePromptButton.addEventListener("click", savePrompt);
  }
});
