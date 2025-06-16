// OpenAI APIの設定
const OPENAI_CONFIG = {
  maxPromptLength: 1000,
  apiEndpoint: "https://api.openai.com/v1/chat/completions",
  model: "gpt-3.5-turbo",
  temperature: 0.7,
} as const;

// OpenAI APIのレスポンス型
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// OpenAI APIを呼び出す
export const callOpenAI = async (
  prompt: string,
  apiKey: string
): Promise<string> => {
  if (prompt.length > OPENAI_CONFIG.maxPromptLength) {
    throw new Error(
      `プロンプトは${OPENAI_CONFIG.maxPromptLength}文字以内にしてください`
    );
  }

  try {
    const response = await fetch(OPENAI_CONFIG.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: OPENAI_CONFIG.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = (await response.json()) as OpenAIResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API call failed:", error);
    throw error;
  }
};
