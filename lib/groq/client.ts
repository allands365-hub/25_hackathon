import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

// Initialize Groq client
export const groq = new Groq({
  apiKey,
});

// Available models on Groq
export const GROQ_MODELS = {
  // Mixtral models
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',

  // Llama models
  LLAMA_3_8B: 'llama3-8b-8192',
  LLAMA_3_70B: 'llama3-70b-8192',
  LLAMA_3_1_8B: 'llama-3.1-8b-instant',
  LLAMA_3_1_70B: 'llama-3.1-70b-versatile',
  LLAMA_3_1_405B: 'llama-3.1-405b-reasoning',
  LLAMA_3_2_1B: 'llama-3.2-1b-preview',
  LLAMA_3_2_3B: 'llama-3.2-3b-preview',
  LLAMA_3_2_11B_VISION: 'llama-3.2-11b-vision-preview',
  LLAMA_3_2_90B_VISION: 'llama-3.2-90b-vision-preview',

  // Gemma models
  GEMMA_7B: 'gemma-7b-it',
  GEMMA_2_9B: 'gemma2-9b-it',
} as const;

// Default model for quick use
export const DEFAULT_MODEL = GROQ_MODELS.LLAMA_3_1_8B;
