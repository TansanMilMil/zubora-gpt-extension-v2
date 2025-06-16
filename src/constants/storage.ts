export const STORAGE_KEYS = {
  OPENAI_API_KEY: "openaiApiKey",
  PROMPT: "prompt",
} as const;

export type StorageKeys = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
