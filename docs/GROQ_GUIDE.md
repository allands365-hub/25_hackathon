# Groq Integration Guide

## What is Groq?

Groq provides ultra-fast LLM inference with their LPU (Language Processing Unit) technology. It's perfect for hackathons because:
- **Blazing fast responses** - Much faster than traditional GPU inference
- **Free tier available** - Great for prototyping
- **Multiple models** - Llama 3, Mixtral, Gemma, and more
- **Simple API** - Easy to integrate

## Setup

### 1. Get Your API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key to your `.env.local`:

```bash
GROQ_API_KEY=your-groq-api-key-here
```

### 2. Available Models

The following models are pre-configured in the project:

**Fast & Efficient:**
- `llama-3.1-8b-instant` (Default) - Best balance of speed and quality
- `llama-3.2-1b-preview` - Ultra-fast, lightweight
- `llama-3.2-3b-preview` - Fast with better quality

**High Quality:**
- `llama-3.1-70b-versatile` - High quality, versatile
- `llama-3.1-405b-reasoning` - Best reasoning capabilities
- `mixtral-8x7b-32768` - Great for long context

**Vision Models:**
- `llama-3.2-11b-vision-preview` - Image analysis
- `llama-3.2-90b-vision-preview` - Advanced image understanding

## Usage Examples

### 1. Simple Text Generation

#### Backend (API Route)
```typescript
import { generate } from '@/lib/groq/utils';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const response = await generate(
    prompt,
    "You are a helpful assistant.", // system prompt
    { temperature: 0.7 }
  );

  return NextResponse.json({ response });
}
```

#### Frontend (React Hook)
```typescript
'use client';
import { useGroqGenerate } from '@/hooks/useGroq';

export function MyComponent() {
  const { response, isLoading, generate } = useGroqGenerate();

  const handleClick = async () => {
    await generate("Explain quantum computing in simple terms");
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        Generate
      </button>
      {isLoading && <p>Generating...</p>}
      {response && <p>{response}</p>}
    </div>
  );
}
```

### 2. Chat Conversation

```typescript
'use client';
import { useGroqChat } from '@/hooks/useGroq';

export function ChatComponent() {
  const { messages, response, isLoading, sendMessage } = useGroqChat(
    "You are a helpful coding assistant."
  );

  const [input, setInput] = useState('');

  const handleSend = async () => {
    await sendMessage(input);
    setInput('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend} disabled={isLoading}>
        Send
      </button>
    </div>
  );
}
```

### 3. Streaming Responses

```typescript
'use client';
import { useGroqStream } from '@/hooks/useGroq';

export function StreamingChat() {
  const { response, isStreaming, streamMessage } = useGroqStream();

  const handleStream = async () => {
    await streamMessage([
      { role: 'user', content: 'Tell me a long story' }
    ]);
  };

  return (
    <div>
      <button onClick={handleStream} disabled={isStreaming}>
        Stream Response
      </button>
      <div className="response">
        {response}
        {isStreaming && <span className="cursor">▊</span>}
      </div>
    </div>
  );
}
```

### 4. JSON Mode (Structured Output)

```typescript
import { generateJSON } from '@/lib/groq/utils';

// Generate structured data
const result = await generateJSON<{
  title: string;
  description: string;
  tags: string[];
}>(
  "Create a blog post about AI",
  "You are a content creator. Generate blog post metadata."
);

console.log(result.title); // Typed output!
```

### 5. Image Analysis (Vision)

```typescript
import { analyzeImage } from '@/lib/groq/utils';

const description = await analyzeImage(
  "https://example.com/image.jpg",
  "What objects are in this image?"
);
```

## API Routes

### `/api/groq/chat`
Chat completion with message history.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "model": "llama-3.1-8b-instant",
  "temperature": 0.7,
  "maxTokens": 1024
}
```

### `/api/groq/generate`
Simple text generation.

**Request:**
```json
{
  "prompt": "Write a haiku about coding",
  "systemPrompt": "You are a poet",
  "jsonMode": false
}
```

### `/api/groq/stream`
Streaming chat responses (Server-Sent Events).

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Tell me a story" }
  ]
}
```

## Common Use Cases for Hackathons

### 1. Content Generation
```typescript
const blogPost = await generateJSON(
  "Write a blog post about sustainable living",
  "You are a content writer. Output JSON with title, content, and tags."
);
```

### 2. Code Explanation
```typescript
const explanation = await generate(
  `Explain this code: ${codeSnippet}`,
  "You are a coding tutor. Explain code clearly and concisely."
);
```

### 3. Data Analysis
```typescript
const insights = await generateJSON(
  `Analyze this data: ${JSON.stringify(data)}`,
  "You are a data analyst. Provide insights in JSON format."
);
```

### 4. Chatbot
```typescript
// Use useGroqChat hook for a full conversational interface
const { sendMessage } = useGroqChat("You are a helpful assistant");
```

### 5. Image Description
```typescript
const description = await analyzeImage(imageUrl, "Describe this image in detail");
```

## Tips for Hackathons

1. **Start with the fast model**: Use `llama-3.1-8b-instant` for quick prototyping
2. **Use JSON mode**: When you need structured output, use `generateJSON()`
3. **Stream for UX**: Use streaming for better user experience with long responses
4. **Cache responses**: Store AI responses in Supabase to save API calls
5. **Lower temperature**: Use 0.3-0.5 for more consistent outputs
6. **System prompts**: Write clear system prompts to guide the AI behavior

## Model Selection Guide

**For speed (real-time chat):**
- `llama-3.1-8b-instant`
- `llama-3.2-3b-preview`

**For quality (content generation):**
- `llama-3.1-70b-versatile`
- `mixtral-8x7b-32768`

**For reasoning (complex tasks):**
- `llama-3.1-405b-reasoning`

**For images:**
- `llama-3.2-11b-vision-preview`

## Error Handling

All utility functions handle errors, but always wrap in try-catch:

```typescript
try {
  const response = await generate(prompt);
} catch (error) {
  console.error('Groq error:', error);
  // Handle error appropriately
}
```

## Rate Limits

Check Groq's current rate limits at [console.groq.com](https://console.groq.com). The free tier is generous for hackathons but be mindful of:
- Requests per minute
- Tokens per minute
- Consider caching responses in your database

## Combining with Supabase

Save AI-generated content to Supabase:

```typescript
const response = await generate("Generate a product description");

// Save to Supabase
await supabaseAdmin
  .from('products')
  .insert({
    description: response,
    generated_at: new Date().toISOString()
  });
```

## Debugging

1. **Check API key**: Ensure `GROQ_API_KEY` is set in `.env.local`
2. **Monitor console**: Check browser console and terminal for errors
3. **Test directly**: Use the Groq playground at console.groq.com
4. **Check rate limits**: You may be hitting rate limits

## Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Groq Playground](https://console.groq.com/playground)
- [Available Models](https://console.groq.com/docs/models)

## Quick Reference

```typescript
// Simple generation
import { generate } from '@/lib/groq/utils';
const text = await generate("prompt");

// JSON output
import { generateJSON } from '@/lib/groq/utils';
const data = await generateJSON<MyType>("prompt");

// Chat
import { chat } from '@/lib/groq/utils';
const response = await chat(messages);

// Streaming
import { chatStream } from '@/lib/groq/utils';
await chatStream(messages, (chunk) => console.log(chunk));

// Image analysis
import { analyzeImage } from '@/lib/groq/utils';
const description = await analyzeImage(url, "prompt");
```

Happy hacking!
