export interface Message {
  action: string;
  text?: string;
  result?: string;
  prompt?: string;
  error?: string;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
