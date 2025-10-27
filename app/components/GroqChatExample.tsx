'use client';

import { useState } from 'react';
import { useGroqChat } from '@/hooks/useGroq';

export function GroqChatExample() {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage, reset } = useGroqChat(
    'You are a helpful assistant for a hackathon. Keep responses concise and practical.'
  );

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border border-border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Groq AI Chat</h2>
        <button
          onClick={reset}
          className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Messages */}
      <div className="space-y-4 mb-4 h-96 overflow-y-auto border border-border rounded p-4">
        {messages.length === 1 && (
          <p className="text-muted-foreground text-center">Start a conversation...</p>
        )}
        {messages.slice(1).map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-primary/100 text-white'
                  : 'bg-secondary text-foreground'
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {msg.role === 'user' ? 'You' : 'AI'}
              </p>
              <p className="whitespace-pre-wrap">{String(msg.content)}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          rows={2}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-primary/100 text-white rounded-lg hover:bg-primary/90 disabled:bg-secondary disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
