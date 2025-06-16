import { OpenAIResponse } from "../types";
import { STORAGE_KEYS } from "../constants/storage";
import { OPENAI_MODELS, OPENAI_ROLES } from "../constants/openai";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const callOpenAI = async (prompt: string): Promise<string> => {
  const storage = await chrome.storage.local.get([
    STORAGE_KEYS.OPENAI_API_KEY,
    STORAGE_KEYS.PROMPT,
  ]);

  if (!storage[STORAGE_KEYS.OPENAI_API_KEY]) {
    throw new Error("APIキーが設定されていません");
  }

  // プロンプトの取得と付与
  const prefixPrompt = storage[STORAGE_KEYS.PROMPT] || "";
  const fullPrompt = prefixPrompt ? `${prefixPrompt}\n${prompt}` : prompt;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storage[STORAGE_KEYS.OPENAI_API_KEY]}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODELS.GPT_3_5_TURBO,
      messages: [
        {
          role: OPENAI_ROLES.SYSTEM,
          content: "あなたは親切なアシスタントです。",
        },
        {
          role: OPENAI_ROLES.USER,
          content: fullPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("APIリクエストに失敗しました");
  }

  const data: OpenAIResponse = await response.json();
  return data.choices[0].message.content;
};
