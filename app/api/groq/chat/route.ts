import { NextResponse } from 'next/server';
import { chat } from '@/lib/groq/utils';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, model, temperature, maxTokens } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const response = await chat(messages as ChatCompletionMessageParam[], {
      model,
      temperature,
      maxTokens,
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Groq chat error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate response' },
      { status: 500 }
    );
  }
}
