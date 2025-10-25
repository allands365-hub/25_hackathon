import { NextResponse } from 'next/server';
import { generate, generateJSON } from '@/lib/groq/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, systemPrompt, model, temperature, maxTokens, jsonMode } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let response;

    if (jsonMode) {
      // Use JSON mode to get structured output
      response = await generateJSON(prompt, systemPrompt, {
        model,
        temperature,
        maxTokens,
      });
    } else {
      // Regular text generation
      response = await generate(prompt, systemPrompt, {
        model,
        temperature,
        maxTokens,
      });
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Groq generate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate response' },
      { status: 500 }
    );
  }
}
