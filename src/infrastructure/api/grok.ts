interface GrokCompletionRequest {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  model?: string;
  temperature?: number;
  signal?: AbortSignal;
}

interface GrokCompletionResponse {
  choices: { message: { content: string } }[];
}

export class GrokClient {
  private apiKey: string;
  private baseUrl: string = "https://api.grok.x.ai/v1/chat/completions"; // Hypothetical URL, adjust if needed

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chatCompletion(request: GrokCompletionRequest): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || "grok-1", // Default model
          temperature: request.temperature || 0.7,
          messages: request.messages,
        }),
        signal: request.signal,
      });

      if (!response.ok) {
        throw new Error(`Grok API Error: ${response.status} ${response.statusText}`);
      }

      const data: GrokCompletionResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Grok API Request Failed:", error);
      throw error;
    }
  }
}

// Singleton instance for server-side usage
export const grokClient = new GrokClient(process.env.GROK_API_KEY || "");
