interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface RequestCache {
  [key: string]: {
    response: string;
    timestamp: number;
  };
}

class AIService {
  private apiKey: string;
  private baseURL: string;
  private model: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;
  private requestCache: RequestCache;
  private lastRequestTime: number;
  private minRequestInterval: number;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-3.5-turbo';
    this.timeout = 30000;
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.requestCache = {};
    this.lastRequestTime = 0;
    this.minRequestInterval = 2000; // 2 seconds between requests
  }

  async generateSuggestion(fieldType: string, context: string = ''): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const cacheKey = this.getCacheKey(fieldType, context);
    const cachedResponse = this.getCachedResponse(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    await this.enforceRateLimit();

    const prompt = this.buildPrompt(fieldType, context);

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.makeRequest(prompt);
        const result = response.choices[0].message.content.trim();
        
        this.cacheResponse(cacheKey, result);
        return result;
      } catch (error) {
        if (attempt === this.maxRetries) {
          throw this.handleError(error as Error, attempt);
        }
        
        await this.delay(this.retryDelay * attempt);
      }
    }

    throw new Error('Failed to generate suggestion after multiple attempts');
  }

  /**
   * Builds the prompt for the AI based on field type
   * @param fieldType - The type of field
   * @param context - Additional context
   * @returns The complete prompt
   */
  private buildPrompt(fieldType: string, context: string): string {
    const prompts: Record<string, string> = {
      financialSituation: `I am applying for social support assistance. Help me describe my current financial situation in a clear and honest way. Context: ${context}`,
      employmentCircumstances: `I am applying for social support assistance. Help me describe my employment circumstances and work situation. Context: ${context}`,
      reasonForApplying: `I am applying for social support assistance. Help me write a compelling reason for why I need this financial assistance. Context: ${context}`
    };

    return prompts[fieldType] || `Help me write about ${fieldType}. Context: ${context}`;
  }

  /**
   * Makes a request to the OpenAI API
   * @param prompt - The prompt to send
   * @returns API response
   */
  private async makeRequest(prompt: string): Promise<OpenAIResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that helps people write clear, honest, and compelling descriptions for social support applications. Keep responses concise but detailed enough to be meaningful.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private getCacheKey(fieldType: string, context: string): string {
    return `${fieldType}:${context}`;
  }

  private getCachedResponse(cacheKey: string): string | null {
    const cached = this.requestCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
      return cached.response;
    }
    return null;
  }

  private cacheResponse(cacheKey: string, response: string): void {
    this.requestCache[cacheKey] = {
      response,
      timestamp: Date.now()
    };
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const delayTime = this.minRequestInterval - timeSinceLastRequest;
      await this.delay(delayTime);
    }
    
    this.lastRequestTime = Date.now();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleError(error: Error, attempt: number): Error {
    console.error(`AI Service Error (Attempt ${attempt}):`, error);

    if (error.name === 'AbortError') {
      return new Error('Request timed out. Please try again.');
    }
    
    if (error.message.includes('401')) {
      return new Error('Invalid API key. Please check your OpenAI API key configuration.');
    }
    
    if (error.message.includes('429')) {
      return new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    
    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      return new Error('OpenAI service is temporarily unavailable. Please try again later.');
    }
    
    if (error.message.includes('400')) {
      return new Error('Invalid request. Please check your input and try again.');
    }
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new Error('Network error. Please check your internet connection and try again.');
    }
    
    return new Error(`Failed to generate suggestion after ${attempt} attempts. Please try again.`);
  }

  /**
   * Validates if the AI service is properly configured
   * @returns True if service is ready
   */
  isReady(): boolean {
    return !!this.apiKey;
  }
}

export default new AIService();
