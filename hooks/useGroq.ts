import { useState, useCallback } from 'react';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

interface UseGroqChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface UseGroqChatResult {
  messages: ChatCompletionMessageParam[];
  response: string | null;
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for chat conversations with Groq
 */
export function useGroqChat(
  systemPrompt?: string,
  options: UseGroqChatOptions = {}
): UseGroqChatResult {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>(
    systemPrompt ? [{ role: 'system', content: systemPrompt }] : []
  );
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(
    async (message: string) => {
      setIsLoading(true);
      setError(null);

      const newMessages: ChatCompletionMessageParam[] = [
        ...messages,
        { role: 'user', content: message },
      ];
      setMessages(newMessages);

      try {
        const res = await fetch('/api/groq/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages,
            ...options,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to get response');
        }

        const data = await res.json();
        setResponse(data.response);

        // Add assistant response to messages
        setMessages([
          ...newMessages,
          { role: 'assistant', content: data.response },
        ]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, options]
  );

  const reset = useCallback(() => {
    setMessages(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []);
    setResponse(null);
    setError(null);
  }, [systemPrompt]);

  return { messages, response, isLoading, error, sendMessage, reset };
}

interface UseGroqGenerateResult {
  response: string | any | null;
  isLoading: boolean;
  error: Error | null;
  generate: (prompt: string, systemPrompt?: string) => Promise<void>;
}

/**
 * Hook for one-off text generation with Groq
 */
export function useGroqGenerate(
  options: UseGroqChatOptions & { jsonMode?: boolean } = {}
): UseGroqGenerateResult {
  const [response, setResponse] = useState<string | any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generate = useCallback(
    async (prompt: string, systemPrompt?: string) => {
      setIsLoading(true);
      setError(null);
      setResponse(null);

      try {
        const res = await fetch('/api/groq/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            systemPrompt,
            ...options,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to generate response');
        }

        const data = await res.json();
        setResponse(data.response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  return { response, isLoading, error, generate };
}

interface UseGroqStreamResult {
  response: string;
  isStreaming: boolean;
  error: Error | null;
  streamMessage: (messages: ChatCompletionMessageParam[]) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for streaming responses from Groq
 */
export function useGroqStream(
  options: UseGroqChatOptions = {}
): UseGroqStreamResult {
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const streamMessage = useCallback(
    async (messages: ChatCompletionMessageParam[]) => {
      setIsStreaming(true);
      setError(null);
      setResponse('');

      try {
        const res = await fetch('/api/groq/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages,
            ...options,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to start stream');
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No reader available');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setIsStreaming(false);
                return;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.chunk) {
                  setResponse((prev) => prev + parsed.chunk);
                } else if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsStreaming(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setResponse('');
    setError(null);
  }, []);

  return { response, isStreaming, error, streamMessage, reset };
}
