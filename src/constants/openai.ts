export const OPENAI_MODELS = {
  GPT_3_5_TURBO: "gpt-3.5-turbo",
} as const;

export type OpenAIModel = (typeof OPENAI_MODELS)[keyof typeof OPENAI_MODELS];

export const OPENAI_ROLES = {
  SYSTEM: "system",
  USER: "user",
  ASSISTANT: "assistant",
} as const;

export type OpenAIRole = (typeof OPENAI_ROLES)[keyof typeof OPENAI_ROLES];
