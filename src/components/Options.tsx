import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { STORAGE_KEYS } from "../constants/storage";
import { showToast } from "./Toast";

const Options: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  useEffect(() => {
    // APIキーの読み込み
    const loadApiKey = async () => {
      try {
        const { [STORAGE_KEYS.OPENAI_API_KEY]: openaiApiKey } =
          await chrome.storage.local.get(STORAGE_KEYS.OPENAI_API_KEY);
        if (openaiApiKey) {
          setApiKey(openaiApiKey);
        }
      } catch (error) {
        showToast("APIキーの読み込みに失敗しました", 2300, "error");
      }
    };

    // プロンプトの読み込み
    const loadPrompt = async () => {
      try {
        const { [STORAGE_KEYS.PROMPT]: savedPrompt } =
          await chrome.storage.local.get(STORAGE_KEYS.PROMPT);
        if (savedPrompt) {
          setPrompt(savedPrompt);
        }
      } catch (error) {
        showToast("プロンプトの読み込みに失敗しました", 2300, "error");
      }
    };

    loadApiKey();
    loadPrompt();
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
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

  const handleSavePrompt = async () => {
    try {
      await chrome.storage.local.set({ [STORAGE_KEYS.PROMPT]: prompt });
      showToast("プロンプトを保存しました", 2300, "success");
    } catch (error) {
      showToast("プロンプトの保存に失敗しました", 2300, "error");
    }
  };

  return (
    <div className="main-content">
      <h1>ずぼらGPT V2</h1>
      <p>
        ショートカットキーは
        <a
          href="vivaldi://extensions/shortcuts"
          target="_blank"
          rel="noopener noreferrer"
        >
          こちら
        </a>
        で設定できます。
      </p>

      <div className="settings-section">
        <h2>OpenAI API設定</h2>
        <label htmlFor="openai-api-key">OpenAI APIキー:</label>
        <br />
        <input
          type="password"
          id="openai-api-key"
          className="api-key-input"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <br />
        <button onClick={handleSaveApiKey}>APIキーを保存</button>
      </div>

      <hr />

      <div className="settings-section">
        <h2>プロンプト設定</h2>
        <label>プロンプト（選択テキストの前に付与されます）:</label>
        <br />
        <textarea
          id="prompt"
          className="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="char-count">{prompt.length}文字</div>
        <button onClick={handleSavePrompt}>保存</button>
      </div>
    </div>
  );
};

export const showOptions = () => {
  const container = document.createElement("div");
  container.id = "zubora-gpt-options";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<Options />);
};
