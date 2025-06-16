export const TEXTAREA_SELECTOR = "textarea";
export const INTERVAL_MS = 100;
export const INPUT_EVENT_NAME = "input";
export const ENTER_KEY_NAME = "Enter";
export const API_URL = "https://api.openai.com/v1/chat/completions";
export const CONTEXT_MENU_ID = "zubora-gpt";

export const CHATGPT_INTERACTION_ACTIONS = {
  INPUT_TO_CHATGPT: "inputToChatGPT",
  SHOW_LOADING: "showLoading",
  HIDE_LOADING: "hideLoading",
  SHOW_RESULT: "showResult",
  SHOW_ERROR: "showError",
  COPY_TEXT: "copyText",
} as const;

export type Action =
  (typeof CHATGPT_INTERACTION_ACTIONS)[keyof typeof CHATGPT_INTERACTION_ACTIONS];
