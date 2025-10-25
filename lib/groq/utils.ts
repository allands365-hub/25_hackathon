import { groq, DEFAULT_MODEL, GROQ_MODELS } from './client';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

/**
 * Simple chat completion with Groq
 * @param messages - Array of chat messages
 * @param options - Optional configuration
 * @returns The AI response text
 */
export async function chat(
  messages: ChatCompletionMessageParam[],
  options: ChatOptions = {}
): Promise<string> {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 1024,
  } = options;

  const completion = await groq.chat.completions.create({
    messages,
    model,
    temperature,
    max_tokens: maxTokens,
  });

  return completion.choices[0]?.message?.content || '';
}

/**
 * Simple text generation with a single prompt
 * @param prompt - The user prompt
 * @param systemPrompt - Optional system prompt
 * @param options - Optional configuration
 * @returns The AI response text
 */
export async function generate(
  prompt: string,
  systemPrompt?: string,
  options: ChatOptions = {}
): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  messages.push({ role: 'user', content: prompt });

  return chat(messages, options);
}

/**
 * Streaming chat completion
 * @param messages - Array of chat messages
 * @param onChunk - Callback for each chunk
 * @param options - Optional configuration
 */
export async function chatStream(
  messages: ChatCompletionMessageParam[],
  onChunk: (chunk: string) => void,
  options: ChatOptions = {}
): Promise<void> {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 1024,
  } = options;

  const stream = await groq.chat.completions.create({
    messages,
    model,
    temperature,
    max_tokens: maxTokens,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      onChunk(content);
    }
  }
}

/**
 * JSON mode generation - ensures response is valid JSON
 * @param prompt - The user prompt
 * @param systemPrompt - Optional system prompt
 * @param options - Optional configuration
 * @returns Parsed JSON object
 */
export async function generateJSON<T = any>(
  prompt: string,
  systemPrompt?: string,
  options: ChatOptions = {}
): Promise<T> {
  const messages: ChatCompletionMessageParam[] = [];

  const enhancedSystemPrompt = systemPrompt
    ? `${systemPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation, just the JSON object.`
    : 'Respond ONLY with valid JSON. No markdown, no explanation, just the JSON object.';

  messages.push({ role: 'system', content: enhancedSystemPrompt });
  messages.push({ role: 'user', content: prompt });

  const response = await chat(messages, {
    ...options,
    temperature: options.temperature ?? 0.3, // Lower temperature for more consistent JSON
  });

  // Try to extract JSON from markdown code blocks if present
  const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                   response.match(/```\s*([\s\S]*?)\s*```/);

  const jsonStr = jsonMatch ? jsonMatch[1] : response;

  try {
    return JSON.parse(jsonStr.trim());
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Function calling / Tool use with Groq
 * Note: As of now, not all Groq models support function calling.
 * Check Groq documentation for the latest supported models.
 */
export async function chatWithTools(
  messages: ChatCompletionMessageParam[],
  tools: any[],
  options: ChatOptions = {}
): Promise<any> {
  const {
    model = GROQ_MODELS.LLAMA_3_1_70B, // Use a model that supports tools
    temperature = 0.7,
    maxTokens = 1024,
  } = options;

  const completion = await groq.chat.completions.create({
    messages,
    model,
    temperature,
    max_tokens: maxTokens,
    tools,
    tool_choice: 'auto',
  });

  return completion;
}

/**
 * Analyze an image using vision models
 * @param imageUrl - URL of the image to analyze
 * @param prompt - What you want to know about the image
 * @param options - Optional configuration
 * @returns The AI response about the image
 */
export async function analyzeImage(
  imageUrl: string,
  prompt: string = "What's in this image?",
  options: ChatOptions = {}
): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
    },
  ];

  return chat(messages, {
    ...options,
    model: options.model || GROQ_MODELS.LLAMA_3_2_11B_VISION,
  });
}
