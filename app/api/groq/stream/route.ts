import { chatStream } from '@/lib/groq/utils';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, model, temperature, maxTokens } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400 }
      );
    }

    // Create a TransformStream for streaming the response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start the streaming chat in the background
    chatStream(
      messages as ChatCompletionMessageParam[],
      (chunk) => {
        // Send each chunk as Server-Sent Events format
        writer.write(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
      },
      {
        model,
        temperature,
        maxTokens,
      }
    )
      .then(() => {
        // Send done signal
        writer.write(encoder.encode('data: [DONE]\n\n'));
        writer.close();
      })
      .catch((error) => {
        console.error('Streaming error:', error);
        writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Streaming failed' })}\n\n`
          )
        );
        writer.close();
      });

    // Return the readable stream
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Stream setup error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to setup stream' }),
      { status: 500 }
    );
  }
}
